import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
declare module "express-session" {
  export interface Session {
    userId: number;
  }
}

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {
    session: Session & Partial<SessionData>;
  };
  // req: Request & { session: session.Session & { userId: number } };
  res: Response;
};
