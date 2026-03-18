# StoreHub

A product catalog REST API with a React frontend, built as a full-stack monorepo. The backend follows a layered architecture (Repository + Service pattern) with token-based authentication via Laravel Sanctum. Everything runs through Docker Compose with a single command.

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed
- Ports `3000`, `8080`, and `3306` available on your machine

### 1. Clone the repository

```bash
git clone https://github.com/lubjr/storehub.git
cd storehub
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

| Variable           | Description                           | Example              |
|--------------------|---------------------------------------|----------------------|
| `DB_DATABASE`      | MySQL database name                   | `laravel_shop`       |
| `DB_USERNAME`      | MySQL user                            | `laravel_user`       |
| `DB_PASSWORD`      | MySQL user password                   | `your_password`      |
| `DB_ROOT_PASSWORD` | MySQL root password                   | `your_root_password` |
| `APP_KEY`          | Laravel app key (generated in step 4) | `base64:...`         |

### 3. Build and start all containers

```bash
docker compose up -d --build
```

### 4. Generate the Laravel application key

```bash
docker compose exec backend php artisan key:generate
```

### 5. Run migrations and seed the database

```bash
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan db:seed
```

This creates 5 categories and 50 products with randomized data.

### 6. Access the application

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:3000            |
| API      | http://localhost:8080/api        |
| Health   | http://localhost:8080/api/health |

---

## Production

Live at: **https://storehub.lubjr.dev**

### Stack

| Component  | Solution                        |
|------------|---------------------------------|
| Server     | AWS EC2 t3.small (us-east-1)    |
| SSL        | Let's Encrypt (auto-renew)      |
| CI/CD      | GitHub Actions                  |

### CI/CD — Automatic deploy

Every push to `main` triggers the deploy pipeline automatically:

```
push to main
    ↓
GitHub Actions
    ↓
SSH into EC2
    ↓
git pull + docker compose up -d --build
    ↓
php artisan migrate --force + config:cache
    ↓
Deploy complete (~2-3 min)
```

To set up in a new environment, add these secrets in **GitHub → Settings → Secrets → Actions**:

| Secret            | Value                    |
|-------------------|--------------------------|
| `SERVER_HOST`     | EC2 public IP            |
| `SERVER_USER`     | `ubuntu`                 |
| `SSH_PRIVATE_KEY` | Contents of the `.pem` file |

---

## Tech Stack

| Layer    | Technology                               |
|----------|------------------------------------------|
| Backend  | Laravel 12, PHP 8.4, Laravel Sanctum     |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4 |
| Database | MySQL 8                                  |
| Server   | Nginx (reverse proxy + SPA serving)      |
| Runtime  | Docker, Docker Compose                   |

---

## Architecture

### Backend — Layered Architecture

```
HTTP Request
    │
    ▼
Controller        — receives request, returns response. No business logic.
    │
    ▼
FormRequest       — validates and sanitizes input before it reaches the controller.
    │
    ▼
Service           — contains all business logic. Orchestrates repository calls.
    │
    ▼
Repository        — single point of database access. Implements an interface.
    │
    ▼
Eloquent Model    — defines relationships and fillable fields.
    │
    ▼
API Resource      — transforms the model into a consistent JSON response contract.
```

**Why this structure?**
- Controllers stay thin and readable — one responsibility: HTTP in/out.
- Services own the logic, making it testable independently of HTTP.
- Repositories are bound to interfaces (`ProductRepositoryInterface`), so the data source can be swapped without touching services or controllers (dependency inversion).
- FormRequests centralize validation, keeping controllers free of `$request->validate()` calls.
- API Resources decouple the model from the response contract — internal field changes don't silently break the API.

### Key backend files

```
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── ProductController.php
│   │   └── CategoryController.php
│   ├── Requests/
│   │   ├── Auth/LoginRequest.php
│   │   ├── Auth/RegisterRequest.php
│   │   ├── Product/StoreProductRequest.php
│   │   └── Product/UpdateProductRequest.php
│   └── Resources/
│       ├── UserResource.php
│       ├── ProductResource.php
│       └── CategoryResource.php
├── Services/
│   ├── AuthService.php
│   ├── ProductService.php
│   └── CategoryService.php
├── Repositories/
│   ├── Contracts/
│   │   ├── ProductRepositoryInterface.php
│   │   └── CategoryRepositoryInterface.php
│   ├── ProductRepository.php
│   └── CategoryRepository.php
└── Models/
    ├── User.php
    ├── Product.php
    └── Category.php
```

### Frontend — React + TypeScript

```
src/
├── api/client.ts            — Axios instance with Bearer token interceptor
├── contexts/AuthContext.tsx — Global auth state (login, register, logout)
├── hooks/useAuth.ts         — Hook to consume AuthContext
├── types/index.ts           — TypeScript interfaces (Product, Category, User)
├── components/
│   ├── ProductCard.tsx
│   ├── SearchBar.tsx        — Debounced search input (400ms)
│   ├── CategoryFilter.tsx
│   ├── Pagination.tsx
│   └── ProtectedRoute.tsx  — Redirects unauthenticated users to /login
└── pages/
    ├── Home/               — Product listing with search, filter and pagination
    ├── ProductDetail/      — Full product view with edit and delete (authenticated)
    ├── ProductForm/        — Create and edit form (protected route)
    ├── Login/
    └── Register/
