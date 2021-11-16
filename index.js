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
                name: 'dept',
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
            const [sql, params] = query.addDepartment(data.dept);

            db.query(sql, params, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            prompt();
        });
    }

    if (choice === 'Add a Role') {
        getDepartmentNames()
        .then(array => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: 'What is the role title?'
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: "What is the role's salary?",
                    validate: number => {
                        if (!isNaN(number) && !isNaN(parseFloat(number))) {
                            return true;
                        }
                        else {
                            console.log('\n', 'Value must be a number.')
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'roleDept',
                    message: "What department does the role fall under?",
                    choices: array[1]
                }
            ])
            .then(data => {
                const params = query.addRole(data.roleTitle, data.roleSalary, data.roleDept, array[0]);
                console.log(data.roleTitle);
                // db.query(sql, params, (err) => {
                //     if (err) {
                //         console.log(err);
                //     }
                //     else {
                //         console.log('Role Added!');
                //     }
                // });
                // prompt();
            })
        });
    }
};

function getDepartmentNames() {
    return new Promise( (resolve, reject) => {
        const sql = `SELECT * FROM departments`;
        const names = [];

        db.query(sql, (err, rows) => {
            if (err) {
                return reject(err);
            }
            for (i = 0; i < rows.length; i++) {
                names.push(rows[i].name);
            }
            resolve([rows, names]);
        });
    });
}

// getDepartmentNames().then(data => console.log(data));

prompt();
