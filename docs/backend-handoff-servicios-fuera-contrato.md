# Handoff backend: servicios fuera de contrato Swagger

## Contexto
- Swagger vigente solo cubre: User, Workspace y Activity.
- Los siguientes dominios se usan en frontend pero no existen en ese contrato.
- En modo real (USE_MOCKS=false), hoy estos servicios arrojan error controlado para evitar llamadas inválidas.

---

## 1) Asistencia

### Páginas que dependen
- src/pages/AssistancePages.jsx
  - Lista por actividad: líneas aprox. 40, 177
  - Cambio de estado: línea aprox. 196
- src/pages/TrajectoryPages.jsx
  - Timeline por USMYA: línea aprox. 35

### Operaciones que necesita frontend
- getAsistenciasByActividadId(actividadId)
- updateAsistencia(id, { estado })
- getAsistenciasByUsmyaId(usmyaId)

### Modelo mínimo esperado por frontend
- Asistencia:
  - id
  - idActividad
  - idUser
  - estado (presente/ausente/pendiente)
  - observacion (opcional)

### Propuesta de endpoints backend
- GET /api/assistance?activityId={id}
- GET /api/assistance?userId={idUsmya}
- PATCH /api/assistance/{id}
  - body: { estado, observacion? }

---

## 2) Chat + integrantes + mensajes

### Páginas que dependen
- src/pages/ChatPages.jsx
  - Carga de chats del usuario: líneas aprox. 98, 290
  - Obtención de chat por id: líneas aprox. 100, 261
  - Alta de chat: línea aprox. 152
  - Miembros del chat: líneas aprox. 158, 160, 262
  - Mensajería: líneas aprox. 107, 263, 315

### Operaciones que necesita frontend
#### Chat
- getChatById(chatId)
- getChatsByUsmyaId(usmyaId)
- createChat({ idUsmya, tipo })

#### Integrantes
- getChatsByUserId(userId)
- getIntegrantesByChatId(chatId)
- isUserInChat(chatId, userId) (puede resolverse desde getIntegrantesByChatId)
- createIntegrante({ idChat, idUser })

#### Mensajes
- getMensajesByChatIdOrdered(chatId)
- getUltimoMensaje(chatId)
- enviarMensaje({ descripcion, idEmisor, idChat, fecha, hora })

### Modelos mínimos esperados
- Chat: { id, idUsmya, tipo }
- IntegranteChat: { id, idChat, idUser }
- Mensaje: { id, idChat, idEmisor, descripcion, fecha, hora }

### Propuesta de endpoints backend
- GET /api/chats/{id}
- GET /api/chats?usmyaId={id}
- POST /api/chats

- GET /api/chat-members?userId={id}
- GET /api/chat-members?chatId={id}
- POST /api/chat-members

- GET /api/messages?chatId={id}&order=asc&sort=fechaHora
- GET /api/messages?chatId={id}&limit=1&order=desc
- POST /api/messages

---

## 3) Relaciones Referente-USMYA y Efector-USMYA

### Páginas que dependen
- src/pages/ProfileAndPatientsPages.jsx
  - Efector -> pacientes vinculados: línea aprox. 609
  - Alta vínculo efector-usmya: líneas aprox. 70, 648
  - Referente -> acompañados vinculados: línea aprox. 751
  - Alta vínculo referente-usmya: línea aprox. 791

### Operaciones que necesita frontend
#### Efector-USMYA
- getUsmyaUsersByEfectorId(efectorId)
- create({ idEfector, idUsmya })

#### Referente-USMYA
- getByIdReferente(referenteId)
- create({ idReferente, idUsmya })

### Modelos mínimos esperados
- Vínculo efector-usmya: { id, idEfector, idUsmya }
- Vínculo referente-usmya: { id, idReferente, idUsmya }

### Propuesta de endpoints backend
- GET /api/efector-usmya?efectorId={id}
- POST /api/efector-usmya

- GET /api/referente-usmya?referenteId={id}
- POST /api/referente-usmya

Nota: para listar pacientes/acompañados completos, frontend hoy resuelve usuario por usuario vía User API.

---

## 4) Notas de trayectoria

### Páginas que dependen
- src/pages/TrajectoryPages.jsx
  - Carga notas por USMYA: línea aprox. 36
  - Alta nota: línea aprox. 96

### Operaciones que necesita frontend
- getNotasByIdUsmya(usmyaId)
- create({ idActor, idUsmya, titulo, observacion, fecha, hora })

### Modelo mínimo esperado
- NotaTrayectoria:
  - id
  - idActor
  - idUsmya
  - titulo
  - observacion
  - fecha
  - hora

### Propuesta de endpoints backend
- GET /api/trajectory-notes?usmyaId={id}
- POST /api/trajectory-notes

---

## 5) Tags de resumen

### Páginas que dependen
- src/pages/SharedUserForms.jsx
  - Carga de tags para selector de resumen: línea aprox. 147

### Operaciones que necesita frontend
- getAllTags()

### Modelo mínimo esperado
- Tag: { id, nombre, descripcion? }

### Propuesta de endpoint backend
- GET /api/tags

---

## Priorización sugerida para backend
1. Asistencia (bloquea pantallas de asistencia y parte de trayectoria)
2. Relaciones efector/referente-usmya (bloquea gestión de pacientes/acompañados)
3. Trajectory notes (bloquea alta y lectura de notas)
4. Chat/mensajes (bloquea módulo de comunicación)
5. Tags (bloquea selector de resumen, menor criticidad)

---

## Estado actual frontend
- Servicios fuera de contrato están protegidos con error explícito en runtime para evitar integraciones silenciosas incorrectas.
- Los servicios alineados con Swagger (User, Workspace, Activity) sí continúan activos.