```

### Docker — Container layout

```
┌──────────────────────────────────────────────────────┐
│                  Docker Compose                       │
│                                                      │
│  proxy (Nginx)     :80 / :443  ←── public entry      │
│  nginx (Nginx)     :8080       ←── Laravel reverse proxy │
│  frontend (Nginx)  :3000       ←── React SPA          │
│  backend (PHP-FPM) :9000       ←── internal only      │
│  db (MySQL 8)      :3306       ←── internal only      │
└──────────────────────────────────────────────────────┘
```

- `proxy` is the public-facing reverse proxy — routes `/api/` to `nginx` and `/` to `frontend`. Handles SSL termination.
- `nginx` acts as the reverse proxy for the Laravel backend — forwards PHP to `backend:9000` via FastCGI.
- `frontend` is a multi-stage Docker build: Node 20 compiles the Vite app, then Nginx Alpine serves the static `dist/`.
- `db` has a healthcheck — `backend` only starts after MySQL is ready.

---

## API Endpoints

### Authentication

| Method | Endpoint        | Auth | Body                                                 | Description                         |
|--------|-----------------|------|------------------------------------------------------|-------------------------------------|
| POST   | `/api/register` | —    | `name`, `email`, `password`, `password_confirmation` | Register a new user. Returns token. |
| POST   | `/api/login`    | —    | `email`, `password`                                  | Login. Returns token.               |
| POST   | `/api/logout`   | ✅   | —                                                    | Revokes current token.              |

### Products

| Method | Endpoint             | Auth | Query params                 | Description                                                                                                        |
|--------|----------------------|------|------------------------------|--------------------------------------------------------------------------------------------------------------------|
| GET    | `/api/products`      | —    | `page`, `search`, `category` | Paginated product list (15/page). Supports full-text search by name or description and filtering by `category_id`. |
| GET    | `/api/products/{id}` | —    | —                            | Single product with category.                                                                                      |
| POST   | `/api/products`      | ✅   | —                            | Create a product.                                                                                                  |
| PUT    | `/api/products/{id}` | ✅   | —                            | Update a product.                                                                                                  |
| DELETE | `/api/products/{id}` | ✅   | —                            | Delete a product. Returns 204.                                                                                     |

**Request body for POST/PUT `/api/products`:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category_id": 1,
  "image_url": "https://example.com/image.jpg"
}
```

**Response format:**

All responses are transformed through API Resources. Single resources are wrapped in a `data` key; paginated collections include `data`, `links`, and `meta`.

```json
// Single product (GET /api/products/{id})
{
  "data": {
    "id": 1,
    "name": "Wireless Headphones",
    "description": "...",
    "price": "99.99",
    "image_url": "https://...",
    "category": { "id": 1, "name": "Electronics" },
    "created_at": "2026-01-01T00:00:00.000000Z",
    "updated_at": "2026-01-01T00:00:00.000000Z"
  }
}

// Paginated list (GET /api/products)
{
  "data": [ ... ],
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
  "meta":  { "current_page": 1, "per_page": 15, "total": 50, ... }
}
```

### Categories

| Method | Endpoint          | Auth | Description          |
|--------|-------------------|------|----------------------|
| GET    | `/api/categories` | —    | List all categories. |

### Authentication header

All protected endpoints require:
```
Authorization: Bearer <token>
```

---

## Frontend Features

- **Product listing** — paginated grid (15 per page) with previous/next controls
- **Category filter** — clickable chips that filter products server-side
- **Search** — debounced input (400ms) searches product names and descriptions
- **Product detail** — full product page with category, description and price
- **Create product** — form at `/products/new`, accessible only when authenticated
- **Edit product** — pre-filled form at `/products/:id/edit`, accessible only when authenticated
- **Delete product** — confirmation dialog with error feedback on failure, redirects to home on success
- **Register / Login** — forms connected to the Sanctum API; register requires password confirmation; token stored in `localStorage`
- **Auth state** — persists across page refreshes and navigations; user data survives browser reload
- **Token interceptor** — Axios automatically attaches `Authorization: Bearer <token>` on every request
- **Expired token handling** — 401 responses automatically clear the session and redirect to `/login`
- **Protected routes** — unauthenticated users are redirected to `/login`

---

## Running Tests

The backend has a feature test suite covering all API endpoints. Tests run against an SQLite in-memory database — no running containers required beyond `backend`.

```bash
docker compose exec backend php artisan test
```

```
PASS  Tests\Feature\AuthTest       (8 tests)
PASS  Tests\Feature\CategoryTest   (3 tests)
PASS  Tests\Feature\ProductTest    (17 tests)
```

**What is covered:**
- Auth: register (validation, duplicate email, password mismatch), login (valid/invalid), logout (authenticated/unauthenticated)
- Categories: public listing, alphabetical ordering, no timestamp leakage
- Products: paginated listing, category filter, search, show, 404 handling, create/update/delete (auth vs guest), validation, and response contract (`category_id` not exposed)

---

## Useful Commands

```bash
# View logs
docker compose logs backend
docker compose logs nginx

# Re-seed the database
docker compose exec backend php artisan migrate:fresh --seed

# Stop all containers
docker compose down

# Stop and remove volumes (resets the database)
docker compose down -v
```

---

## Database Schema

```
categories
  id, name, timestamps

products
  id, name, description, price (decimal 10,2),
  category_id (FK → categories), image_url (nullable), timestamps
```

`Product` → `belongsTo` → `Category`
`Category` → `hasMany` → `Product`

All product queries use eager loading (`with('category')`) to prevent N+1 queries.
