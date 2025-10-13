import {
  ArcIdAny,
  ArcNumber,
  ArcObject,
  ArcObjectAny,
  ArcStaticView,
  ArcString,
  ArcView,
} from "@arcote.tech/arc";

type ProductSchema = ArcObject<{
  name: ArcString;
  price: ArcNumber;
  description: ArcString;
  metadata: ArcObjectAny;
}>;

export type ProductsView<Id extends ArcIdAny, Schema extends ProductSchema> =
  | ArcView<any, Id, Schema, any>
  | ArcStaticView<any, Id, Schema, any>;

export type ProductsViewAny = ProductsView<ArcIdAny, ProductSchema>;
