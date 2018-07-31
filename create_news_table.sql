CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    news_datetime BIGINT,
    title TEXT,
    description TEXT,
    link TEXT,
    image TEXT
);