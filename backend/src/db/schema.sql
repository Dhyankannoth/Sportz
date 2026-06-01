CREATE TYPE match_status AS ENUM ('Scheduled', 'Live', 'Finished');

CREATE TABLE match (
    id            SERIAL        PRIMARY KEY,
    home_team     VARCHAR(100)  NOT NULL,
    away_team     VARCHAR(100)  NOT NULL,
    sport         VARCHAR(50)   NOT NULL,
    start_time    TIMESTAMPTZ   NOT NULL,
    status        match_status  NOT NULL DEFAULT 'Scheduled',
    home_score    INT           NOT NULL DEFAULT 0,
    away_score    INT           NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_match_status ON match (status);

CREATE INDEX idx_match_start_time ON match (start_time);

CREATE TABLE commentary (
    id            SERIAL        PRIMARY KEY,
    match_id      INT           NOT NULL REFERENCES match (id) ON DELETE CASCADE,
    actor         VARCHAR(100),               
    message       TEXT          NOT NULL,    
    minute        INT,                       
    sequence_no   INT           NOT NULL,     
    details       JSONB,                     
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commentary_match_seq ON commentary (match_id, sequence_no);

CREATE INDEX idx_commentary_details ON commentary USING GIN (details);
