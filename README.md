# API de Gestión de Planes de Investigación

Esta API REST permite gestionar planes de investigación académica, incluyendo usuarios, secciones, objetivos, hipótesis, variables, bibliografía, actividades y revisiones.

## Configuración de Base de Datos

La API utiliza MySQL con las siguientes credenciales:
- **Host:** localhost
- **Usuario:** root
- **Contraseña:** admin
- **Base de datos:** tesis_app

## Instalación y Ejecución

1. Asegúrate de tener MySQL corriendo
2. Instala las dependencias: `npm install`
3. Ejecuta el servidor: `npm start` o `node server.js`

## Endpoints de la API

### Usuarios

#### GET /api/users
Obtener todos los usuarios
```bash
curl -X GET http://localhost:3000/api/users
```

#### GET /api/users/:id
Obtener un usuario específico
```bash
curl -X GET http://localhost:3000/api/users/1
```

#### POST /api/users
Crear un nuevo usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan.perez@universidad.edu",
    "password_hash": "$2b$10$hashedpassword",
    "role": "student",
    "status": "active"
  }'
```

#### PUT /api/users/:id
Actualizar un usuario
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez Actualizado",
    "email": "juan.perez@universidad.edu",
    "role": "advisor"
  }'
```

#### DELETE /api/users/:id
Eliminar un usuario
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Planes de Investigación

#### GET /api/research-plans
Obtener todos los planes de investigación
```bash
curl -X GET http://localhost:3000/api/research-plans
```

#### GET /api/research-plans/:id
Obtener un plan específico
```bash
curl -X GET http://localhost:3000/api/research-plans/1
```

#### POST /api/research-plans
Crear un nuevo plan de investigación
```bash
curl -X POST http://localhost:3000/api/research-plans \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "advisor_id": 2,
    "title": "Estudio sobre Inteligencia Artificial en la Educación",
    "description": "Investigación sobre el impacto de la IA en métodos pedagógicos",
    "status": "draft",
    "progress": 0.0
  }'
```

#### PUT /api/research-plans/:id
Actualizar un plan de investigación
```bash
curl -X PUT http://localhost:3000/api/research-plans/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudio sobre IA en Educación Superior",
    "status": "in_review",
    "progress": 25.5
  }'
```

#### DELETE /api/research-plans/:id
Eliminar un plan de investigación
```bash
curl -X DELETE http://localhost:3000/api/research-plans/1
```

### Secciones

#### GET /api/sections
Obtener todas las secciones
```bash
curl -X GET http://localhost:3000/api/sections
```

#### GET /api/sections/plan/:planId
Obtener secciones de un plan específico
```bash
curl -X GET http://localhost:3000/api/sections/plan/1
```

#### POST /api/sections
Crear una nueva sección
```bash
curl -X POST http://localhost:3000/api/sections \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "type": "introduccion",
    "content": "Esta investigación busca...",
    "status": "pending"
  }'
```

#### PUT /api/sections/:id
Actualizar una sección
```bash
curl -X PUT http://localhost:3000/api/sections/1 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Contenido actualizado de la introducción",
    "status": "reviewed"
  }'
```

### Objetivos

#### GET /api/objectives/plan/:planId
Obtener objetivos de un plan
```bash
curl -X GET http://localhost:3000/api/objectives/plan/1
```

#### POST /api/objectives
Crear un nuevo objetivo
```bash
curl -X POST http://localhost:3000/api/objectives \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "type": "general",
    "description": "Analizar el impacto de la IA en la educación"
  }'
```

### Hipótesis

#### GET /api/hypotheses/plan/:planId
Obtener hipótesis de un plan
```bash
curl -X GET http://localhost:3000/api/hypotheses/plan/1
```

#### POST /api/hypotheses
Crear una nueva hipótesis
```bash
curl -X POST http://localhost:3000/api/hypotheses \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "type": "investigacion",
    "description": "La implementación de IA mejora el rendimiento académico"
  }'
```

### Variables

#### GET /api/variables/plan/:planId
Obtener variables de un plan
```bash
curl -X GET http://localhost:3000/api/variables/plan/1
```

#### POST /api/variables
Crear una nueva variable
```bash
curl -X POST http://localhost:3000/api/variables \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "name": "Uso de IA",
    "conceptual_definition": "Frecuencia de uso de herramientas de IA",
    "operational_definition": "Horas semanales usando plataformas de IA"
  }'
```

### Bibliografía

#### GET /api/bibliography/plan/:planId
Obtener bibliografía de un plan
```bash
curl -X GET http://localhost:3000/api/bibliography/plan/1
```

#### POST /api/bibliography
Crear una nueva entrada bibliográfica
```bash
curl -X POST http://localhost:3000/api/bibliography \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "citation": "Smith, J. (2023). Artificial Intelligence in Education. Academic Press."
  }'
```

### Actividades (Cronograma)

#### GET /api/activities/plan/:planId
Obtener actividades de un plan
```bash
curl -X GET http://localhost:3000/api/activities/plan/1
```

#### POST /api/activities
Crear una nueva actividad
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "activity_name": "Recopilación de datos",
    "description": "Recopilar datos de estudiantes",
    "start_date": "2024-01-15",
    "end_date": "2024-02-15",
    "progress": 0.0,
    "status": "pending"
  }'
```

### Revisiones

#### GET /api/reviews/plan/:planId
Obtener revisiones de un plan
```bash
curl -X GET http://localhost:3000/api/reviews/plan/1
```

#### POST /api/reviews
Crear una nueva revisión
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "section_id": 1,
    "reviewer_id": 2,
    "comment": "La introducción necesita más desarrollo teórico",
    "status": "pending"
  }'
```

### Historial de Planes

#### GET /api/plan-history/plan/:planId
Obtener historial de un plan
```bash
curl -X GET http://localhost:3000/api/plan-history/plan/1
```

#### POST /api/plan-history
Crear una nueva entrada de historial
```bash
curl -X POST http://localhost:3000/api/plan-history \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 1,
    "user_id": 2,
    "action": "updated_section",
    "description": "Actualizó la sección de introducción"
  }'
```

## Códigos de Estado HTTP

- **200:** Éxito
- **201:** Recurso creado
- **400:** Datos inválidos
- **404:** Recurso no encontrado
- **409:** Conflicto (ej: email duplicado)
- **500:** Error interno del servidor

## Estructura de Respuestas

Todas las respuestas siguen este formato:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

En caso de error:
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## Notas Importantes

- Todos los campos requeridos deben ser proporcionados
- Las fechas deben estar en formato YYYY-MM-DD
- Los IDs de usuario y plan deben existir antes de crear registros relacionados
- La base de datos debe estar creada y las tablas deben existir antes de usar la API