'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '~/trpc/react';

export default function EditarTarefa() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const utils = api.useUtils();

    // Busca tarefa atual
    const { data: tarefa, isLoading } = api.task.list.useQuery(undefined, {
        select: (list) => list?.find((t) => t.id === id),
    });

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (tarefa) {
            setTitulo(tarefa.titulo);
            setDescricao(tarefa.descricao ?? '');
        }
    }, [tarefa]);

    const update = api.task.update.useMutation({
        async onSuccess() {
            await utils.task.list.invalidate();
            router.push('/');
        },
        onError: (err) => setErro(err.message),
    });

    if (isLoading) return <p className="container">Carregando…</p>;
    if (!tarefa) return <p className="container">Tarefa não encontrada.</p>;

    return (
        <main className="container">
            <header style={{ marginBottom: 24 }}>
                <Link href="/" style={{ color: '#9f9fff', textDecoration: 'none' }}>← Voltar</Link>
                <h1 style={{ fontSize: 24, marginTop: 8 }}>Editar Tarefa</h1>
            </header>

            {erro && <p style={{ color: '#ffaaaa' }}>{erro}</p>}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    update.mutate({ id, titulo, descricao });
                }}
            >
                <input
                    placeholder="Título"
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
                <button type="submit" className="btn" disabled={!titulo.trim() || update.isPending}>
                    {update.isPending ? 'Salvando…' : 'Atualizar'}
                </button>
            </form>
        </main>
    );
}
