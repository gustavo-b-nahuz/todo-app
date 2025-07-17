'use client';

import Link from 'next/link';
import { api } from '~/trpc/react';

export default function Home() {
  const utils = api.useUtils();
  const { data: tasks } = api.task.list.useQuery();
  const del = api.task.delete.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });

  return (
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
        <h1 className="text-4xl font-bold mb-6">Minhas Tarefas</h1>
        <Link href="/nova" className="mb-4 text-[hsl(280,100%,70%)] underline">
          Nova tarefa
        </Link>

        <div className="w-full max-w-xl space-y-4">
          {tasks?.length ? (
              tasks.map((t) => (
                  <div key={t.id} className="rounded bg-white/10 p-4">
                    <strong className="block text-xl">{t.titulo}</strong>
                    {t.descricao && <p className="opacity-80">{t.descricao}</p>}
                    <small className="block opacity-70">{new Date(t.dataCriacao).toLocaleString()}</small>
                    <button
                        className="mt-2 text-red-400 hover:text-red-200"
                        onClick={() => del.mutate({ id: t.id })}
                    >
                      Excluir
                    </button>
                  </div>
              ))
          ) : (
              <p>Nenhuma tarefa cadastrada.</p>
          )}
        </div>
      </main>
  );
}