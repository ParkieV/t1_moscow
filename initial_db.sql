CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) UNIQUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_hashed_password ON users (hashed_password);

INSERT INTO users (username, hashed_password) VALUES ('user', '$2b$12$bhdFcAIzHcEw.QDm0Zj2PODBeq5okVSqW3vBymk6gPRnK1PugSQRO')

-- Создание таблицы files
CREATE TABLE files (
    id UUID PRIMARY KEY, -- Основной ключ
    file_id UUID UNIQUE NOT NULL, -- Уникальный идентификатор файла
    file_name VARCHAR(255) NOT NULL, -- Имя файла
    tag_1 VARCHAR(255), -- Тег 1
    tag_2 VARCHAR(255), -- Тег 2
    tag_3 VARCHAR(255)  -- Тег 3
);

-- Создание таблицы chunks
CREATE TABLE chunks (
    id UUID PRIMARY KEY, -- Основной ключ
    file_id UUID NOT NULL, -- Внешний ключ, связанный с files.file_id
    embed VARCHAR(255), -- Эмбеддинг
    chunk TEXT NOT NULL, -- Текстовый фрагмент
    ts_chunk_vector VECTOR, -- Векторное представление фрагмента

    -- Объявление внешнего ключа
    CONSTRAINT fk_chunks_files FOREIGN KEY (file_id) REFERENCES files (file_id) ON DELETE CASCADE
);