DROP DATABASE pt_jelou_gestion_proyecto;
CREATE DATABASE pt_jelou_gestion_proyecto;
USE pt_jelou_gestion_proyecto;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_names VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_rol INT NOT NULL,              -- En caso de roles (al momento solo 1)
    user_state TINYINT(1) NOT NULL DEFAULT 1, -- 1 activo, 0 inactivo
    user_clave VARCHAR(255) NOT NULL,   
    user_token TEXT NULL,               -- opcional: por si quieres manejar refresh tokens (quizas)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tabla de proyectos
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATE NOT NULL
);

-- Tabla intermedia para relación muchos a muchos entre proyectos y usuarios
CREATE TABLE project_members (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla de tareas
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('baja', 'media', 'alta') NOT NULL DEFAULT 'media',
    status ENUM('pendiente', 'en-progreso', 'completada') NOT NULL DEFAULT 'pendiente',
    due_date DATE,
    created_at DATE NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- Tabla intermedia: asignación de tareas a usuarios
CREATE TABLE task_assignments (
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
