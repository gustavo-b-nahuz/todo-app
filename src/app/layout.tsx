import { TRPCReactProvider } from '~/trpc/react';
import "~/styles/todo.css"

export const metadata = {
  title: 'My Todo App',
  description: 'Gerenciador simples de tarefas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="pt-BR">
      <body>
      <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      </html>
  );
}
