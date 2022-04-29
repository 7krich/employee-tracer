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
    viewAllDepartments: "View all departments",
    viewAllRoles: "View all roles",
    viewAllEmployees: "View all employees",
    addDepartment: "Add a department",
    addRole: "Add a role",
    addEmployee: "Add a new employee",
    updateEmployeeRole: "Update an employee role",
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
            case promptMsg.viewAllDepartments: showCompanyTable();
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

//display company db table
function showCompanyTable() {
    const query = `SELECT * FROM employee
    ORDER BY employee.id;`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log('View all employees:');
        console.table(res);
        prompt();
    })
}