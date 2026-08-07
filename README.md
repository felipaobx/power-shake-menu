# Power Shake Menu

Cardápio digital com montagem de shakes, painel administrativo, fila operacional da cozinha e exportação de cardápio em PDF.

## Configuração

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para o ambiente da implantação.
3. Configure `REDIS_URL`, `ADMIN_PIN` e `APP_ORIGIN`.
4. Execute `npm test` e `npm run check` antes de publicar.

Em produção, `ADMIN_PIN` é obrigatório. Os usuários adicionais são cadastrados pelo painel e seus PINs são armazenados com salt e hash. As sessões expiram após oito horas e são mantidas em cookies inacessíveis ao JavaScript.

## Rotas

- `/` — cardápio público.
- `/dashboard` — administração, restrita a administradores.
- `/cozinha` — fila e disponibilidade de produtos, restrita a usuários autenticados.

## Persistência

O cardápio e as configurações públicas usam Redis. Cada pedido é salvo em uma chave individual e indexado por data, evitando que pedidos simultâneos sobrescrevam a lista inteira. Os 200 pedidos mais recentes são mantidos.
