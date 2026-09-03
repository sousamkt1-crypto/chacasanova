# Lista de Chá de Casa Nova

Site interativo em Next.js, pronto para a Vercel. As reservas são salvas em um banco Neon Postgres e o mesmo presente não pode ser escolhido duas vezes.

## Publicação rápida na Vercel

1. Descompacte este projeto.
2. Crie um repositório no GitHub e envie todos os arquivos da pasta para ele.
3. Entre em https://vercel.com/new, conecte o GitHub e importe o repositório.
4. Clique em **Deploy** para criar o projeto.
5. No projeto da Vercel, abra **Storage** ou **Marketplace** e instale **Neon Postgres**.
6. Vincule o banco ao projeto. A integração adicionará automaticamente a variável `DATABASE_URL`.
7. Vá até **Deployments**, abra o menu do último deploy e escolha **Redeploy**.
8. Acesse o endereço terminado em `.vercel.app`. Na primeira visita, a tabela de reservas será criada automaticamente.

## Usar domínio próprio

No projeto, abra **Settings > Domains**, informe o domínio comprado e siga os registros de DNS mostrados pela Vercel. Assim o site pode usar algo como `chadecasa.com.br`, sem `chatgpt.site` ou `vercel.app`.

## Rodar no computador

1. Instale Node.js 20.9 ou mais recente.
2. Copie `.env.example` para `.env.local` e coloque sua conexão do Neon em `DATABASE_URL`.
3. Execute `npm install` e depois `npm run dev`.
4. Abra http://localhost:3000.

## Personalização

- Presentes e categorias: `lib/gifts.ts`
- Cores e aparência: `app/globals.css`
- Texto e funcionamento da página: `app/page.tsx`
