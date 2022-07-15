import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String) //return type to be string
  hello() {
    return "bye";
  }
}
