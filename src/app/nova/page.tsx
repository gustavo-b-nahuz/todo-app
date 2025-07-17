'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '~/trpc/react';

export default function NovaTarefa() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState('');
    const router = useRouter();
    const utils = api.useUtils()
    const create = api.task.create.useMutation({
        async onSuccess () {
            await utils.task.list.invalidate();
            router.push('/')
        },
        onError: (err) => setErro(err.message),
    });

    return (
        <main className="container">
            <header style={{ marginBottom: 24 }}>
                <Link href="/" style={{ color: '#9f9fff', textDecoration: 'none' }}>← Voltar</Link>
                <h1 style={{ fontSize: 24, marginTop: 8 }}>Nova Tarefa</h1>
            </header>

            {erro && <p style={{ color: '#ffaaaa' }}>{erro}</p>}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    create.mutate({ titulo, descricao });
                }}
            >
                <input
                    placeholder="Título da tarefa"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Descrição (opcional)"
                    rows={4}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
                <button type="submit" className="btn" disabled={create.isPending || !titulo.trim()}>
                    {create.isPending ? 'Salvando…' : 'Salvar'}
                </button>
            </form>
        </main>
    );
}
