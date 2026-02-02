# Sistema de Gestión de Salud Mental - M(app)A

##  Descripción General

**Sistema de Gestión de Salud Mental - Las Aldeas** es una aplicación web desarrollada como proyecto de tesis para la gestión integral de programas de salud mental comunitaria.

### ¿Qué hace el proyecto?

Este sistema permite:
- Gestionar usuarios beneficiarios (USMYAs - Usuarios de Salud Mental y Adicciones)
- Administrar espacios comunitarios y sus recursos
- Coordinar actividades y talleres
- Registrar y controlar asistencias
- Facilitar la comunicación entre equipos interdisciplinarios mediante chat
- Llevar registro de notas de trayectoria y evolución de usuarios
- Gestionar múltiples roles (Admin, Efector, Agente, Referente, USMYA)


### Contexto

Proyecto desarrollado como **trabajo final de práctica profesional** en el marco de la carrera de Desarrollo de Software, con el objetivo de brindar una solución tecnológica a organizaciones comunitarias del ámbito de la salud mental.

---

##  Tecnologías Principales

### Framework y Lenguaje
- **Angular 20.0.0** - Framework frontend basado en componentes standalone
- **TypeScript 5.8.2** - Lenguaje de programación tipado
- **Node.js 20** - Runtime de JavaScript (requerido para desarrollo)
- **RxJS 7.8.0** - Programación reactiva y manejo de Observables

### UI/UX
- **Tailwind CSS 3.4.18** - Framework de utilidades CSS
- **Angular Material 20.2.7** - Biblioteca de componentes UI siguiendo Material Design
- **Angular CDK 20.2.7** - Component Dev Kit para comportamientos avanzados
- **SCSS** - Preprocesador CSS para estilos customizados
- **SweetAlert2 11.24.0** - Alertas y diálogos elegantes

### Gestión de Calendario
- **FullCalendar 6.1.19** - Biblioteca completa para calendarios interactivos
  - `@fullcalendar/angular` - Integración con Angular
  - `@fullcalendar/daygrid` - Vista de cuadrícula mensual
  - `@fullcalendar/timegrid` - Vista de día/semana
  - `@fullcalendar/list` - Vista de lista
  - `@fullcalendar/interaction` - Arrastrar y soltar eventos

### Testing
- **Jasmine 5.7.0** - Framework de testing BDD (Behavior-Driven Development)
- **Karma 6.4.0** - Test runner para ejecutar tests en navegadores
- **Karma Chrome Launcher 3.2.0** - Ejecutor de tests en Chrome/Chromium
- **Karma Coverage 2.2.0** - Generador de reportes de cobertura

### Containerización
- **Docker** - Containerización de la aplicación
- **Docker Compose** - Orquestación de servicios
- **Nginx Alpine** - Servidor web ligero para producción


### Herramientas de Desarrollo
- **Angular CLI 20.3.7** - Interfaz de línea de comandos
- **PostCSS 8.5.6** - Procesamiento de CSS
- **Autoprefixer 10.4.21** - Prefijos CSS automáticos

---

##  Arquitectura del Proyecto

El proyecto implementa una **arquitectura modular basada en servicios** con separación clara de responsabilidades y el patrón **Service-Oriented Architecture (SOA)**.

### Patrón Arquitectónico

El proyecto sigue una arquitectura de 4 capas:

1. **PRESENTATION LAYER** - Componentes UI y Templates (23 componentes standalone, 7 módulos de páginas)
2. **BUSINESS LOGIC LAYER** - Servicios y gestión de estado (14 servicios con RxJS)
3. **MODEL LAYER** - Interfaces y contratos de tipos (16 interfaces TypeScript)
4. **DATA SOURCE LAYER** - Datos mock reemplazables por HTTP (11 archivos de datos mock)

### Estructura Modular Detallada

####  **Components** (`src/app/components/`)
23 componentes reutilizables organizados por funcionalidad:

- **Navegación y UI Base**
  - `back-button/` - Botón de retroceso
  - `breadcrumb/` - Migas de pan para navegación
  - `button/` - Botones customizados
  - `side-menu/` - Menú lateral de navegación
  - `loading-overlay/` - Indicador de carga

