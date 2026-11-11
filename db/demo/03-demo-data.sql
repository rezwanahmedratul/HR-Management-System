-- Demo data for realistic dashboard & analytics charts
-- Only loaded via `make seed-demo`
-- Uses INSERT IGNORE so it never conflicts with initial seed

INSERT IGNORE INTO department (department_id, department_name) VALUES
(5, 'Sales'),
(6, 'Operations');

INSERT IGNORE INTO employee (employee_id, employee_name, department_id, email) VALUES
(106, 'Frank Miller', 1, 'frank.miller@company.com'),
(107, 'Grace Hopper', 3, 'grace.hopper@company.com'),
(108, 'Henry Cavill', 2, 'henry.cavill@company.com'),
(109, 'Ivy Chen', 4, 'ivy.chen@company.com'),
(110, 'Jack Ryan', 5, 'jack.ryan@company.com'),
(111, 'Karen Gillan', 6, 'karen.gillan@company.com'),
(112, 'Leo Messi', 5, 'leo.messi@company.com'),
(113, 'Mia Wong', 2, 'mia.wong@company.com'),
(114, 'Nathan Drake', 3, 'nathan.drake@company.com'),
(115, 'Olivia Wilde', 4, 'olivia.wilde@company.com'),
(116, 'Peter Parker', 3, 'peter.parker@company.com'),
(117, 'Quinn Fabray', 1, 'quinn.fabray@company.com'),
(118, 'Rachel Green', 4, 'rachel.green@company.com'),
(119, 'Steve Rogers', 6, 'steve.rogers@company.com'),
(120, 'Tony Stark', 3, 'tony.stark@company.com'),
(121, 'Uma Thurman', 2, 'uma.thurman@company.com'),
(122, 'Victor Stone', 3, 'victor.stone@company.com'),
(123, 'Wanda Maximoff', 1, 'wanda.maximoff@company.com'),
(124, 'Xavier Woods', 5, 'xavier.woods@company.com'),
(125, 'Yvonne Strahovski', 6, 'yvonne.s@company.com'),
(126, 'Zachary Levi', 5, 'zachary.levi@company.com'),
(127, 'Amy Adams', 2, 'amy.adams@company.com'),
(128, 'Bruce Wayne', 6, 'bruce.wayne@company.com'),
(129, 'Clark Kent', 4, 'clark.kent@company.com'),
(130, 'David Tennant', 3, 'david.tennant@company.com'),
(131, 'Emma Watson', 1, 'emma.watson@company.com'),
(132, 'Finn Hudson', 5, 'finn.hudson@company.com'),
(133, 'George Clooney', 2, 'george.clooney@company.com'),
(134, 'Hannah Abbott', 4, 'hannah.abbott@company.com'),
(135, 'Ian McKellen', 3, 'ian.mckellen@company.com'),
(136, 'Julia Roberts', 1, 'julia.roberts@company.com'),
(137, 'Kevin Bacon', 6, 'kevin.bacon@company.com'),
(138, 'Laura Croft', 5, 'laura.croft@company.com'),
(139, 'Matt Damon', 2, 'matt.damon@company.com'),
(140, 'Nina Dobrev', 4, 'nina.dobrev@company.com'),
(141, 'Oscar Isaac', 3, 'oscar.isaac@company.com'),
(142, 'Penelope Cruz', 5, 'penelope.cruz@company.com'),
(143, 'Quentin Tarantino', 4, 'quentin.t@company.com'),
(144, 'Rebecca Ferguson', 6, 'rebecca.f@company.com'),
(145, 'Samuel Jackson', 3, 'samuel.jackson@company.com');

INSERT IGNORE INTO salary (salary_id, employee_id, basic_salary, bonus) VALUES
(6, 106, 52000.00, 4500.00),
(7, 107, 125000.00, 15000.00),
(8, 108, 78000.00, 7000.00),
(9, 109, 61000.00, 5000.00),
(10, 110, 85000.00, 11000.00),
(11, 111, 48000.00, NULL),
(12, 112, 95000.00, 14000.00),
(13, 113, 82000.00, 8000.00),
(14, 114, 105000.00, 12000.00),
(15, 115, 58000.00, 4800.00),
(16, 116, 92000.00, 9000.00),
(17, 117, 46000.00, NULL),
(18, 118, 64000.00, 6000.00),
(19, 119, 72000.00, 6500.00),
(20, 120, 138000.00, 18000.00),
(21, 121, 89000.00, 9500.00),
(22, 122, 98000.00, 10000.00),
(23, 123, 54000.00, 4500.00),
(24, 124, 76000.00, 8500.00),
(25, 125, 68000.00, 5500.00),
(26, 126, 82000.00, 9000.00),
(27, 127, 74000.00, 7000.00),
(28, 128, 135000.00, 16000.00),
(29, 129, 63000.00, 5500.00),
(30, 130, 110000.00, 13000.00),
(31, 131, 49000.00, NULL),
(32, 132, 67000.00, 7500.00),
(33, 133, 91000.00, 10500.00),
(34, 134, 56000.00, 4500.00),
(35, 135, 118000.00, 14000.00),
(36, 136, 51000.00, 4000.00),
(37, 137, 69000.00, NULL),
(38, 138, 88000.00, 11500.00),
(39, 139, 84000.00, 8000.00),
(40, 140, 60000.00, 5000.00),
(41, 141, 102000.00, 11000.00),
(42, 142, 83000.00, 9500.00),
(43, 143, 65000.00, NULL),
(44, 144, 73000.00, 6800.00),
(45, 145, 128000.00, 15500.00);

-- Attendance generation
SET SESSION cte_max_recursion_depth = 2000;

INSERT IGNORE INTO attendance (employee_id, attendance_date, status)
WITH RECURSIVE calendar AS (
    SELECT DATE('2025-04-01') AS dt
    UNION ALL
    SELECT DATE_ADD(dt, INTERVAL 1 DAY)
    FROM calendar
    WHERE dt < '2025-06-30'
),
emp_dates AS (
    SELECT 
        e.employee_id,
        c.dt AS attendance_date,
        CRC32(CONCAT(e.employee_id, '-', DATE_FORMAT(c.dt, '%Y-%m-%d'))) % 100 AS h
    FROM employee e
    CROSS JOIN calendar c
    WHERE WEEKDAY(c.dt) < 5
)
SELECT 
    ed.employee_id,
    ed.attendance_date,
    CASE 
        WHEN ed.h < 84 THEN 'Present'
        WHEN ed.h < 93 THEN 'Leave'
        ELSE 'Absent'
    END AS status
FROM emp_dates ed
WHERE NOT EXISTS (
    SELECT 1 FROM attendance a 
    WHERE a.employee_id = ed.employee_id 
      AND a.attendance_date = ed.attendance_date
);
