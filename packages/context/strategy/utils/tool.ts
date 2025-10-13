import {
  $type,
  ArcCommandAny,
  ArcCommandContext,
  ArcContextElementAny,
  ArcIdAny,
  ArcObject,
  ArcObjectAny,
  ArcRawShape,
  object,
} from "@arcote.tech/arc";

export type ArcToolHandler<
  ContextElements extends ArcContextElementAny[],
  Params extends ArcObjectAny | null,
  Results extends ArcObjectAny[]
> = (
  ctx: ArcCommandContext<ContextElements>,
  chatId: $type<ArcIdAny>,
  params: Params extends ArcObjectAny ? $type<Params> : null
) => Promise<$type<Results[number]>> | $type<Results[number]>;

export class ArcTool<
  Name extends string,
  Params extends ArcObjectAny | null,
  Results extends ArcObjectAny[],
  const Elements extends ArcContextElementAny[]
> {
  static fromCommand<Command extends ArcCommandAny>(
    command: Command,
    mapChatContextToParams: (chatContext: {
      chatId: $type<ArcIdAny>;
    }) => Partial<$type<Command["_params"]>>
  ) {
    const tool = new ArcTool(command.name)
      .description(command._description ?? "")
      .withParams(command._params)
      .withResult(command._results)
      .use(command.getUsedElements())
      .handle((ctx, chatId, params) => {
        const mappedParams = mapChatContextToParams({ chatId });
        const commandParams = Object.assign({}, params, mappedParams);
        return command.commandClient(ctx)(commandParams);
      });
    return tool as ArcTool<
      Command["name"],
      Command["_params"],
      Command["_results"],
      Command["_elements"]
    >;
  }
  public _description?: string;
  public _params?: Params;
  public _results?: Results;
  public _elements?: Elements;
  public _handler?: ArcToolHandler<Elements, Params, Results> | false;

  constructor(public readonly name: Name) {}

  use<const E extends ArcContextElementAny[]>(elements: E) {
    const clone = this.clone();
    clone._elements = elements as any;
    return clone as unknown as ArcTool<Name, Params, Results, E>;
  }

  description(description: string) {
    const clone = this.clone();
    clone._description = description;
    return clone as unknown as ArcTool<Name, Params, Results, Elements>;
  }

  withParams<NewParams extends ArcRawShape>(
    schema: NewParams | ArcObject<NewParams>
  ) {
    const clone = this.clone();
    clone._params =
      schema instanceof ArcObject ? schema : (object(schema) as any);
    return clone as unknown as ArcTool<
      Name,
      ArcObject<NewParams>,
      Results,
      Elements
    >;
  }

  withResult<NewResults extends ArcRawShape[]>(...schemas: NewResults) {
    const clone = this.clone();
    clone._results = schemas.map((schema) => object(schema)) as any;
    return clone as unknown as ArcTool<
      Name,
      Params,
      { [K in keyof NewResults]: ArcObject<NewResults[K]> },
      Elements
    >;
  }

  handle(
    handler: ArcToolHandler<Elements, Params, Results> | false
  ): ArcTool<Name, Params, Results, Elements> {
    const clone = this.clone();
    clone._handler = handler;
    return clone;
  }

  run(
    ctx: any,
    chatId: $type<ArcIdAny>,
    params: Params extends ArcObjectAny ? $type<Params> : null
  ) {
    if (!this._handler) throw new Error("Handler not set");
    return this._handler(ctx, chatId, params) as Promise<
      $type<Results[number]>
    >;
  }

  getUsedElements(): Elements {
    return this._elements || ([] as any);
  }

  protected clone(): ArcTool<Name, Params, Results, Elements> {
    const clone = new ArcTool<Name, Params, Results, Elements>(this.name);
    clone._description = this._description;
    clone._params = this._params;
    clone._results = this._results;
    clone._handler = this._handler;
    clone._elements = this._elements;
    return clone;
  }

  toJsonSchema() {
    const parametersSchema = this._params
      ? (this._params as any).toJsonSchema?.() ?? {
          type: "object",
          properties: {},
        }
      : { type: "object", properties: {} };

    return {
      type: "function",
      name: this.name,
      description: this._description ?? undefined,
      parameters: parametersSchema,
    };
  }
}

export function command<Name extends string>(
  name: Name
): ArcTool<Name, null, any[], any[]> {
  return new ArcTool(name);
}

export type ArcToolAny = ArcTool<any, any, any, any>;
