CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    news_datetime BIGINT,
    title TEXT,
    description TEXT,
    link TEXT,
    image TEXT,
    category VARCHAR(30),
    source VARCHAR(30)
);