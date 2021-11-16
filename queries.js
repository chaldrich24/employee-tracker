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

    addRole(title, salary, department, departmentData) {
        let id = 0;

        for (i = 0; i < departmentData.length; i++) {
            if (departmentData[i].name === department) {
                id = departmentData[i].id;
            }
        }

        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
        const params = [title, salary, id];

        return [sql,params];
    }

    addEmployee(first_name, last_name, role, manager, rolesData, managerData) {
        let rolesId = 0;
        let managerId = 0;

        for (i = 0; i < rolesData.length; i++) {
            if (rolesData[i].title === role) {
                rolesId = rolesData[i].id;
            }
        }

        for (i = 0; i < managerData.length; i++) {
            if (managerData[i].full_name === manager) {
                managerId = managerData[i].id;
            }
        }

        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const params = [first_name, last_name, rolesId, managerId];

        return [sql, params];
    }

    updateRole(employee, role, employeeData, rolesData) {
        let empId = 0;
        let roleId = 0;

        for (i = 0; i < employeeData.length; i++) {
            if (employeeData[i].full_name === employee) {
                empId = employeeData[i].id;
            }
        }

        for (i = 0; i < rolesData.length; i++) {
            if (rolesData[i].title === role) {
                roleId = rolesData[i].id;
            }
        }
        
        const sql = 'UPDATE employees SET role_id = ? WHERE id = ?';
        const params = [roleId, empId];

        return [sql, params];
    }
};

module.exports = Query;
