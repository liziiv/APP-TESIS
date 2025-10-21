-- ========================================
--  CREACIÓN DE BASE DE DATOS
-- ========================================
-- Nota: La base de datos debe crearse manualmente o mediante docker-compose
-- Comando: CREATE DATABASE tesis_app ENCODING 'UTF8' LC_COLLATE 'es_GT.UTF-8' LC_CTYPE 'es_GT.UTF-8' TEMPLATE template0;

-- ========================================
-- 1. TABLA DE USUARIOS
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student','advisor','admin')) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. TABLA DE PLANES DE INVESTIGACIÓN
-- ========================================
CREATE TABLE IF NOT EXISTS research_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('draft','completed')) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- 3. TABLA DE SECCIONES DEL PLAN
-- (Introducción, Justificación, Marco Teórico, Conceptual, Metodológico, etc.)
-- ========================================
CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL,
  type VARCHAR(50) CHECK (type IN (
    'introduccion',
    'justificacion',
    'marco_teorico',
    'marco_conceptual',
    'marco_metodologico',
    'objetivos',
    'hipotesis',
    'variables',
    'cronograma',
    'bibliografia'
  )) NOT NULL,
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES research_plans(id) ON DELETE CASCADE
);

-- ========================================
-- 4. TABLA DE OBJETIVOS
-- ========================================
CREATE TABLE IF NOT EXISTS objectives (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL,
  type VARCHAR(20) CHECK (type IN ('general','especifico')) NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (plan_id) REFERENCES research_plans(id) ON DELETE CASCADE
);

-- ========================================
-- 5. TABLA DE HIPÓTESIS
-- ========================================
CREATE TABLE IF NOT EXISTS hypotheses (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL,
  type VARCHAR(20) CHECK (type IN ('nula','investigacion')) NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (plan_id) REFERENCES research_plans(id) ON DELETE CASCADE
);

-- ========================================
-- 6. TABLA DE VARIABLES
-- ========================================
CREATE TABLE IF NOT EXISTS variables (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  conceptual_definition TEXT,
  operational_definition TEXT,
  FOREIGN KEY (plan_id) REFERENCES research_plans(id) ON DELETE CASCADE
);

-- ========================================
-- 7. TABLA DE BIBLIOGRAFÍA
-- ========================================
CREATE TABLE IF NOT EXISTS bibliography (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL,
  citation TEXT NOT NULL,
  FOREIGN KEY (plan_id) REFERENCES research_plans(id) ON DELETE CASCADE
);

-- ========================================
-- 8. TABLA DE ACTIVIDADES (Cronograma)
-- ========================================
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL,
  activity_name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  FOREIGN KEY (plan_id) REFERENCES research_plans(id) ON DELETE CASCADE
);

-- ========================================
-- 9. TABLA DE RESPUESTAS DE ENCUESTAS
-- ========================================
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL,
  question VARCHAR(255) NOT NULL,
  answer TEXT,
  FOREIGN KEY (plan_id) REFERENCES research_plans(id) ON DELETE CASCADE
);
