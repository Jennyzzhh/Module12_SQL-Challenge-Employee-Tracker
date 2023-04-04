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
    db.query('SELECT * FROM employee', function (err, data) {
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
            choices: data,// how to insert departments into choices 


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
            name: 'manager_id', // how to combine first name and last name 
            message: 'which employee role you want to update ',
            choices: employeedata// how to insert first_name into choices 


        },
        {
            type: 'list',
            name: 'role_id',  // how to combine first name and last name 
            message: 'which role do you want to assign to the selected employee',
            choices: data// how to insert list of roles


        },
    ]
    inquirer // how to update? 
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

// menu()

// sql - no tables under the database ? 