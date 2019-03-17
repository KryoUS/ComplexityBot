CREATE TABLE DiscordBotLog (
	id SERIAL PRIMARY KEY,
	created_at timestamptz NOT NULL DEFAULT now(),
	epoch_datetime BIGINT,
	userid TEXT,
	username TEXT,
	useravatarURL TEXT,
	message TEXT,
	error jsonb NOT NULL DEFAULT '{}'
)