- **Tarjetas (Cards)**
  - `card-activities/` - Tarjeta de actividades
  - `card-assistance/` - Tarjeta de asistencias
  - `card-benefit/` - Tarjeta de beneficios
  - `card-chat/` - Tarjeta de chat
  - `card-notifications/` - Tarjeta de notificaciones
  - `card-option/` - Tarjeta de opción de menú
  - `card-participant/` - Tarjeta de participante

- **Formularios**
  - `input/` - Input customizado
  - `input-summary/` - Input con resumen
  - `select/` - Select customizado
  - `stepper/` - Wizard de pasos

- **Funcionalidades Complejas**
  - `chat-component/` - Chat completo con mensajería
  - `fullcalendar-week/` - Integración de FullCalendar
  - `table/` - Tabla de datos con filtros
  - `trayectoria/` - Visualización de trayectoria de usuario
  - `notification-tabs/` - Tabs de notificaciones
  - `modal-confirmation/` - Modal de confirmación
  - `participant-details-modal/` - Detalle de participante

####  **Services** (`src/app/services/`)
14 servicios especializados con responsabilidad única:

| Servicio | Responsabilidad | Archivo de Test |
|----------|-----------------|-----------------|
| `usuario-service` | CRUD de usuarios, gestión de roles y aprobaciones | ✅ usuario-service.spec.ts |
| `auth-service` | Autenticación, login, logout, verificación de sesión | ✅ auth-service.spec.ts |
| `activities-service` | Gestión de actividades y talleres | ✅ activities-service.spec.ts |
| `asistencia-service` | Control de asistencias, estadísticas | ✅ asistencia-service.spec.ts |
| `espacio-service` | Gestión de espacios comunitarios | ✅ espacio-service.spec.ts |
| `chat-service` | Gestión de chats (general/tratante) | ✅ chat-service.spec.ts |
| `mensaje-service` | Gestión de mensajes de chat | ✅ mensaje-service.spec.ts |
| `integrantes-chat-service` | Gestión de integrantes de chats | ✅ integrantes-chat-service.spec.ts |
| `referente-usmya-service` | Relaciones Referente-USMYA | ✅ referente-usmya-service.spec.ts |
| `efector-usmya-service` | Relaciones Efector-USMYA | ✅ efector-usmya-service.spec.ts |
| `jwt-service` | Manejo de tokens JWT en localStorage | ✅ jwt-service.spec.ts |
| `register-service` | Registro de usuarios por rol | ✅ register-service.spec.ts |
| `tags-service` | Gestión de etiquetas | ✅ tags-service.spec.ts |
| `menu-service` | Configuración dinámica de menús por rol | - |
| `notas-trayectoria-service` | Gestión de notas de evolución | - |

####  **Models** (`src/app/models/`)
16 interfaces TypeScript que definen contratos de datos:

- `usuario.interface.ts` - Usuario general del sistema
- `usmya.model.ts` - Usuario beneficiario (USMYA)
- `efector.model.ts` - Profesional de salud
- `agente.model.ts` - Agente comunitario
- `referente.model.ts` - Referente coordinador
- `actividad.model.ts` - Actividad o taller
- `asistencia.model.ts` - Registro de asistencia
- `espacio.model.ts` - Espacio comunitario
- `chat.model.ts` - Chat entre usuarios
- `mensaje.model.ts` - Mensaje de chat
- `integrantes-chat.model.ts` - Participantes de chat
- `nota-trayectoria.model.ts` - Nota de evolución
- `login.model.ts` - Credenciales de login
- `efector-usmya.model.ts` - Relación Efector-USMYA
- `referente-usmya.model.ts` - Relación Referente-USMYA
- `sidebar-item.model.ts` - Item de menú lateral

####  **Pages** (`src/app/pages/`)

7 módulos de páginas organizados por rol de usuario: `admin/` (administración), `agent/` (agente comunitario), `home/` (dashboard), `login/` (autenticación), `referent/` (referente coordinador), `register/` (registro de usuarios) y `usmya/` (usuario beneficiario).

####  **Guards** (`src/app/guards/`)
7 guards de protección de rutas:

