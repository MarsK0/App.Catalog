# App.Catalog

> ⚠️ **Status: em desenvolvimento — projeto não funcional no momento.**
> Estrutura inicial gerada via Angular CLI. Ainda não há telas/fluxos funcionais nem integração completa com a API.

Front-end do **Api.Catalog** ([repositório da API](https://github.com/MarsK0/Api.Catalog)) — catálogo de produtos e gestão de orçamentos/pedidos, com suporte a multi-tenancy. Para detalhes de domínio e regras de negócio, ver o README da API.

## Tecnologias

- **Angular** (CLI v22, standalone components, SSR habilitado — `main.server.ts`/`server.ts`)
- **TypeScript**
- **Tailwind CSS / PostCSS** (`.postcssrc.json`)
- **Spartan/ui** (*shadcn/ui* para Angular) — componentes de UI configurados via `components.json`
- **RxJS** para fluxos assíncronos (HTTP, interceptors)

## Estrutura de pastas (raiz)

```
App.Catalog/
├── .vscode/
├── public/                  # Assets estáticos
├── src/                     # Código-fonte (ver detalhamento abaixo)
├── .postcssrc.json          # Configuração do PostCSS/Tailwind
├── angular.json              # Configuração do workspace Angular
├── components.json           # Configuração do Spartan/ui (shadcn/ui para Angular)
├── proxy.conf.json           # Proxy de desenvolvimento para a API
├── tsconfig*.json
└── package.json
```

## Estrutura interna de `src`

```
src/
├── app/
│   ├── app.ts / app.routes.ts / app.config.ts   # Bootstrap, rotas e providers
│   ├── core/            # Autenticação (service, guard, token) e models
│   ├── interceptors/    # Interceptors HTTP globais (auth, erros, tenant)
│   ├── features/        # Telas/fluxos de negócio (login, dashboard)
│   ├── layout/          # Shell da aplicação (sidebar, header)
│   └── shared/          # Componentes e serviços reutilizáveis (inclui Spartan/ui)
│
├── environments/        # Variáveis de ambiente
├── index.html
├── main.ts / main.server.ts / server.ts   # Bootstrap client-side e SSR
└── styles.css
```

- **`core/`**: autenticação (login, sessão, refresh de token) e guard de rotas.
- **`interceptors/`**: tratamento transversal de requisições HTTP (token, tenant, erros).
- **`features/`**: telas de negócio, carregadas via lazy loading.
- **`layout/`**: estrutura visual (sidebar, header) que envolve as telas autenticadas.
- **`shared/`**: componentes/serviços comuns, incluindo a biblioteca **Spartan/ui**.

> A resolução do tenant pela URL e a integração com `/me` (descritas no README da API) ainda não estão implementadas — hoje o tenant é fixo por ambiente.

## Scripts disponíveis

```bash
npm install     # instalar dependências
ng serve        # servidor de desenvolvimento (http://localhost:4200)
```
