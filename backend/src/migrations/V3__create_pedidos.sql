CREATE TABLE IF NOT EXISTS clientes (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  telefono   VARCHAR(20)  NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedidos (
  id         SERIAL PRIMARY KEY,
  cliente_id INTEGER      REFERENCES clientes(id) ON DELETE SET NULL,
  items      JSONB        NOT NULL,
  total      NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);
