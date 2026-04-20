USE paypals_db;

-- ================================================
-- 1. LIST ALL USERS
-- ================================================
SELECT * FROM users;

-- ================================================
-- 2. LIST ALL GROUPS
-- ================================================
SELECT * FROM groups;

-- ================================================
-- 3. LIST MEMBERS OF EACH GROUP
-- ================================================
SELECT g.name AS group_name, u.name AS member_name
FROM group_members gm
JOIN groups g ON g.id = gm.group_id
JOIN users u ON u.id = gm.user_id
ORDER BY g.id;

-- ================================================
-- 4. LIST EXPENSES BY GROUP
-- ================================================
SELECT e.*, u.name AS paid_by
FROM expenses e
JOIN users u ON u.id = e.paid_by_user_id
WHERE e.group_id = 1;

-- ================================================
-- 5. TOTAL GROUP EXPENSE
-- ================================================
SELECT group_id, SUM(amount) AS total_expense
FROM expenses
GROUP BY group_id;

-- ================================================
-- 6. BALANCE CHECK (MANUAL)
-- (Backend does final calculation; this is partial test)
-- ================================================
SELECT 
  e.group_id,
  u.name AS paid_by,
  e.amount,
  e.description,
  e.created_at
FROM expenses e
JOIN users u ON u.id = e.paid_by_user_id
ORDER BY e.group_id, e.created_at;
