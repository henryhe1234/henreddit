import { Entity, PrimaryKey, Property, OptionalProps } from "@mikro-orm/core";

@Entity()
export class Post {
  [OptionalProps]?: "title" | "updateAt" | "createdAt";

  @PrimaryKey()
  _id!: number;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: "text" })
  title!: string;
}
