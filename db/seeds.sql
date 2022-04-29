INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Accounting'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Salesperson', 120000, 1),
    ('Lead Engineer', 200000, 2),
    ('Software Engineer', 140000, 2),
    ('Account Manager', 90000, 3),
    ('Accountant', 100000, 3),
    ('Legal Team Lead', 210000, 4),
    ('Lawyer', 160000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Mike', 'Chan', 1, NULL),
    ('Ashley', 'Rodriguez', 2, NULL),
    ('Kevin', 'Tupik', 3, 2),
    ('Kumal', 'Singh', 4, NULL),
    ('Malia', 'Brown', 5, 4),
    ('Sarah', 'Lourd', 6, NULL),
    ('Tim', 'Allen', 7, 6);
