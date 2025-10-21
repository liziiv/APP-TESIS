# TESIS APP - PostgreSQL con Docker

Aplicación Node.js para gestión de planes de investigación académica, configurada para usar PostgreSQL 14 con Docker.

## 🚀 Configuración e Instalación

### ✅ Características Implementadas

- **String de conexión PostgreSQL** usando variables de entorno del archivo `.env`
- **Servidor Express** en `index.js` con endpoints básicos para usuarios
- **Configuración Docker** completa con `docker-compose.yml` y `Dockerfile`
- **Inicialización automática** de la base de datos ejecutando `tesis_app.sql`
- **Script separado** `init-db.js` para manejo robusto de inicialización

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (opcional, solo para desarrollo local)

### Instalación con Docker (Recomendado)

1. **Clonar el repositorio y navegar al directorio:**
   ```bash
   cd "c:/Users/ReynaPC/Documents/APP TESIS"
   ```

2. **Instalar dependencias de Node.js:**
   ```bash
   npm install
   ```

3. **Levantar la aplicación con Docker Compose:**
   ```bash
   docker-compose up -d
   ```

   Esto levantará:
   - **PostgreSQL 14** en el puerto 5432 (contenedor: tesis_postgres)
   - **Aplicación Node.js** en el puerto 3000 (contenedor: tesis_app)
   - **Ejecutará automáticamente** el script `tesis_app.sql` para crear las tablas

4. **Verificar que todo esté funcionando:**
   - Aplicación: http://localhost:3000
   - Health check: http://localhost:3000/api/health
   - Ver logs: `docker-compose logs -f`

### Instalación para Desarrollo Local (sin Docker)

1. **Instalar PostgreSQL 14:**
   ```bash
   # Usando Docker para solo PostgreSQL
   docker run --name tesis-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tesis_app -p 5432:5432 -d postgres:14
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el script SQL manualmente:**
   ```bash
   psql -h localhost -U postgres -d tesis_app -f tesis_app.sql
   ```

4. **Iniciar la aplicación:**
   ```bash
   npm run dev
   ```

## 📊 Estructura de la Base de Datos

La aplicación crea las siguientes tablas:

- **users**: Usuarios del sistema (estudiantes, asesores, administradores)
- **research_plans**: Planes de investigación
- **sections**: Secciones de cada plan (introducción, marco teórico, etc.)
- **objectives**: Objetivos generales y específicos
- **hypotheses**: Hipótesis de investigación
- **variables**: Variables del estudio
- **bibliography**: Referencias bibliográficas
- **activities**: Cronograma de actividades
- **survey_responses**: Respuestas de encuestas

## 🔧 Variables de Entorno

El archivo `.env` incluye:

```env
# Configuración del servidor
PORT=3000

# Configuración de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tesis_app

# JWT Secret para autenticación
JWT_SECRET=ProyectoGraduacion

# Nota: Para Docker Compose, el host interno será 'postgres'
# Para desarrollo local, usar 'localhost'
```

### String de Conexión PostgreSQL

La aplicación utiliza automáticamente las variables de entorno para construir el string de conexión:

```javascript
// Configuración automática basada en entorno
const isDocker = process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV === 'true';
const dbHost = isDocker ? 'postgres' : (process.env.DB_HOST || 'localhost');

const pool = new Pool({
  host: dbHost,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

## 🛠️ Comandos Disponibles

### Desarrollo Local
- `npm start`: Iniciar la aplicación en producción
- `npm run dev`: Iniciar con nodemon para desarrollo (recomendado)
- `node init-db.js`: Inicializar base de datos manualmente

### Docker
- `docker-compose up -d`: Levantar toda la aplicación (PostgreSQL + Node.js)
- `docker-compose down`: Detener la aplicación
- `docker-compose logs -f`: Ver logs en tiempo real
- `docker-compose up --build`: Reconstruir imágenes y levantar

### Base de Datos Individual
- `docker run --name tesis-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tesis_app -p 5432:5432 -d postgres:14`: Solo PostgreSQL para desarrollo

## 🔍 Health Check y Endpoints

### Health Check
- **GET** `http://localhost:3000/api/health` - Verifica conexión a PostgreSQL

### Endpoints de Usuario (Ejemplos)
- **GET** `http://localhost:3000/api/users` - Obtener todos los usuarios
- **POST** `http://localhost:3000/api/users` - Crear nuevo usuario

```json
{
  "name": "Usuario Ejemplo",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "role": "student"
}
```

## 📝 Notas Importantes

✅ **Configuración Completa**:
- ✅ String de conexión PostgreSQL usando variables de `.env`
- ✅ Servidor Express básico con endpoints funcionales
- ✅ Configuración Docker completa (docker-compose.yml + Dockerfile)
- ✅ Script de inicialización automática de `tesis_app.sql`
- ✅ Script separado `init-db.js` para manejo robusto

🔧 **Características Técnicas**:
- PostgreSQL 14 Alpine (imagen ligera)
- Node.js 18 Alpine (imagen optimizada)
- Detección automática de entorno (Docker vs desarrollo local)
- Manejo de errores y logging detallado
- Graceful shutdown de conexiones

⚠️ **Consideraciones**:
- El archivo `tesis_app.sql` se ejecuta automáticamente en Docker
- Para desarrollo local necesitas PostgreSQL corriendo en localhost:5432
- Las contraseñas están en texto plano (deberías usar bcryptjs en producción)