CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) UNIQUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_hashed_password ON users (hashed_password);

INSERT INTO users (username, hashed_password)
VALUES ('user', '$2b$12$bhdFcAIzHcEw.QDm0Zj2PODBeq5okVSqW3vBymk6gPRnK1PugSQRO');

-- Создание таблицы files
CREATE TABLE files (
    id UUID PRIMARY KEY, -- Основной ключ
    assistant_id UUID NOT NULL,
    data TEXT NOT NULL,
    chunk_number INTEGER, -- Значение можно вычислить и обновить через триггер или вручную
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
    ts_chunk_vector tsvector, -- Векторное представление фрагмента

    -- Объявление внешнего ключа
    CONSTRAINT fk_chunks_files FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
);

CREATE TABLE assistants (
    id UUID PRIMARY KEY,
    creator_id UUID NOT NULL,
    name TEXT NOT NULL,
    icon BYTEA,
    main_color TEXT NOT NULL,
    theme TEXT NOT NULL,
    website_url TEXT NOT NULL,

    CONSTRAINT fk_assistants_users FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE
);
