INSERT INTO prontuario (cliente_id, status)
SELECT c.id, 'EM_TRATAMENTO'
FROM cliente c
WHERE NOT EXISTS (SELECT 1 FROM prontuario p WHERE p.cliente_id = c.id);
