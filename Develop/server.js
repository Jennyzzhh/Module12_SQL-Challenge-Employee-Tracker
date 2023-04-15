const express = require('express')
const mysql = require('mysql2')
const fs = require('fs');
const inquirer = require('inquirer');
const { title } = require('process');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Zzh929514!',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)

); 

db.connect(()=>{
    menu()
})

let questions = [
    {
        type: 'list',
        name: 'question',
        message: 'what would you like to do? ',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']

    }
]

function menu() {
    inquirer
        .prompt(questions)
        .then((responses) => {
            if (responses.question === "view all departments") {
                viewDepartment();
            } else if (responses.question === "view all roles") {
                viewRoles();

            } else if (responses.question === "view all employees") {
                viewEmployees();

            } else if (responses.question === "add a department") {
                addDepartment();

            } else if (responses.question === "add a role") {
                addRole();

            } else if (responses.question === "add an employee") {
                addEmployee();

            } 
            else if (responses.question === "update an employee role") {
                updateRole();
            }
        })
}

function viewDepartment() {
    db.query('SELECT * FROM department', function (err, data) {
        console.table(data)
        menu()
    })
}

function viewRoles() {
    db.query('SELECT * FROM role', function (err, data) {
        console.table(data)
        menu()
    })
}

function viewEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", 
        function (err, data) {
        //sql index self reference 
        console.table(data)
        menu()
    })
}

function addDepartment() {
    let departmentQuestion = [
        {
            type: 'input',
            name: 'name',
            message: 'what is the name of department? ',

        },
    ]
    inquirer
        .prompt(departmentQuestion)
        .then((response) => {
            console.log(response)
            db.query('INSERT INTO department SET ?', response, function (err, data) {


                menu()
            })
        }
        );
}

function addRole() {
    db.query("SELECT name, id value from department", (err, data) => {


    let roleQuestion = [
        {
            type: 'input',
            name: 'title',
            message: 'what is the title of role? ',

        },
        {
            type: 'input',
            name: 'salary',
            message: 'what is the amount of salary? ',

        },
        {
            type: 'list',
            name: 'department_id',
            message: 'which department does the role belong to? ',
            choices: data,


        },
    ]
    inquirer
        .prompt(roleQuestion)
        .then((response) => {
            console.log(response)
            db.query('INSERT INTO role SET ?', response, function (err, data) {
                console.log(data)
                menu()
            })
        }
        );
    })
}


function addEmployee() {
    db.query("SELECT title name, id value FROM role", (err,data)=>{ 
        db.query("SELECT concat(first_name,' ', last_name) name , id value FROM employee", (err,managerdata) => {
            let employeeQuestion = [
        {
            type: 'input',
            name: 'first_name',
            message: 'what is the first name of employee? ',

        },
        {
            type: 'input',
            name: 'last_name',
            message: 'what is the last name of employee? ',

        },
        {
            type: 'list',
            name: 'role_id',
            message: 'what is the role of employee? ',
            choices: data,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the manager of the employee? ',
            choices: managerdata,
        },
    ]
    inquirer
        .prompt(employeeQuestion)
        .then((response) => {
            console.log(response)
            db.query('INSERT INTO employee SET ?', response, function (err, data) {
                console.log(data)
                menu()
            })
        })
    })
        })
        
}

function updateRole() {
db.query("SELECT title name, id value FROM role ", (err,data)=> {
db.query("SELECT concat(first_name,' ', last_name) name , id value FROM employee", (err,employeedata) => {


    let updateRoleQuestion = [
        {
            type: 'list',
            name: 'manager_id',
            message: 'which employee role you want to update ',
            choices: employeedata


        },
        {
            type: 'list',
            name: 'role_id', 
            message: 'which role do you want to assign to the selected employee',
            choices: data


        },
    ]
    inquirer 
        .prompt(updateRoleQuestion)
        .then((response) => {
            console.log(response)
            db.query('UPDATE employee SET role_id =  ? WHERE id = ?', [response.role_id, response.manager_id ], function (err, data) { 
                console.log(data)
                menu()
            })
        }
        );

    })
})

}
