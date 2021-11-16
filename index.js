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
                        console.log('\n', 'Value cannot be blank!');
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
                    message: 'What is the role title?',
                    validate: title => {
                        if (title) {
                            return true;
                        }
                        else {
                            console.log('\n', 'Value cannot be blank!');
                            return false;
                        }
                    }
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
                const [sql, params] = query.addRole(data.roleTitle, data.roleSalary, data.roleDept, array[0]);

                db.query(sql, params, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Role Added!');
                    }
                });
                prompt();
            })
        });
    }

    if (choice === 'Add an Employee') {
        const a = getRoleNames();
        const b = getEmployeeNames();
        Promise.all([a, b]).then(([roles, employees]) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "Enter employee's first name:",
                    validate: name => {
                        if (name) {
                            return true;
                        }
                        else {
                            console.log('\n', 'Value cannot be blank!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "Enter employee's last name:",
                    validate: name => {
                        if (name) {
                            return true;
                        }
                        else {
                            console.log('\n', 'Value cannot be blank!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Select employee's role:",
                    choices: roles[1]
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Select employee's manager:",
                    choices: employees[1]
                }
            ])
            .then(data => {
                const [sql, params] = query.addEmployee(data.first_name, data.last_name, data.role, data.manager, roles[0], employees[0]);
                db.query(sql, params, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Employee Added!');
                    }
                });
                prompt();
            });
        });
    }

    if (choice === "Update an Employee's Role") {
        const a = getRoleNames();
        const b = getEmployeeNames();
        Promise.all([a, b]).then(([roles, employees]) => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to update:',
                    choices: employees[1]
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the role you wish to change to:',
                    choices: roles[1]
                }
            ])
            .then(data => {
                const [sql, params] = query.updateRole(data.employee, data.role, employees[0], roles[0]);
                console.log(sql, params);
                db.query(sql, params, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Updated!');
                    }
                });
                prompt();
            });
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

function getRoleNames() {
    return new Promise( (resolve, reject) => {
        const sql = `SELECT * FROM roles`;
        const titles = [];

        db.query(sql, (err, rows) => {
            if (err) {
                return reject(err);
            }
            for (i = 0; i < rows.length; i++) {
                titles.push(rows[i].title);
            }
            resolve([rows, titles]);
        });
    });
}

function getEmployeeNames() {
    return new Promise( (resolve, reject) => {
        const sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees`;
        const names = [];

        db.query(sql, (err, rows) => {
            if (err) {
                return reject(err);
            }
            for (i = 0; i < rows.length; i++) {
                names.push(rows[i].full_name);
            }
            resolve([rows, names]);
        });
    });
}

prompt();