- `auth.guard.ts` - Validación de autenticación
- `admin.guard.ts` - Acceso exclusivo para admin
- `efector.guard.ts` - Acceso exclusivo para efector
- `agente.guard.ts` - Acceso exclusivo para agente
- `referente.guard.ts` - Acceso exclusivo para referente
- `usmya.guard.ts` - Acceso exclusivo para USMYA
- `role.guard.ts` - Validación genérica por rol

####  **Layouts** (`src/app/layouts/`)
Plantillas de diseño compartidas:

- `navbar/` - Barra de navegación superior
- `sidebar/` - Menú lateral con navegación por rol

####  **Shared** (`src/app/shared/`)
Recursos compartidos entre módulos:

- `mocks/` - 11 archivos con datos simulados (ver sección siguiente)
- `validators/` - Validadores personalizados de formularios

####  **Utils** (`src/app/utils/`)
- `mat-stepper-intl.es.ts` - Internacionalización de Material Stepper

---

##  Sistema de Mocks

### Implementación Actual

La aplicación actualmente utiliza **datos simulados (mocks)** centralizados en `src/app/shared/mocks/`. Estos archivos contienen datos de prueba que representan usuarios, actividades, asistencias, espacios comunitarios, chats, mensajes y todas las entidades del sistema.

**Archivos de mocks incluidos:** `mock-users.ts`, `mock-actividades.ts`, `mock-asistencias.ts`, `mock-espacios.ts`, `mock-chats.ts`, `mock-mensajes.ts`, `mock-integrantes-chat.ts`, `mock-notas-trayectoria.ts`, `mock-efector-usmya.ts`, `mock-referente-usmya.ts` y `mock-tags.ts`.

### Cómo Funcionan

Los servicios importan estos datos y los retornan usando `of(MOCK_DATA).pipe(delay(ms))`, lo que simula el comportamiento de una llamada HTTP con latencia de red. Los componentes consumen estos servicios mediante Observables, sin conocer el origen de los datos.

### Migración a API Real

Cuando se conecte con el backend, solo será necesario modificar los servicios para reemplazar `of(MOCK_DATA)` por llamadas `http.get()`, `http.post()`, etc. Los componentes no requieren cambios ya que siguen consumiendo el mismo contrato `Observable<T>`.

---

##  Tests Unitarios

### Cobertura de Tests

El proyecto cuenta con **223+ tests unitarios** implementados que cubren exhaustivamente la capa de servicios.

### Estructura de Tests

Cada servicio crítico tiene su archivo `.spec.ts` correspondiente:

| Servicio | Tests Implementados | Cobertura |
|----------|---------------------|-----------|
| `usuario-service.spec.ts` | 21 tests | CRUD, filtros por rol, aprobaciones, relaciones |
| `auth-service.spec.ts` | 11 tests | Login, logout, verificación de sesión, roles |
| `activities-service.spec.ts` | 18 tests | Actividades, filtros, búsqueda, fechas |
| `asistencia-service.spec.ts` | 21 tests | Asistencias, estadísticas, validaciones |
| `espacio-service.spec.ts` | 27 tests | Espacios, localStorage, permisos |
| `chat-service.spec.ts` | 20 tests | Chats, tipos, integrantes |
| `mensaje-service.spec.ts` | 19 tests | Mensajes, ordenamiento, filtros |
| `integrantes-chat-service.spec.ts` | 22 tests | Integrantes, permisos, validaciones |
| `referente-usmya-service.spec.ts` | 17 tests | Relaciones, asignaciones |
| `efector-usmya-service.spec.ts` | 19 tests | Relaciones, permisos |
| `jwt-service.spec.ts` | 20 tests | Tokens, decodificación, validación |
| `register-service.spec.ts` | 8 tests | Registro de usuarios |
| `tags-service.spec.ts` | Tests implementados | Gestión de etiquetas |

### ¿Qué Cubren los Tests?

Cada suite de tests valida:

- ✅ **Creación del servicio** - Inyección de dependencias
- ✅ **Métodos principales** - CRUD completo (Create, Read, Update, Delete)
- ✅ **Filtros y búsquedas** - Por diferentes criterios (rol, id, estado, etc.)
- ✅ **Manejo de datos mock** - Transformaciones y manipulaciones
- ✅ **Edge cases** - Datos inexistentes, validaciones, casos límite
- ✅ **Operaciones asíncronas** - Observables, delays simulados
- ✅ **Lógica de negocio** - Cálculos, estadísticas, relaciones

