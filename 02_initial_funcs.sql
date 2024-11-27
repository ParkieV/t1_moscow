CREATE OR REPLACE FUNCTION split_text_into_chunks(p_text TEXT, p_chunk_size INTEGER)
RETURNS TABLE(chunk_num INTEGER, chunk TEXT) AS $$
BEGIN
    RETURN QUERY
    WITH words AS (
        SELECT
            ROW_NUMBER() OVER () AS word_no,
            unnest(regexp_matches(p_text, '([A-Za-zА-Яа-яЁё0-9]+(?:-[A-Za-zА-Яа-яЁё0-9]+)*)', 'g')) AS word
    ),
    word_groups AS (
        SELECT
            CEIL(word_no::NUMERIC / p_chunk_size)::INTEGER AS chunk_no,
            word
        FROM words
    )
    SELECT
        chunk_no AS chunk_num,
        STRING_AGG(word, ' ') AS chunk
    FROM word_groups
    GROUP BY chunk_no
    ORDER BY chunk_no;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION count_chunks_in_text(p_text TEXT, p_chunk_size INTEGER)
RETURNS INTEGER AS $$
DECLARE
    num_words INTEGER;
    num_chunks INTEGER;
BEGIN
    -- Считаем количество слов в тексте
    SELECT COUNT(*) INTO num_words
    FROM regexp_split_to_table(p_text, '([A-Za-zА-Яа-яЁё0-9]+(?:-[A-Za-zА-Яа-яЁё0-9]+)*)') AS word;

    -- Вычисляем количество чанков
    num_chunks := CEIL(num_words::NUMERIC / p_chunk_size);

    RETURN num_chunks;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION files_after_insert_trigger()
RETURNS TRIGGER AS $$
DECLARE
    num_chunks INTEGER;
    chunk_size INTEGER := 3000; -- Размер чанка по умолчанию
BEGIN
    -- Вычисляем количество чанков
    num_chunks := count_chunks_in_text(NEW.data, chunk_size);

    -- Обновляем столбец chunk_number для новой строки
    UPDATE files
    SET chunk_number = num_chunks
    WHERE id = NEW.id;

    -- Разбиваем текст на чанки и вставляем их в таблицу chunks
    INSERT INTO chunks (id, file_id, embed, chunk, ts_chunk_vector)
    SELECT
        gen_random_uuid() AS id,
        NEW.file_id AS file_id,
        NULL AS embed,
        c.chunk,
        to_tsvector('russian', c.chunk) AS ts_chunk_vector
    FROM split_text_into_chunks(NEW.data, chunk_size) AS c(chunk_number, chunk); -- Явное указание алиасов

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER files_after_insert_trigger
AFTER INSERT ON files
FOR EACH ROW
EXECUTE FUNCTION files_after_insert_trigger();