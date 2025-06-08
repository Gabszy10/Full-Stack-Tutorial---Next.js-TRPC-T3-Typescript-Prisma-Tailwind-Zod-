import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    console.log(
      "todos from prisma",
      todos.map(({ id, text, done }) => ({ id, text, done })),
    );

    return [
      {
        id: "fake",
        text: "fake text",
        done: false,
      },
      {
        id: "fake",
        text: "fake text",
        done: true,
      },
    ];
  }),

  create: protectedProcedure
    .input(z.string({ required_error: "Describe your todo" }).min(1).max(50))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          text: input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
