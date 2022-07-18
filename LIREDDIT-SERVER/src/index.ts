import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import * as redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const emFork = orm.em.fork(); // <-- create the fork
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    legacyMode: true,
  });
  await redisClient.connect();

  app.use(
    session({
      name: "qid",

      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: "none", //csrf
        secure: true, //cookie only works in https
      },
      saveUninitialized: false,
      secret: "hfkalsjdfiowejskdlfj",
      resave: false,
    })
  );
  app.set("trust proxy", true);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),

    context: ({ req, res }): MyContext => ({ em: emFork, res, req }),
  });
  const cors = {
    credentials: true,
    origin: "https://studio.apollographql.com",
  };
  await apolloServer.start();
  await apolloServer.applyMiddleware({ app, cors });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
