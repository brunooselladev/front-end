# Red de Cuidados Frontend (React + API)

Proyecto frontend migrado a React (Vite) con API Express para `/api/instituciones`.

## Estructura

- `src/`: aplicación React
- `public/`: assets públicos
- `api/`: backend Express (MongoDB)
- `vercel.json`: deploy frontend + funciones API en Vercel
- `Dockerfile`: build React y servido con Nginx

## Scripts

- `npm run dev` o `npm run start`: frontend React en local (Vite)
- `npm run build`: build de producción del frontend
- `npm run preview`: preview del build
- `npm run api:dev`: API Express local

## Variables de entorno

Frontend (`.env` opcional):

- `VITE_API_BASE_URL` (default: `http://localhost:3000/api`)
- `VITE_USE_MOCKS` (default: `true`)

Backend (`api/server.js`):

- `MONGO_URI` (requerido para persistencia real)
- `ALLOWED_ORIGINS` o `CORS_ALLOWED_ORIGINS` (lista separada por comas, opcional)

## Notas

- Para usar backend real en React: `VITE_USE_MOCKS=false`.
- La ruta activa de guardado de instituciones es `POST /api/instituciones`.
