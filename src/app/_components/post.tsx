'use client';

import { api } from '~/trpc/react';
import Link from 'next/link';

export default function Home() {
    const utils = api.useUtils();
    const list = api.task.list.useQuery();
    const del = api.task.delete.useMutation({
        onSuccess: () => utils.task.list.invalidate(),
    });

    return (
        <main className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tarefas</h1>
            <Link href="/nova" className="text-blue-600 underline">Nova Tarefa</Link>
            {list.data?.map((t) => (
                <div key={t.id} className="border p-2 my-2 rounded shadow-sm">
                    <strong>{t.titulo}</strong>
                    <p>{t.descricao}</p>
                    <small>{new Date(t.dataCriacao).toLocaleString()}</small>
                    <div>
                        <button
                            className="text-red-500 mt-2"
                            onClick={() => del.mutate({ id: t.id })}
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            ))}
        </main>
    );
}
