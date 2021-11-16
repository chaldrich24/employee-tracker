class Query {
    selectEmployees() {
        return `SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employees e
            LEFT JOIN roles
            ON e.role_id = roles.id
            LEFT JOIN employees m 
            ON m.id = e.manager_id`;
    }

    seletDepartments() {
        return `SELECT * FROM departments`;
    }

    selectRoles() {
        return `SELECT roles.id, roles.title, roles.salary, departments.name AS department
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id`;
    }    

    addDepartment() {
        return `INSERT INTO departments (name) VALUES (?)`;
    }
};

module.exports = Query;
