Plan de Implementación: Prototipo PWA Educativo
Contexto
Hoy (23 de marzo de 2026) es la fecha de entrega del prototipo funcional PWA para apoyo educativo en comunidades rurales. El proyecto ya cuenta con una base sólida:

Frontend: Angular 20 con autenticación, i18n (es-ES), Bootstrap, routing modular
Backend: NestJS 11 con PostgreSQL, sistema JWT completo, arquitectura limpia
PWA básica: Service Worker y manifest configurados, pero sin caché de API ni persistencia offline de datos
Objetivo: Implementar las 4 funcionalidades clave del MVP aprovechando la infraestructura existente.

Arquitectura Propuesta
Backend (NestJS)
Crear 3 nuevos módulos siguiendo el patrón arquitectónico existente:

1. Módulo Tasks (Gestión de tareas)
Entidad: Task con campos: title, description, dueDate, completed, priority, userId
Relación: ManyToOne con User
Endpoints: CRUD básico + toggle completion + list by user
Archivos críticos:
back/src/tasks/ (nuevo módulo completo)
back/src/database/migrations/XXXXXX-CreateTask.ts (migración)
2. Módulo Lessons (Contenido interactivo)
Entidad: Lesson con campos: title, description, content (JSON), category, difficulty
Entidad: LessonProgress con campos: lessonId, userId, completed, score, answers (JSON)
Relación: LessonProgress ManyToOne con User y Lesson
Endpoints:
Listar lecciones disponibles
Obtener detalle de lección con preguntas
Guardar progreso y respuestas
Obtener progreso del estudiante
Archivos críticos:
back/src/lessons/ (nuevo módulo)
back/src/database/migrations/XXXXXX-CreateLesson.ts
3. Módulo Feedback (Retroalimentación)
Entidad: Feedback con campos: userId, feedbackType (enum: task, lesson, general), rating, comments, metadata (JSON)
Relación: ManyToOne con User
Endpoints:
Crear feedback
Listar feedback del usuario
Estadísticas básicas (solo admin)
Archivos críticos:
back/src/feedback/ (nuevo módulo)
back/src/database/migrations/XXXXXX-CreateFeedback.ts
Frontend (Angular)
Crear 3 nuevos módulos de páginas con lazy loading:

1. Módulo Tasks (front/src/app/pages/tasks/)
Componentes:

TaskListComponent - Lista de tareas con filtros (todas/completadas/pendientes)
TaskFormComponent - Formulario para crear/editar tarea
TaskCardComponent - Card individual de tarea
Servicios:

TasksService - API calls al backend
TasksOfflineService - Persistencia en IndexedDB
Entity:

TaskEntity extendiendo BaseEntity
Routing:

/tasks → lista
/tasks/new → crear
/tasks/:id/edit → editar
2. Módulo Lessons (front/src/app/pages/lessons/)
Componentes:

LessonsListComponent - Catálogo de lecciones con categorías
LessonDetailComponent - Vista de lección con preguntas interactivas
LessonResultComponent - Resultado de ejercicio con retroalimentación visual
Servicios:

LessonsService - API calls
LessonsOfflineService - Caché de lecciones en IndexedDB
LessonProgressService - Tracking de progreso
Entities:

LessonEntity
LessonProgressEntity
Routing:

/lessons → catálogo
/lessons/:id → detalle interactivo
/lessons/:id/result → resultado
3. Módulo Feedback (front/src/app/pages/feedback/)
Componentes:

FeedbackModalComponent - Modal rápido post-actividad (rating + comentario)
FeedbackHistoryComponent - Historial de feedback enviado
Servicios:

FeedbackService - API calls y queue offline
4. Dashboard mejorado (front/src/app/pages/dashboard/)
Mejoras al componente existente:

Resumen de tareas pendientes
Próxima lección sugerida
Estadísticas básicas (tareas completadas, lecciones vistas)
Persistencia Offline
IndexedDB (front/src/app/@core/services/storage/)
Nuevo servicio: IndexedDbService

Store: tasks (CRUD offline)
Store: lessons (caché de contenido)
Store: feedback_queue (cola de feedback pendiente)
Store: sync_queue (acciones pendientes de sincronizar)
Configuración PWA mejorada
Modificar: front/ngsw-config.json

Agregar dataGroups para API:
/api/v1/tasks (freshness: 30min, maxAge: 7d)
/api/v1/lessons (freshness: 1d, maxAge: 30d)
/api/v1/feedback (freshness: 30min)
Sincronización
Nuevo servicio: front/src/app/@core/services/sync/sync.service.ts

