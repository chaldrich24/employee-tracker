INSERT INTO departments (name)
VALUES
    ('Sales'),
    ('Marketing'),
    ('IT'),
    ('Finance'),
    ('Operations');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Associate', 55000, 1),
    ('Sales Manager', 70000, 1),
    ('Marketing Analyst', 60000, 2),
    ('Marketing Lead', 75000, 2),
    ('Technical Analyst', 60000, 3),
    ('Technical Lead', 80000, 3),
    ('Financial Analyst', 60000, 4),
    ('Financial Head', 80000, 4),
    ('Operations Controller', 60000, 5),
    ('Operations Head', 80000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Bill', 'Belichick', 2, NULL),
    ('John', 'Stamos', 4, NULL),
    ('Jan', 'Levinson', 6, NULL),
    ('Ham', 'Burgler', 8, NULL),
    ('Joel', 'Miller', 10, NULL),
    ('Mac', 'Jones', 1, 1),
    ('Leslie', 'Knope', 1, 1),
    ('Dog', 'Bounty', 3, 2),
    ('River', 'Jeans', 5, 3),
    ('John', 'Krasinski', 5, 3),
    ('Bob', 'Barker', 7, 4),
    ('Aaron', 'Carter', 9, 5),
    ('Ellie', 'Williams', 9, 5);
