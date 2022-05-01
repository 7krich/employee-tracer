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
    updateEmployee: 'Update an employee role',
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
            promptMsg.updateEmployee,
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

// add role - enter the name, salary, and department for the role and that role is added to the database
const addRole = async () => {
    try {
        console.log("Add a role");

        let department = db.query("SELECT * FROM department");

        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of the new role you would like to add?',
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log('Please enter the name of the role you would like to add!');
                        return false;
                    }
                }
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this new role?',
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log('Please enter the salary of the new role!');
                        return false;
                    }
                }
            },
            {
                name: 'departmentId',
                type: 'choice',
                choices: `SELECT department.id, ARRAY department.id AS id_array FROM department`,
                message: 'What department ID needs to be associated with this role?',
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log('Please enter the department ID of the new role!');
                        return false;
                    }
                }
            },

        ]);
        let result = db.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        });

        console.log(`${answer.title} successfully added to the database.`);
        prompt();

    } catch (err) {
        console.log(err);
        prompt();
    };
};

// enter the name of the department and that department is added to the database
const addDepartment = async () => {
    try {
        console.log("Add a department");

        let answer = await inquirer.prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'What is the name of the department you would like to add?'
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

// add employee
// enter the employee’s first name, last name, role, and manager, and that employee is added to the database
const addEmployee = async () => {
    try {
        console.log("Add an employee");

        let employee = db.query("SELECT * FROM employee");

        let answer = await inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: "What is the new employee's first name?",
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log('Please enter the first name of the employee you would like to add!');
                        return false;
                    }
                }
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is the last name of the new employee?',
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log('Please enter the last name of the employee you would like to add!');
                        return false;
                    }
                }
            },
            {
                name: 'role',
                type: 'input',
                choices: `SELECT role.id, ARRAY role.id AS id_array FROM role`,
                message: 'What role ID needs to be associated with this employee?',
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log('Please enter the role ID for the new employee!');
                        return false;
                    }
                }
            },
            {
                name: 'manager',
                type: 'input',
                choices: `SELECT manager.id, ARRAY manager.id AS id_array FROM employee`,
                message: 'What manager ID needs to be associated with this employee?',
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log('Please enter the manager ID for the new employee!');
                        return false;
                    }
                }
            },

        ]);

        let result = db.query("INSERT INTO employee SET ?", {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role,
            manager_id: answer.manager
        });

        console.log(`${answer.first_name} ${answer.last_name} successfully added to the database.`);
        prompt();

    } catch (err) {
        console.log(err);
        prompt();
    };
};

// update an employee role
// prompted to select an employee to update and their new role and this information is updated in the database
const updateEmployee = async () => {

    try {
        console.log("Update an employee role");

        let answer = await inquirer.prompt([
            {
                name: 'employee',
                type: 'input',
                choices: `SELECT employee.id ARRAY employee.id AS id_array FROM employee`,
                message: "Which employee needs an updated role? Please enter the employee's ID",
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log("Please enter the employee's ID!");
                        return false;
                    }
                }
            },
            {
                name: 'role',
                type: 'input',
                choices: `SELECT role.id, ARRAY role.id AS id_array FROM role`,
                message: "What is the employee's new role ID?",
                validate: answer => {
                    if (answer) {
                        return true;
                    } else {
                        console.log("Please add the new role!");
                        return false;
                    }
                }
            }
        ]);

        db.query(`UPDATE employee SET role_id = ${answer.role} WHERE employee.id = ${answer.employee}`, {
            employee_id: answer.employee,
            role: answer.role
        });

        console.log(`Role successfully updated.`);
        prompt();

    } catch (err) {
        console.log(err);
        prompt();
    };
};
