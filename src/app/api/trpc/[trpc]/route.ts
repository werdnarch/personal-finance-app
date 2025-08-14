import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/router";
import { createContext } from "@/server/trpc/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    req,
    router: appRouter,
    createContext,
    endpoint: "/api/trpc",
  });

export { handler as GET, handler as POST };
