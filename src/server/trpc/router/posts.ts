import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const postsRouter = router({
  getAll: publicProcedure.query(() => [
    { id: 1, title: "First Post" },
    { id: 2, title: "Second Post" },
  ]),
  create: publicProcedure.input(z.string()).mutation((opts) => {
    return { id: Math.random(), title: opts.input };
  }),
});
