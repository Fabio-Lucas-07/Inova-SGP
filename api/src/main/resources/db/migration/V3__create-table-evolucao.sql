CREATE TABLE evolucao (
    id BIGSERIAL PRIMARY KEY,
    prontuario_id BIGINT NOT NULL,
    date DATE NOT NULL,
    session_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_evolucao_prontuario FOREIGN KEY (prontuario_id) REFERENCES prontuario (id) ON DELETE CASCADE
);

CREATE INDEX idx_evolucao_prontuario ON evolucao (prontuario_id);