### Ejemplo de Test Real

Cada archivo `.spec.ts` contiene tests que validan la creación del servicio, métodos CRUD, filtros por diferentes criterios y casos límite usando Jasmine con `describe()` e `it()`.

### Ejecutar Tests

- Todos los tests: `ng test`
- Test específico: `ng test --include='**/usuario-service.spec.ts'`
- Modo headless: `ng test --watch=false --browsers=ChromeHeadless`
- Con coverage: `ng test --code-coverage`

El reporte de cobertura se generará en `coverage/` y puede visualizarse abriendo `coverage/index.html` en un navegador.

---

##  Instalación del Proyecto

### Requisitos Previos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Git** (opcional, para clonar el repositorio)

### Pasos de Instalación

#### 1. Clonar el repositorio (si aplica)

Clonar el repositorio desde GitHub y navegar a la carpeta del proyecto.

#### 2. Instalar dependencias

Ejecutar `npm install` para instalar todas las dependencias listadas en `package.json`, incluyendo Angular, Material, FullCalendar, Tailwind y todas las librerías necesarias.

#### 3. Iniciar servidor de desarrollo

Ejecutar `npm start` o `ng serve` para iniciar el servidor de desarrollo.

#### 4. Acceder a la aplicación

Abre tu navegador en `http://localhost:4200`.

La aplicación se recargará automáticamente cuando modifiques los archivos fuente.

---

##  Ejecución con Docker

### Requisitos Previos

- **Docker Desktop** instalado y en ejecución
- **Docker Compose** (incluido en Docker Desktop)

**Importante:** Todos los comandos Docker deben ejecutarse desde la raíz del proyecto (donde se encuentran los archivos `Dockerfile` y `docker-compose.yml`).

### a) Construcción de Imagen

Ejecutar `docker build -t aldeas-frontend:latest .` para construir la imagen. Este proceso instala dependencias, compila el proyecto en modo producción y crea una imagen optimizada con Nginx Alpine.

### b) Levantar con Docker Compose

Ejecutar `docker-compose up --build` para levantar los contenedores (agregar `-d` para modo background). El archivo `docker-compose.yml` configura el contenedor frontend en el puerto 80 con reinicio automático y una red aislada.

### c) Servicios que se Levantan

| Servicio | Contenedor | Puerto | Descripción |
|----------|-----------|--------|-------------|
| `frontend` | `aldeas-frontend` | `80` | Aplicación Angular servida por Nginx |

### d) Puertos Expuestos

- **Puerto 80** - HTTP (aplicación web principal)

### e) Acceso desde el Navegador

Una vez levantado el contenedor, accede a `http://localhost` o `http://localhost:80`.

---

##  Credenciales de Prueba

Para facilitar el testing y desarrollo, el sistema cuenta con usuarios de prueba para cada rol:

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | admin@test.com | Admin1234 |
| **Efector** | efector@test.com | Efector1234 |
| **Agente** | agente@test.com | Agente1234 |
| **USMYA** | usmya@test.com | Usmya1234 |
| **Referente** | referente@test.com | Referente1234 |

**Nota:** Estas credenciales son únicamente para entornos de desarrollo y testing. No utilizar en producción.

---

##  Estructura de Carpetas

