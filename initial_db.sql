CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) UNIQUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_hashed_password ON users (hashed_password);

INSERT INTO users (username, hashed_password) VALUES ('user', '$2b$12$bhdFcAIzHcEw.QDm0Zj2PODBeq5okVSqW3vBymk6gPRnK1PugSQRO')