const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
const Query = require('./queries');

const query = new Query;

function prompt () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'prompt',
            choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add an Employee', 'Add a Department', 'Add a Role', "Update an Employee's Role"]
        }
    ])
        .then(data => formHandler(data.prompt));
}

function formHandler(choice) {
    if (choice === 'View All Employees') {
        const sql = query.selectEmployees();

        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
            prompt();
        });
    };

    if (choice === 'View All Departments') {
        const sql = query.seletDepartments();

        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
            prompt();
        });
    }

    if (choice === 'View All Roles') {
        const sql = query.selectRoles();

        // add to class
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
            prompt();
        });
    }

    if (choice === 'Add a Department') {
        inquirer.prompt(
            {
                type: 'input',
                name: 'addDept',
                message: 'What is the department name?',
                validate: dept => {
                    if (dept) {
                        return true;
                    }
                    else {
                        console.log('Value cannot be blank!');
                        return false;
                    }
                }
            }
        )
        .then(data => {
            console.log(data);
        });
    }
};

prompt();