```
front/
│
├── src/                            # Código fuente principal
│   ├── app/                        # Aplicación Angular
│   │   │
│   │   ├── components/             # 23 Componentes reutilizables
│   │   │   ├── back-button/
│   │   │   ├── breadcrumb/
│   │   │   ├── button/
│   │   │   ├── card-activities/
│   │   │   ├── card-assistance/
│   │   │   ├── card-benefit/
│   │   │   ├── card-chat/
│   │   │   ├── card-notifications/
│   │   │   ├── card-option/
│   │   │   ├── card-participant/
│   │   │   ├── chat-component/
│   │   │   ├── fullcalendar-week/
│   │   │   ├── input/
│   │   │   ├── input-summary/
│   │   │   ├── loading-overlay/
│   │   │   ├── modal-confirmation/
│   │   │   ├── notification-tabs/
│   │   │   ├── participant-details-modal/
│   │   │   ├── select/
│   │   │   ├── side-menu/
│   │   │   ├── stepper/
│   │   │   ├── table/
│   │   │   └── trayectoria/
│   │   │
│   │   ├── pages/                  # Vistas principales por rol
│   │   │   ├── admin/              # Panel de administración
│   │   │   ├── agent/              # Panel de agente comunitario
│   │   │   ├── home/               # Dashboard principal
│   │   │   ├── login/              # Autenticación
│   │   │   ├── referent/           # Panel de referente
│   │   │   ├── register/           # Registro de usuarios
│   │   │   └── usmya/              # Panel de beneficiario
│   │   │
│   │   ├── services/               # 14 Servicios con lógica de negocio
│   │   │   ├── usuario-service.ts          (✅ .spec.ts)
│   │   │   ├── auth-service.ts             (✅ .spec.ts)
│   │   │   ├── activities-service.ts       (✅ .spec.ts)
│   │   │   ├── asistencia-service.ts       (✅ .spec.ts)
│   │   │   ├── espacio-service.ts          (✅ .spec.ts)
│   │   │   ├── chat-service.ts             (✅ .spec.ts)
│   │   │   ├── mensaje-service.ts          (✅ .spec.ts)
│   │   │   ├── integrantes-chat-service.ts (✅ .spec.ts)
│   │   │   ├── referente-usmya-service.ts  (✅ .spec.ts)
│   │   │   ├── efector-usmya-service.ts    (✅ .spec.ts)
│   │   │   ├── jwt-service.ts              (✅ .spec.ts)
│   │   │   ├── register-service.ts         (✅ .spec.ts)
│   │   │   ├── tags-service.ts             (✅ .spec.ts)
│   │   │   ├── menu-service.ts
│   │   │   └── notas-trayectoria-service.ts
│   │   │
│   │   ├── models/                 # 16 Interfaces TypeScript
│   │   │   ├── usuario.interface.ts
│   │   │   ├── usmya.model.ts
│   │   │   ├── efector.model.ts
│   │   │   ├── agente.model.ts
│   │   │   ├── referente.model.ts
│   │   │   ├── actividad.model.ts
│   │   │   ├── asistencia.model.ts
│   │   │   ├── espacio.model.ts
│   │   │   ├── chat.model.ts
│   │   │   ├── mensaje.model.ts
│   │   │   ├── integrantes-chat.model.ts
│   │   │   ├── nota-trayectoria.model.ts
│   │   │   ├── login.model.ts
│   │   │   ├── efector-usmya.model.ts
│   │   │   ├── referente-usmya.model.ts
│   │   │   └── sidebar-item.model.ts
│   │   │
│   │   ├── shared/                 # Recursos compartidos
│   │   │   ├── mocks/              # 11 archivos de datos mock
│   │   │   │   ├── mock-users.ts
│   │   │   │   ├── mock-actividades.ts
│   │   │   │   ├── mock-asistencias.ts
│   │   │   │   ├── mock-espacios.ts
│   │   │   │   ├── mock-chats.ts
│   │   │   │   ├── mock-mensajes.ts
│   │   │   │   ├── mock-integrantes-chat.ts
│   │   │   │   ├── mock-notas-trayectoria.ts
│   │   │   │   ├── mock-efector-usmya.ts
│   │   │   │   ├── mock-referente-usmya.ts
│   │   │   │   └── mock-tags.ts
│   │   │   └── validators/         # Validadores personalizados
│   │   │
│   │   ├── guards/                 # 7 Guards de protección de rutas
│   │   │   ├── auth.guard.ts
│   │   │   ├── admin.guard.ts
│   │   │   ├── efector.guard.ts
│   │   │   ├── agente.guard.ts
│   │   │   ├── referente.guard.ts
│   │   │   ├── usmya.guard.ts
│   │   │   └── role.guard.ts
│   │   │
│   │   ├── layouts/                # Plantillas de diseño
│   │   │   ├── navbar/
│   │   │   └── sidebar/
│   │   │
│   │   ├── utils/                  # Utilidades
│   │   │   └── mat-stepper-intl.es.ts
│   │   │
│   │   ├── core/                   # Módulo core (interceptores, etc.)
│   │   │
│   │   ├── app.config.ts           # Configuración de la aplicación
│   │   ├── app.routes.ts           # Definición de rutas
│   │   ├── app.ts                  # Componente raíz (standalone)
│   │   ├── app.html                # Template del componente raíz
│   │   └── app.scss                # Estilos del componente raíz
│   │
│   ├── assets/                     # Recursos estáticos
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── environments/               # Configuración por entorno
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   │
│   ├── styles/                     # Estilos globales SCSS
│   │   ├── generalStyles.scss
│   │   ├── typography.scss
│   │   ├── variables.scss
│   │   ├── layout.scss
│   │   └── auth-mixins.scss
│   │
│   ├── index.html                  # HTML principal
│   ├── main.ts                     # Punto de entrada de la aplicación
│   ├── styles.css                  # Estilos CSS globales
│   └── styles.scss                 # Estilos SCSS globales
│
├── public/                         # Archivos públicos estáticos
│
├── Dockerfile                      # Configuración de Docker
├── docker-compose.yml              # Orquestación de contenedores
├── nginx.conf                      # Configuración de Nginx
├── .dockerignore                   # Exclusiones de Docker
│
├── angular.json                    # Configuración de Angular CLI
├── package.json                    # Dependencias y scripts npm
├── package-lock.json               # Lock de versiones exactas
├── tsconfig.json                   # Configuración de TypeScript
├── tsconfig.app.json               # Config TS para la aplicación
├── tsconfig.spec.json              # Config TS para tests
├── tailwind.config.js              # Configuración de Tailwind CSS
├── postcss.config.js               # Configuración de PostCSS
│
└── README.md                       # Este archivo
```

