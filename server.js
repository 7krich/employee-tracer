const db = require('./db/connection')
const inquirer = require('inquirer');
const cTable = require('console.table');

//object to access promp messages
const promptMsg = {
    viewAllDepartments: "View all departments",
    viewAllRoles: "View all roles",
    viewAllEmployees: "View all employees",
    addDepartment: "Add a department",
    addRole: "Add a role",
    addEmployee: "Add a new employee",
    updateEmployeeRole: "Update an employee role"
};

// object containing questions for user input
const promptUser = () => {
    return inquirer.prompt({
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
            promptMsg.updateEmployeeRole
        ]
    })
    .then(answer => {
        console.log(`Answer: ${answer}`);
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
        }
    });
};