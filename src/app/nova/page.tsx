'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import Link from 'next/link';

export default function NovaTarefa() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState('');
    const router = useRouter();

    const create = api.task.create.useMutation({
        onSuccess: () => router.push('/'),
        onError: (err) => setErro(err.message),
    });

    return (
        <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">Nova Tarefa</h1>
            <div className="w-full max-w-xl space-y-4">
                {erro && <p className="text-red-300">{erro}</p>}
                <input
                    className="w-full rounded bg-white/10 p-3 outline-none"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <textarea
                    className="w-full rounded bg-white/10 p-3 outline-none"
                    placeholder="Descrição (opcional)"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
                <button
                    className="w-full rounded bg-[hsl(280,100%,70%)] p-3 font-semibold disabled:opacity-50"
                    disabled={!titulo.trim() || create.isPending}
                    onClick={() => create.mutate({ titulo, descricao })}
                >
                    {create.isPending ? 'Salvando...' : 'Salvar'}
                </button>
                <Link href="/" className="block text-center underline">
                    Voltar
                </Link>
            </div>
        </main>
    );
}