### Explicación de Directorios Principales

- **`src/app/components/`** - Componentes UI reutilizables independientes del dominio
- **`src/app/pages/`** - Vistas completas organizadas por rol de usuario
- **`src/app/services/`** - Lógica de negocio y comunicación con datos
- **`src/app/models/`** - Definiciones de tipos e interfaces
- **`src/app/shared/mocks/`** - Datos simulados para desarrollo y testing
- **`src/app/guards/`** - Protección de rutas según autenticación y roles
- **`src/app/layouts/`** - Plantillas de diseño compartidas
- **`src/environments/`** - Configuración específica por entorno
- **`src/styles/`** - Estilos SCSS globales y variables

---

##  Comandos Útiles

### Desarrollo

- Iniciar servidor: `npm start` o `ng serve` (puerto 4200)
- Puerto específico: `ng serve --port 4300`
- Accesible en red: `ng serve --host 0.0.0.0`
- Abrir navegador: `ng serve --open`

### Build

- Desarrollo: `npm run build` o `ng build`
- Producción: `npm run build -- --configuration production`
- Watch mode: `npm run watch` o `ng build --watch`

### Testing

- Ejecutar tests: `npm test` o `ng test`
- Test específico: `ng test --include='**/usuario-service.spec.ts'`
- Modo headless: `ng test --watch=false --browsers=ChromeHeadless`
- Con coverage: `ng test --code-coverage`
- Ver reporte: `start coverage/index.html` (Windows) o `open coverage/index.html` (macOS/Linux)

### Docker

- Construir: `docker build -t aldeas-frontend:latest .`
- Levantar: `docker-compose up --build` (agregar `-d` para background)
- Ver logs: `docker-compose logs -f`
- Detener: `docker-compose down` (agregar `-v` para eliminar volúmenes)
- Reiniciar: `docker-compose restart`
- Ver contenedores: `docker ps`
- Ver imágenes: `docker images`
- Entrar: `docker exec -it aldeas-frontend sh`
- Ver recursos: `docker stats aldeas-frontend`
- Limpiar: `docker container prune` o `docker system prune -a`

### Angular CLI (Generadores)

- Componente: `ng g c components/my-component`
- Servicio: `ng g s services/my-service`
- Guard: `ng g g guards/auth`
- Interface: `ng g i models/my-model`
- Pipe: `ng g p pipes/my-pipe`
- Ayuda: `ng help` o `ng generate --help`

