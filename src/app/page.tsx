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
        <main className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800 }}>My Todo App</h1>
                <Link href="/nova" className="btn">+ Nova Tarefa</Link>
            </header>

            {tasks?.length ? (
                tasks.map((t) => (
                    <div key={t.id} className="card">
                        <button
                            onClick={() => del.mutate({ id: t.id })}
                            className="btn danger delete"
                        >✕</button>
                        <h2>{t.titulo}</h2>
                        {t.descricao && <p>{t.descricao}</p>}
                        <time>{new Date(t.dataCriacao).toLocaleString()}</time>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: 'center', opacity: 0.8 }}>Nenhuma tarefa cadastrada.</p>
            )}
        </main>
    );
}