Detectar conexión online/offline
Sincronizar queues cuando vuelva conexión
Resolver conflictos (last-write-wins por ahora)
Plan de Ejecución OPTIMIZADO (2-4 horas)
Paso 1: Backend - Lessons Module (30 min)
Crear módulo lessons con estructura básica
Crear entities: Lesson y LessonProgress (usar synchronize: true temporalmente)
Crear DTOs y service con métodos mínimos
Crear controller con 4 endpoints
Seed con 5 lecciones educativas (contenido contextualizado)
Archivos: back/src/lessons/, back/src/database/seeds/lesson.seed.ts
Paso 2: Backend - Feedback Module (15 min)
Crear módulo feedback con estructura básica
Crear entity Feedback
Crear DTOs y service básico
Crear controller con 2 endpoints
Archivos: back/src/feedback/
Paso 3: Frontend - Offline Infrastructure (45 min)
Crear IndexedDbService con 5 stores
Crear NetworkService (observable online/offline)
Crear SyncService básico
Crear OfflineInterceptor para queue de requests fallidos
Archivos:
front/src/app/@core/services/storage/indexeddb.service.ts
front/src/app/@core/services/network/network.service.ts
front/src/app/@core/services/sync/sync.service.ts
front/src/app/@core/interceptors/offline.interceptor.ts
Paso 4: Frontend - Tasks Module (30 min)
Crear módulo standalone simple (solo frontend)
Lista + formulario modal + toggle completion
Persistir 100% en IndexedDB
Routing y agregar a nav-menu
Archivos: front/src/app/pages/tasks/ (componentes simples)
Paso 5: Frontend - Lessons Module (45 min)
Crear módulo con lista, detalle y resultado
LessonsService que usa IndexedDB como primera fuente
Componente interactivo con preguntas y feedback visual
Contador de puntos y progress bar
Integrar modal de feedback post-lección
Archivos: front/src/app/pages/lessons/
Paso 6: Frontend - Feedback Module (15 min)
FeedbackModalComponent reutilizable
FeedbackService con queue en IndexedDB
Trigger automático post-activity
Archivos: front/src/app/pages/feedback/
Paso 7: Frontend - Dashboard Simple (15 min)
Modificar dashboard.component.ts existente
Mostrar contadores de IndexedDB (tareas pendientes, lecciones completadas)
Card de próxima lección sugerida
Archivo: front/src/app/pages/dashboard/dashboard.component.ts
Paso 8: PWA Config + i18n (15 min)
Agregar dataGroups en ngsw-config.json
Agregar traducciones es-ES.json
Archivos: front/ngsw-config.json, front/src/translations/es-ES.json
Paso 9: Testing Offline (15 min)
cd front && npm run build && npm run build:serve
Probar en Chrome con DevTools Network Offline
Validar: crear tarea offline, completar lección offline, enviar feedback offline
Reconectar y verificar sincronización
Total estimado: ~3.5 horas

Archivos Críticos a Crear/Modificar
Backend - NUEVOS (Módulos completos)
back/src/lessons/
├── domain/lesson.ts
├── domain/lesson-progress.ts
├── dto/create-lesson.dto.ts
├── dto/query-lesson.dto.ts
├── dto/save-progress.dto.ts
├── infrastructure/persistence/relational/
│   ├── entities/lesson.entity.ts
│   ├── entities/lesson-progress.entity.ts
│   └── relational-persistence.module.ts
├── lessons.controller.ts
├── lessons.service.ts
└── lessons.module.ts

back/src/feedback/
├── domain/feedback.ts
├── dto/create-feedback.dto.ts
├── dto/query-feedback.dto.ts
├── infrastructure/persistence/relational/
│   ├── entities/feedback.entity.ts
│   └── relational-persistence.module.ts
├── feedback.controller.ts
├── feedback.service.ts
└── feedback.module.ts

back/src/database/seeds/relational/lesson/lesson-seed.service.ts
Backend - MODIFICAR
back/src/app.module.ts (línea ~95: importar LessonsModule y FeedbackModule)
back/.env (asegurar DATABASE_SYNCHRONIZE=true en dev)
Frontend - NUEVOS (Módulos y servicios core)
front/src/app/@core/services/storage/indexeddb.service.ts
front/src/app/@core/services/network/network.service.ts
front/src/app/@core/services/sync/sync.service.ts
front/src/app/@core/interceptors/offline.interceptor.ts
front/src/app/@core/entities/task.entity.ts
front/src/app/@core/entities/lesson.entity.ts
front/src/app/@core/entities/lesson-progress.entity.ts
front/src/app/@core/entities/feedback.entity.ts

front/src/app/pages/tasks/
├── task-list/task-list.component.ts
├── task-modal/task-modal.component.ts
├── services/tasks.service.ts
├── tasks-routing.module.ts
└── tasks.module.ts

front/src/app/pages/lessons/
├── lesson-list/lesson-list.component.ts
├── lesson-detail/lesson-detail.component.ts
├── lesson-result/lesson-result.component.ts
├── services/lessons.service.ts
├── services/lesson-progress.service.ts
├── lessons-routing.module.ts
└── lessons.module.ts

