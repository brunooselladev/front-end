# Mocks Frontend

Archivo principal de mocks: `src/mocks/index.js`

## Modo de uso

1. Activar mocks en `.env`:
- `VITE_USE_MOCKS=true`

2. Configurar backend real:
- `VITE_USE_MOCKS=false`
- `VITE_API_BASE_URL=http://tu-backend/api`

## Usuarios de prueba (mock)

- `admin@test.com` / `Admin1234`
- `agente@test.com` / `Agente1234`
- `efector@test.com` / `Efector1234`
- `referente@test.com` / `Referente1234`
- `usmya@test.com` / `Usmya1234`

## Estructura mock incluida

- usuarios/autenticacion
- espacios
- actividades
- asistencias
- chats/mensajes/integrantes
- relaciones referente-usmya / efector-usmya
- notas de trayectoria
- tags
