# Biblioteca CRUD – Angular + Angular Material + Bootstrap + json‑server

Projeto de estudo **direto ao ponto** com:

- Frontend: **Angular 20 (standalone)** + **Angular Material** + **Bootstrap (layout utilitário)**.
- Backend mock: **json-server** com **relações N–N** (livros↔autores, livros↔categorias) e **1–1** (publicação do livro).

Coberto:

- CRUD de **Categorias**, **Autores** e **Livros**.
- Diálogos (MatDialog) para criar/editar.
- Lista com **busca**, **paginação server-side**, **sort server-side** (campos nativos) + **sort client-side** (campos agregados).
- Enriquecimento de lista de livros com **autores**, **categorias** e **páginas** (publicação).

---

## 1) Requisitos

- Node 18+
- Angular CLI 20: `npm i -g @angular/cli`
- NPM
- Opcional: VSCode

---

## 2) Estrutura sugerida de pastas (frontend)

```
src/
  app/
    core/
      guard/
        auth.guard.ts
      layout/
        blank/
          blank.ts
        full/
          full.ts
      ui/
        toolbar/
          toolbar.ts
    features/
      auth/
        login/
          login.ts
        register/
          register.ts
      authors/
        author.service.ts
        author-dialog/
          author-dialog.ts
        author-list/
          author-list.ts
      books/
        book.service.ts
        book-dialog/
          book-dialog.ts
        book-list/
          book-list.ts
      categories/
        category.service.ts
        category-dialog/
          category-dialog.ts
        category-list/
          category-list.ts
    shared/
      components/
        confirm-dialog/
          confirm-dialog.ts
      models/
        author.ts
        book-author.ts
        book-category.ts
        book-publication.ts
        book.ts
        category.ts
        page.ts
        user.ts
      services/
        auth.service.ts
        author.service.ts
        book.service.ts
        category.service.ts
    app.routes.ts
  environments/
    environment.ts
styles.css
```

---

## 3) Backend mock – json-server

### 3.1 Instalação e execução

```bash
npm i -D json-server
npx json-server --watch db.json --routes routes.json --port 3000
```

Backend roda em **http://localhost:3000**.

### 3.2 `db.json` (exemplo mínimo)

```json
{
  "books": [
    { "id": 1, "title": "Clean Code", "publicationYear": 2008 },
    { "id": 2, "title": "Domain-Driven Design", "publicationYear": 2003 }
  ],
  "authors": [
    { "id": 1, "name": "Robert C. Martin", "birthYear": 1952, "nationality": "USA" },
    { "id": 2, "name": "Eric Evans", "birthYear": 1965, "nationality": "USA" }
  ],
  "categories": [
    { "id": 1, "name": "Software", "description": "Engenharia de Software" },
    { "id": 2, "name": "Arquitetura", "description": "Modelagem e arquitetura" }
  ],
  "book_authors": [
    { "id": 1, "bookId": 1, "authorId": 1 },
    { "id": 2, "bookId": 2, "authorId": 2 }
  ],
  "book_categories": [
    { "id": 1, "bookId": 1, "categoryId": 1 },
    { "id": 2, "bookId": 2, "categoryId": 2 }
  ],
  "book_publications": [
    {
      "id": 1,
      "bookId": 1,
      "publisherName": "Prentice Hall",
      "city": "Upper Saddle River",
      "edition": "1st",
      "pages": 464
    }
  ],
  "users": [
    {
      "id": 1,
      "name": "Admin",
      "email": "admin@demo.com",
      "password_hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92" // 123456
    }
  ]
}
```

### 3.3 `routes.json`

```json
{
  "/books/:id/authors": "/book_authors?bookId=:id&_expand=author",
  "/books/:id/categories": "/book_categories?bookId=:id&_expand=category",
  "/books/:id/publication": "/book_publications?bookId=:id",

  "/authors/:id/books": "/book_authors?authorId=:id&_expand=book",
  "/categories/:id/books": "/book_categories?categoryId=:id&_expand=book",

  "/search/books/:q": "/books?q=:q",
  "/search/authors/:q": "/authors?q=:q",
  "/search/categories/:q": "/categories?q=:q"

  "/users/by-email/:email": "/users?email=:email"
}
```

### 3.4 Exemplos de endpoints

- Listar livros: `GET /books?_page=1&_limit=10&_sort=title&_order=asc&q=clean`
- Autores de um livro: `GET /books/1/authors` (usa `_expand=author`)
- Categorias de um livro: `GET /books/1/categories`
- Publicação: `GET /books/1/publication` (retorna array; use `arr[0]`)
- Vincular autor: `POST /book_authors { "bookId": 1, "authorId": 2 }`
- Vincular categoria: `POST /book_categories { "bookId": 1, "categoryId": 2 }`
- Upsert publicação: `POST /book_publications { "bookId": 2, ... }` ou `PATCH /book_publications/:id`

---

## 4) Frontend – configuração