front/src/app/pages/feedback/
├── feedback-modal/feedback-modal.component.ts
├── services/feedback.service.ts
└── feedback.module.ts
Frontend - MODIFICAR
front/src/app/pages/pages-routing.module.ts (líneas 12-15: agregar rutas tasks y lessons)
front/src/app/@core/constants/nav-menu-items.ts (línea 15: agregar "Mis Tareas" y "Lecciones")
front/src/app/pages/dashboard/dashboard.component.ts (mejorar con datos de IndexedDB)
front/ngsw-config.json (agregar dataGroups para /api/v1/lessons)
front/src/translations/es-ES.json (agregar keys: Tasks, Lessons, Feedback, etc.)
front/src/app/app.config.ts (registrar OfflineInterceptor)
Consideraciones de Diseño
UX para móvil
Botones grandes (min 44x44px)
Formularios simples con pocos campos
Cards con información resumida
Navegación bottom tab bar o hamburger menu
Loading states claros
Feedback visual inmediato
Gamificación ligera
Sistema de puntos por actividad completada
Progress bars visuales
Mensajes motivacionales con hot-toast
Badges simples (próxima versión)
Contenido educativo
Lecciones de matemáticas aplicadas (calcular áreas de cultivo, regla de 3)
Ciencias naturales (ciclos de siembra, clima)
Lenguaje (lectura comprensiva contextualizada)
Preguntas multiple choice simples
Máximo 5-7 preguntas por lección
Retroalimentación
Modal no invasivo post-actividad
Rating simple (1-5 estrellas o 😊😐🙁)
Campo opcional de texto
Opción de "saltar" sin bloquear navegación
Verificación End-to-End
Modo Online
✅ Login con usuario existente
✅ Crear nueva tarea → aparece en lista
✅ Completar lección → ver resultado y puntos
✅ Enviar feedback → confirmar con toast
✅ Ver dashboard con estadísticas actualizadas
Modo Offline
✅ Desconectar red (Chrome DevTools)
✅ Crear tarea → guardar en IndexedDB
✅ Marcar tarea existente como completada
✅ Ver lección cacheada → completar offline
✅ Enviar feedback → queue en IndexedDB
✅ Reconectar → verificar sincronización automática
✅ Verificar que datos aparezcan en backend
Responsive
✅ Probar en Chrome DevTools (iPhone/Android)
✅ Verificar que todos los botones sean táctiles
✅ Verificar que textos sean legibles
✅ Verificar navegación fluida
PWA
✅ Build producción: cd front && npm run build
✅ Servir con https: npx http-server dist/angular-boilerplate/browser -p 8080 -S
✅ Verificar que aparezca opción "Instalar aplicación"
✅ Instalar y probar como app standalone
Implementación Técnica Detallada
IndexedDB Schema
// DB: educative-app, version: 1
Stores:
1. tasks: { id, title, description, dueDate, completed, priority, createdAt, updatedAt, synced }
2. lessons: { id, title, description, content, category, difficulty, createdAt }
3. lesson_progress: { id, lessonId, score, answers, completedAt, synced }
4. feedback: { id, type, rating, comments, metadata, createdAt, synced }
5. sync_queue: { id, action, store, data, timestamp, retries }
Contenido Educativo (3-5 Lecciones Demo)
Lección 1: Matemáticas - Áreas de Cultivo

Tema: Calcular áreas de terrenos rectangulares y cuadrados
Contexto: "Don Juan tiene un terreno de 15m x 20m, ¿cuántos metros cuadrados tiene?"
5 preguntas progresivas
Dificultad: Básica
Lección 2: Matemáticas - Regla de Tres Simple

Tema: Proporciones aplicadas a cosechas
Contexto: "Si 3 sacos de semilla cubren 12 hectáreas, ¿cuántos sacos necesito para 20 hectáreas?"
5 preguntas con casos reales
Dificultad: Media
Lección 3: Ciencias Naturales - Ciclo del Agua

Tema: Ciclo del agua y su importancia para cultivos
Contexto: Explicación visual con preguntas sobre evaporación, precipitación, etc.
5 preguntas con imágenes (usar emojis como fallback)
Dificultad: Básica
Lección 4: Ciencias Naturales - Ciclos de Siembra

Tema: Estaciones y mejores épocas para sembrar diferentes cultivos
Contexto: "¿En qué época del año es mejor sembrar maíz en clima templado?"
5 preguntas contextualizadas
Dificultad: Media
Lección 5: Comprensión Lectora - Cuento Rural

Tema: Lectura breve sobre la vida en el campo + preguntas de comprensión
Contexto: Cuento corto (100-150 palabras) sobre tradiciones rurales
5 preguntas sobre el texto
Dificultad: Básica
Backend Simplificado
Lessons Controller (endpoints mínimos):

