import { ArcIdAny, command, string } from "@arcote.tech/arc";

export type InstructionCommandData = {
  chatId: ArcIdAny;
};

export const getInstructionCommand = <
  const Data extends InstructionCommandData
>(
  data: Readonly<Data>
) =>
  command("getInstruction")
    .withParams({
      chatId: data.chatId,
    })
    .withResult({
      instruction: string(),
    });

export type InstructionCommand<Data extends InstructionCommandData> =
  ReturnType<typeof getInstructionCommand<Data>>;

export type AnyInstructionCommand = InstructionCommand<InstructionCommandData>;

export type InstructionBuilder<Data extends InstructionCommandData> = (
  cmd: InstructionCommand<Data>
) => InstructionCommand<Data>;

export type AnyInstructionBuilder = InstructionBuilder<InstructionCommandData>;