### 4.1 Dependências

```bash
npm i @angular/material @angular/cdk
npm i bootstrap
```

No `styles.scss`:

```css
@use "bootstrap/scss/bootstrap";
```

Providers no `main.ts`/`app.config.ts`:

```ts
provideHttpClient(), provideRouter(routes);
```

### 4.2 `environment.ts`

```ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000",
};
```

---

## 5) Services principais (resumo)

### 5.1 `BookService`

- `listPaged({ q, _page, _limit, _sort, _order })`: paginação e busca server-side.
- `getDetail(id)`: retorna `{ book, authors[], categories[], publication }` (combina chamadas).
- `linkAuthor`, `linkCategory`, `unlinkAuthor`, `unlinkCategory`, `findAuthorLink`, `findCategoryLink`.
- `upsertPublication(bookId, data)`: garante 1–1 (faz GET e PATCH/POST).
- `createFull(...)` e `updateFull(...)`: operações compostas (book + vínculos + publicação).

### 5.2 `AuthorService` / `CategoryService`

- `listPaged`, `get`, `create`, `update`, `delete`.
- `books(authorId)` para listar livros de um autor via rota expandida.

---

## 6) Componentes (CRUD)

### 6.1 Lista de Livros (enriquecida)

- Busca/paginação/sort.
- **Server-side sort** para campos nativos do `book` (`title`, `publicationYear`, `isbn`, `id`).
- **Client-side sort** para agregados: `authors`, `categories`, `pages` (porque vêm de chamadas adicionais).

### 6.2 Diálogo de Livros

- Seleção múltipla de autores e categorias (MatSelect multiple).
- Seção **Publicação** com toggle “Usar publicação / Sem publicação”.

### 6.3 Listas/Diálogos de Autores e Categorias

- Padrão idêntico: lista com busca/sort/paginação; diálogo de criar/editar; confirmação de exclusão.

---

## 7) Rotas do app

`app.routes.ts` (exemplo):

```ts
export const routes: Routes = [
  { path: "", redirectTo: "books", pathMatch: "full" },
  {
    path: "",
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "authors",
        loadChildren: () => import("./features/authors/author-list/author-list").then((m) => m.AuthorListComponent),
      },
      {
        path: "books",
        loadChildren: () => import("./features/books/book-list/book-list").then((m) => m.BookListComponent),
      },
      {
        path: "categories",
        loadChildren: () => import("./features/categories/category-list/category-list").then((m) => m.CategoryListComponent),
      },
    ],
  },
  {
    path: "",
    component: BlankComponent,
    children: [
      {
        path: "login",
        loadChildren: () => import("./features/auth/login/login").then((m) => m.LoginComponent),
      },
      {
        path: "register",
        loadComponent: () => import("./features/auth/register/register").then((m) => m.RegisterComponent),
      },
    ],
  },
  { path: "**", redirectTo: "" },
];
```

---

## 8) Scripts NPM úteis

Coloque no `package.json` (ajuste portas se quiser):

```json
{
  "scripts": {
    "start": "ng serve -o",
    "server": "json-server --watch db.json --routes routes.json --port 3000",
    "dev": "concurrently \"npm run server\" \"npm start\""
  }
}
```

---

## 9) Boas práticas e pegadinhas

- **1–1 de publicação**: `json-server` **não** impede duplicados. O `upsertPublication` faz o saneamento, mas outro POST direto pode duplicar. Se precisar, crie middleware.
- **Sort misto**: server pros campos nativos; client para agregados. Não há como ordenar `authors/categories/pages` diretamente no `json-server` sem alterar schema.
- **`mat-form-field` x Bootstrap**: não misture `.form-control` dentro de `mat-form-field`. Bootstrap fica para **layout** (grid/flex/gap) e Material para **componentes**.
- **Paginação server-side**: o total vem do header `X-Total-Count`. Sempre chame com `_page` e `_limit`.

---

## 10) Testes rápidos (curl)

```bash
# lista livros (página 1, 10 itens)
curl 'http://localhost:3000/books?_page=1&_limit=10'

# autores do livro 1
curl 'http://localhost:3000/books/1/authors'

# categorias do livro 1
curl 'http://localhost:3000/books/1/categories'

# publicação do livro 1
curl 'http://localhost:3000/books/1/publication'

# vincular autor 2 ao livro 1
curl -X POST 'http://localhost:3000/book_authors' \
  -H 'Content-Type: application/json' \
  -d '{ "bookId": 1, "authorId": 2 }'
```

---

## 11) Roadmap (futuro)

- Guardar cache de detalhes em `signal`/store.
- Resolver pré-carregando detalhes via `route resolver`.
- Export CSV/PDF das listas.
- Autocomplete de autores/categorias no diálogo de livros.
- Gestão de usuários/loans (empréstimos) para ficar mais realista.

---

## 12) Licença

Uso livre para estudo e prototipagem. Faça bom proveito.
