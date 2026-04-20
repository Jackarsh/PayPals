USE paypals_db;

-- ================================================
-- SAMPLE USERS
-- ================================================
INSERT INTO users (name, email) VALUES
('Utkarsh Srivastava', 'utkarsh@example.com'),
('Aarav Sharma', 'aarav@example.com'),
('Riya Kapoor', 'riya@example.com'),
('Dev Mishra', 'dev@example.com');

-- ================================================
-- SAMPLE GROUPS
-- ================================================
INSERT INTO groups (name) VALUES
('Roommates'),
('Goa Trip'),
('College Project Team');

-- ================================================
-- GROUP MEMBERS
-- ================================================
INSERT INTO group_members (group_id, user_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 3), (2, 4),
(3, 1), (3, 2), (3, 4);

-- ================================================
-- SAMPLE EXPENSES
-- ================================================
INSERT INTO expenses (group_id, paid_by_user_id, amount, description, created_at) VALUES
(1, 1, 1500, 'Groceries', NOW()),
(1, 2, 500, 'Snacks', NOW()),
(2, 1, 2200, 'Taxi to airport', NOW()),
(2, 3, 900,  'Breakfast', NOW()),
(3, 4, 600,  'Stationery printouts', NOW());
