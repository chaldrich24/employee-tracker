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

    addDepartment(dept) {
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        const params = dept;

        return [sql, params];
    }

    addRole(title, salary, department, deptRows) {
        let id = 0;

        for (i = 0; i < deptRows.length; i++) {
            if (deptRows[i].name === department) {
                id = deptRows[i].id;
                return;
            }
            console.log(id);
        }

        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
        const params = [title, salary, id];

        return title;
    }
};

module.exports = Query;
