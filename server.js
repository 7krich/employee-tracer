const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


// connect to database (mysql)
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'krich',
        database: 'company'
    },
    console.log('Connected to the company database.')
);

//object to access promp messages
const promptMsg = {
    viewAllDepartments: 'View all departments',
    viewAllRoles: 'View all roles',
    viewAllEmployees: 'View all employees',
    addDepartment: 'Add a department',
    addRole: 'Add a role',
    addEmployee: 'Add a new employee',
    updateEmployeeRole: 'Update an employee role',
    quit: 'Quit'
};

db.connect(err => {
    if (err) throw err;
    prompt();

});

// object containing questions for user input
const prompt = () => {
    inquirer
    .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            promptMsg.viewAllDepartments,
            promptMsg.viewAllRoles,
            promptMsg.viewAllEmployees,
            promptMsg.addDepartment,
            promptMsg.addRole,
            promptMsg.addEmployee,
            promptMsg.updateEmployeeRole,
            promptMsg.quit
        ]
    })
    .then(answer => {
        console.log('answer', answer);
        // use switch statement to execute function base on answer/'action' aka choice from pomptUser();
        switch(answer.action) {

            case promptMsg.viewAllDepartments: viewAllDepartments();
            break;

            case promptMsg.viewAllRoles: viewAllRoles();
            break;

            case promptMsg.viewAllEmployees: viewAllEmployees();
            break;

            case promptMsg.addDepartment: addDepartment();
            break;

            case promptMsg.addRole: addRole();
            break;

            case promptMsg.addEmployee: addEmployee();
            break;

            case promptMsg.updateEmployee: updateEmployee();
            break;

            case promptMsg.quit: db.end();
            break;
        }
    });
};

// view all departments
function viewAllDepartments() {
    const query = `SELECT * FROM department;`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log('Now viewing all departments:');
        console.table(res);
        prompt();
    })
};

// present the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
    const query = `SELECT role.id AS role_id, role.title, role.salary, department.name AS department
    FROM role
    INNER JOIN department ON (department.id = role.department_id);`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log('Now viewing all roles:');
        console.table(res);
        prompt();
    })
};

// present employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log('Now viewing all employees:');
        console.table(res);
        prompt();
    })
};

// enter the name of the department and that department is added to the database
const addDepartment = async () => {
    try {
        console.log("Add a department");

        let answer = await inquirer.prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'What is the name of the department you like to add?'
            }
        ]);

        db.query("INSERT INTO department SET ?", {
            name: answer.departmentName
        });

        console.log(`${answer.departmentName} successfully added to the database.`);
        prompt();

    } catch (err) {
        console.log(err);
        prompt();
    };
};