---

##  Buenas Prácticas Implementadas

### 1. **Arquitectura Modular y Escalable**

- ✅ Separación clara de responsabilidades (Components → Services → Models → Data)
- ✅ Componentes pequeños, reutilizables y con responsabilidad única
- ✅ Servicios especializados siguiendo Single Responsibility Principle
- ✅ Organización por features (páginas por rol) y capas (components, services, models)

### 2. **Componentes Standalone Modernos**

- ✅ Uso de standalone components (Angular 14+)
- ✅ Sin `NgModule`, importaciones explícitas
- ✅ Mejora en tree-shaking y reducción de bundle size
- ✅ Arquitectura moderna recomendada por Angular

### 3. **Servicios Desacoplados**

- ✅ Uso de Observables (`Observable<T>`) para operaciones asíncronas
- ✅ Inyección de dependencias con función `inject()`
- ✅ Servicios independientes del origen de datos (mock o API)
- ✅ Simulación de latencia con `delay()` para testing realista

### 4. **Testing Exhaustivo**

- ✅ **223+ tests unitarios** cubriendo servicios críticos
- ✅ Tests organizados por funcionalidad (describe/it blocks)
- ✅ Uso de `HttpClientTestingModule` para servicios HTTP
- ✅ Mocks locales para testing independiente sin backend
- ✅ Cobertura de edge cases y validaciones

### 5. **Tipado Fuerte con TypeScript**

- ✅ Interfaces y modelos para todos los datos (16 modelos)
- ✅ Type safety en componentes, servicios y funciones
- ✅ Uso de utilidades TypeScript: `Omit<T>`, `Partial<T>`, `Pick<T>`
- ✅ Evita uso de `any` en favor de tipos específicos

### 6. **Diseño Responsivo con Tailwind CSS**

- ✅ Utility-first CSS approach
- ✅ Mobile-first design responsivo
- ✅ Consistencia visual mediante theme customizado
- ✅ Configuración centralizada en `tailwind.config.js`
- ✅ Colores corporativos definidos (primary, secondary, danger)

### 7. **Gestión de Estado Reactiva**

- ✅ Uso de `BehaviorSubject` para estado compartido
- ✅ Observables para flujos de datos asíncronos
- ✅ Patrón de comunicación reactiva entre componentes
- ✅ RxJS operators para transformaciones de datos

### 8. **Seguridad y Protección**

- ✅ Guards para protección de rutas (7 guards implementados)
- ✅ Validación de roles y permisos por página
- ✅ JWT para autenticación (preparado con `jwt-service`)
- ✅ Headers de seguridad en Nginx (XSS-Protection, X-Frame-Options)

### 9. **Performance y Optimización**

- ✅ Lazy loading preparado para módulos pesados
- ✅ Build de producción optimizado con Angular CLI
- ✅ Imagen Docker ultra liviana (~25MB con Nginx Alpine)
- ✅ Cache de assets estáticos en Nginx (1 año)
- ✅ Compresión Gzip habilitada en Nginx

### 10. **Código Limpio y Mantenible**

- ✅ Nombres de variables y funciones descriptivos
- ✅ Comentarios en lógica compleja
- ✅ Estructura de carpetas intuitiva y organizada
- ✅ Separación de concerns (presentación, lógica, datos)
- ✅ DRY (Don't Repeat Yourself) - componentes reutilizables

### 11. **DevOps y CI/CD Ready**

- ✅ Dockerización completa con multi-stage build
- ✅ Tests ejecutables en modo headless para CI/CD
- ✅ Build reproducible con `npm ci` (lockfile)
- ✅ Variables de entorno configurables
- ✅ Scripts npm bien definidos

### 12. **Accesibilidad (A11y)**

- ✅ Uso de Angular Material (accesible por defecto)
- ✅ Estructura semántica HTML5
- ✅ Labels descriptivos en formularios
- ✅ Navegación por teclado en componentes interactivos

---

---

<div align="center">

**Desarrollado como proyecto de tesis - Práctica Profesional 2025 - Grupo Aldeas**
**Front End - Bernardo Moyano**

</div>
