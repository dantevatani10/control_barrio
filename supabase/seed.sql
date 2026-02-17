--
-- SEED DATA FOR DEMO (Barrio Santa Clara)
--

-- 1. Create Community
INSERT INTO communities (id, name, settings)
VALUES ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Barrio Santa Clara', '{"timezone": "America/Argentina/Buenos_Aires"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Admin User (Linked to Auth User - Placeholder UUID)
-- NOTE: In production, this needs a real auth.users ID.
-- For now, we insert a profile assuming a user with ID 'a1a1...' exists or will exist.
INSERT INTO profiles (id, community_id, role, first_name, last_name, phone_number)
VALUES 
('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'admin', 'Admin', 'Santa Clara', '11-1234-5678')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Unit (Lote 101)
INSERT INTO units (id, community_id, unit_number)
VALUES ('u1u1u1u1-u1u1-u1u1-u1u1-u1u1u1u1u1u1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Lote 101')
ON CONFLICT DO NOTHING;

-- 4. Create Worker (Juan Pérez)
INSERT INTO workers (id, community_id, first_name, last_name, dni, role)
VALUES 
('w1w1w1w1-w1w1-w1w1-w1w1-w1w1w1w1w1w1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Juan', 'Pérez', '20.123.456', 'painter')
ON CONFLICT (community_id, dni) DO NOTHING;

-- 5. Create Insurance Doc (Pending)
INSERT INTO insurance_docs (id, worker_id, community_id, file_url, status, expiry_date)
VALUES 
('i1i1i1i1-i1i1-i1i1-i1i1-i1i1i1i1i1i1', 'w1w1w1w1-w1w1-w1w1-w1w1-w1w1w1w1w1w1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'https://example.com/poliza.pdf', 'pending', '2025-12-31')
ON CONFLICT (id) DO NOTHING;
