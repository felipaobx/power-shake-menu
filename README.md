# Power Shake

Cardápio digital completo com três áreas separadas:

- Cardápio público para clientes montarem e enviarem pedidos.
- Dashboard administrativo para produtos, categorias, identidade visual, configurações e usuários.
- Painel da cozinha para acompanhar pedidos novos, em preparo, prontos e finalizados.

## Acesso inicial

- Usuário: `admin`
- Senha: `admin`

O perfil **Administrador** acessa o Dashboard e a Cozinha. O perfil **Cozinha** acessa somente a Cozinha.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e configure:

- `DATABASE_URL`: banco PostgreSQL compatível com Neon.
- `AUTH_SECRET`: chave longa e aleatória para assinar as sessões.
- `BLOB_READ_WRITE_TOKEN`: opcional, usado para upload de imagens.

Sem `DATABASE_URL`, o acesso inicial `admin/admin` funciona em modo local, mas novos usuários não são persistidos.

## Verificação

```bash
npm run lint
npm run build
```