GET /api/v1/lessons → Lista todas las lecciones
GET /api/v1/lessons/:id → Detalle de lección
POST /api/v1/lessons/progress → Guardar progreso (lessonId, score, answers)
GET /api/v1/lessons/progress → Obtener progreso del usuario actual
Feedback Controller:

POST /api/v1/feedback → Crear feedback (tipo, rating, comentario)
GET /api/v1/feedback/me → Mi historial de feedback
NO implementar inicialmente:

Tasks backend (solo frontend)
Paginación compleja
Filtros avanzados
Sistema de roles completo
Frontend - Servicios Core Offline
NetworkService (@core/services/network/network.service.ts):

Observable de estado online/offline
Detectar cambios de conexión
Emit events cuando vuelve conexión
IndexedDbService (@core/services/storage/indexeddb.service.ts):

Wrapper simple sobre IndexedDB API nativa
Métodos: add, get, getAll, update, delete, clear
Por store: tasks, lessons, lesson_progress, feedback, sync_queue
SyncService (@core/services/sync/sync.service.ts):

Escuchar NetworkService
Cuando vuelve online → procesar sync_queue
Llamar APIs pendientes
Marcar items como synced
Notificar con hot-toast
Patrones a Reutilizar
Backend
BaseEntity pattern: Todos los nuevos módulos siguen dominio → DTO → infrastructure
Repository abstraction: Crear abstract repository que puede tener implementación relacional o documental
Guards: Reutilizar AuthGuard JWT y RolesGuard donde sea necesario
i18n: Usar decorador de idioma en headers
Frontend
BaseEntity: Extender para TaskEntity, LessonEntity, FeedbackEntity
UseCase pattern: Crear UseCases para operaciones complejas
Standalone components: Priorizar componentes standalone cuando sea posible
@UntilDestroy: Usar en todos los componentes con suscripciones
Utils existentes:
local-storage-data.utility.ts para persistencia simple
mark-invalid-form-controls.utility.ts para formularios
Pipes: timeAgo, truncateText, friendlyDate
hot-toast: Para notificaciones de éxito/error
i18n: Usar TranslateService y pipe translate
Estrategia de Implementación PRAGMÁTICA (2-4 horas)
Decisiones basadas en respuestas del usuario:

⏱️ Tiempo limitado (2-4 horas)
🎯 Prioridad: Offline robusto (crítico para comunidades rurales)
📚 Generar 3-5 lecciones demo con contenido relevante
Enfoque ajustado para máxima eficiencia:

FASE 1: Backend Simplificado (45 min)
Solo módulo Lessons (las tareas pueden ser simples frontend-only)
Solo módulo Feedback (requerido para validación)
Endpoints mínimos: GET lessons, POST lesson-progress, POST feedback
Sin migraciones inicialmente (usar seeds directamente con synchronize: true en dev)
3-5 lecciones hardcodeadas en seed
FASE 2: Offline First Frontend (90 min)
IndexedDB como prioridad (tasks, lessons, feedback_queue)
Tasks solo frontend (persistir en IndexedDB, sin backend por ahora)
Lessons con caché offline completo
FeedbackQueue offline con sincronización cuando vuelva conexión
NetworkService para detectar online/offline
FASE 3: UI Mínima Funcional (45 min)
Tasks: lista simple + modal create + checkbox completar
Lessons: lista + detalle interactivo + resultado
Feedback: modal post-actividad rating + comentario
Dashboard: solo contadores básicos
FASE 4: PWA Config + Testing (30 min)
Configurar dataGroups para /api/v1/lessons
Build producción y probar offline
Verificar sincronización
Funcionalidades Incluidas:
✅ Gestión de tareas (frontend-only con IndexedDB)
✅ 3-5 lecciones educativas con contenido rural
✅ Contenido interactivo con retroalimentación inmediata
✅ Sistema de feedback con queue offline
✅ Funcionalidad offline robusta (IndexedDB + sync)
✅ PWA instalable
Funcionalidades Simplificadas:
⚠️ Tasks sin backend (solo frontend + IndexedDB)
⚠️ Gamificación muy ligera (solo contador local)
⚠️ Sin sistema de usuarios múltiples (usa el user actual del JWT)
⚠️ Sincronización simple (sin resolución de conflictos complejos)
Notas de Implementación
El backend ya tiene sistema de usuarios, usar el userId actual del JWT
Reutilizar RoleEnum para agregar role "student" si es necesario
Las Seeds deben incluir contenido educativo relevante a comunidades rurales
El i18n ya está configurado, solo agregar keys en es-ES.json
Bootstrap ya disponible, usar sus clases para responsive
hot-toast ya configurado, solo importar y usar HotToastService
