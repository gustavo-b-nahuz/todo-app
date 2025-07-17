import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type Task = {
    id: string;
    titulo: string;
    descricao?: string;
    dataCriacao: string;
};

// Armazenamento em memória
const tasks: Task[] = [];

export const taskRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({ titulo: z.string().min(1), descricao: z.string().optional() }))
        .mutation(({ input }) => {
            const nova: Task = {
                id: uuidv4(),
                titulo: input.titulo,
                descricao: input.descricao,
                dataCriacao: new Date().toISOString(),
            };
            tasks.unshift(nova);
            return nova;
        }),

    list: publicProcedure.query(() => tasks),

    update: publicProcedure
        .input(z.object({ id: z.string(), titulo: z.string().min(1), descricao: z.string().optional() }))
        .mutation(({ input }) => {
            const idx = tasks.findIndex((t) => t.id === input.id);
            if (idx === -1) throw new Error("Tarefa não encontrada");
            tasks[idx] = { ...tasks[idx], titulo: input.titulo, descricao: input.descricao };
            return tasks[idx];
        }),

    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ input }) => {
            const idx = tasks.findIndex((t) => t.id === input.id);
            if (idx === -1) throw new Error("Tarefa não encontrada");
            tasks.splice(idx, 1);
            return { sucesso: true };
        }),
});
