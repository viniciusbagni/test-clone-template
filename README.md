# Template de Automação E2E

Template de automação E2E com **Playwright** + **TypeScript**, seguindo **Page Object Model (POM)**.

Use este repositório como base para criar `qa-<produto>-tests` (GitHub **Use this template** ou clone).

---

## Stack

| Tecnologia | Uso |
|------------|-----|
| Playwright | Runner E2E (UI e API) |
| TypeScript | Tipagem estática |
| dotenv | Variáveis de ambiente |
| @faker-js/faker | Dados fake nos testes |

---

## Quick start

```bash
# 1. Criar o repo a partir do template (ou clonar) e entrar na pasta
# 2. Configurar ambiente
cp .env.example .env
# Edite .env com BASE_URL, LOGIN_EMAIL e LOGIN_PASSWORD do seu env (dev ou hom)

# 3. Instalar dependências e browsers
npm install

# 4. Rodar os testes
npm test
```

Checklist pós-clone:

- [ ] Renomear `"name"` em `package.json` para `qa-<produto>-tests`
- [ ] Preencher `.env` (nunca commitar esse arquivo)
- [ ] Configurar secrets de CI em `dev` / `hom` (ver seção CI/CD)

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm test` | Roda todos os testes (headless) |
| `npm run test:headless` | Roda em modo headed (com browser visível) |
| `npm run test:debug` | Abre o Playwright Inspector |
| `npm run test:ui` | UI Mode do Playwright |

---

## Estrutura do repositório

```text
qa-<produto>-tests/
├── pages/                         # Page Objects + locators
│   ├── LoginPage.ts
│   ├── index.ts
│   └── locators/
│       └── login_locators.ts
├── fixtures/                      # Injeção de dependências + dados fake
│   ├── test_fixtures.ts
│   └── faker_data_generator.ts
├── tests/
│   ├── ui/                        # Specs de interface (GUI)
│   │  └── validate_login.spec.ts
│   └── api/                       # Specs de API (vazio no template)
├── devops/
│   ├── dev/playwright.yml         # Pipeline ambiente dev
│   └── hom/playwright.yml         # Pipeline ambiente hom
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── .env                           # Local (não versionado)
├── .gitignore
└── README.md
```

Artefatos gerados em runtime (não editar / não versionar):

- `playwright-report/` — relatório HTML
- `test-results/` — traces, screenshots e vídeos de falha
- `node_modules/` — dependências

---

## Mapa detalhado: pastas e arquivos

### `support/pages/` — Page Objects

Encapsulam ações e navegação da UI. Specs **não** devem conter seletores nem cliques diretos.

#### `pages/Login.ts`

Page Object da tela genérica de login. Usa `LoginLocators` para utilização do seletores da página de exemplo.

Métodos principais:

- `visitBaseUrlLogin()` — abre a URL base (`BASE_URL`)
- `fillEmail` / `fillPassword` / `clickLogin`

#### `support/locators/login_locators.ts`

Seletores da tela de login.

#### `pages/index.ts`

Barrel export dos Page Objects (`export * from './LoginPage'`). Ao criar um novo Page Object, exporte-o aqui.

---

### `fixtures/` — Injeção de dependências

#### `fixtures/test_fixtures.ts`

Estende o `test` do Playwright e injeta fixtures tipadas:

- `loginPage` → instância de `LoginPage`
- `loginLocators` → instância de `LoginLocators`

Nos specs, importe sempre:

```typescript
import { test } from '../../fixtures/test_fixtures'
```
Ao criar um novo Page Object, registre a fixture correspondente neste arquivo.

#### `fixtures/faker_data_generator.ts`

Helpers com `@faker-js/faker`:

- `randomEmail()`
- `randomPassword()`

Usado nos testes negativos de login (credenciais inválidas).

---

### `tests/` — Specs

Separação por tipo de teste:

| Pasta | Responsabilidade |
|-------|------------------|
| `tests/ui/` | Fluxos de browser (GUI) via Page Objects / fixtures |
| `tests/api/` | Contratos HTTP (request/response), sem Page Objects de GUI |

#### `tests/ui/validate_login.spec.ts`

Vazio no template (apenas o arquivo como exemplo, sem testes). Cada time adiciona specs em `tests/api/<feature>.spec.ts`.

#### `tests/api/`

Vazio no template. Cada time adiciona specs em `tests/api/<feature>.spec.ts`.

---

### Configuração e ambiente

#### `playwright.config.ts`

Configuração do runner:

- `testDir: './tests'` — cobre `ui/` e `api/`
- `use.baseURL` ← `process.env.BASE_URL` (carregado via dotenv)
- retries/workers ajustados quando `CI=true`
- screenshot/vídeo em falha; trace no primeiro retry

#### `.env.example`

Modelo de variáveis (dev e hom documentados). Copie para `.env` e preencha:

| Variável | Descrição |
|----------|-----------|
| `BASE_URL` | URL do login / app no ambiente alvo |
| `LOGIN_EMAIL` | E-mail |
| `LOGIN_PASSWORD` | Senha  |

#### `.env`

Arquivo local com credenciais reais. **Não versionar** (já está no `.gitignore`).

#### `package.json`

Nome do projeto, scripts npm e dependências de desenvolvimento. Após clonar o template, altere `"name"` para `qa-<produto>-tests`.

#### `tsconfig.json`

Opções do TypeScript do projeto.

#### `.gitignore`

Ignora `.env`, `node_modules/`, `test-results/`, `playwright-report/` e caches do Playwright.

---

### `devops/` — CI/CD por ambiente

Pipelines modularizados: **um YAML por ambiente**.

| Arquivo | Ambiente |
|---------|----------|
| `devops/dev/playwright.yml` | Desenvolvimento |
| `devops/hom/playwright.yml` | Homologação |

Cada arquivo define checkout, setup Node, `npm install`, instalação de browsers, execução dos testes e upload do `playwright-report`.

**Contrato com o app:** o CI injeta `BASE_URL`, `LOGIN_EMAIL` e `LOGIN_PASSWORD` do ambiente (GitHub Environments / secrets). O repo de QA não empacota a aplicação — só aponta para a URL do env.

---

## O que alterar vs o que manter

| Ação | Itens |
|------|--------|
| **Alterar quase sempre** | `.env`, secrets de CI, `package.json` → `name`, pages/specs do produto |
| **Customizar se necessário** | `login_locators.ts` / `LoginPage` para a tela correspondente |

---

## Como adicionar uma feature

1. **Locators** — `pages/locators/<feature>_locators.ts`
2. **Page Object** — `pages/<Feature>Page.ts` + export em `pages/index.ts`
3. **Fixture** — registrar em `fixtures/test_fixtures.ts`
4. **Spec**
   - GUI: `tests/ui/<feature>.spec.ts`
   - API: `tests/api/<feature>.spec.ts`

---

## Convenções rápidas

- Specs importam fixtures; **não** instanciam Page Objects manualmente
- Seletores ficam em `locators/`; Page Objects só orquestram ações
- Agrupe cenários com `test.describe` e passos com `test.step`
- Credenciais e URLs só via `.env` / secrets de CI
