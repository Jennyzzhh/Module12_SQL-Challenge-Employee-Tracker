const express = require('express')
const mysql = require('mysql2')
const fs = require('fs');
const { default: inquirer } = require('inquirer');
const { response } = require('express');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Zzh929514!',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)

);

menu()

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
            } else if (responses.question === "add an employee") {
                addEmployee();
            }
        })
}

function viewDepartment() {
    db.query('SELECT * FROM department', function (err, data) {
        console.table(data)
        menu()
    })
}

function addEmployee() {
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
            type: 'input',
            name: 'role_id',
            message: 'what is the role of employee? ',
        },
        {
            type: 'Input',
            name: 'manager_id',
            message: 'what is the manager of the employee? ',
        },
    ]
    inquirer
        .prompt(employeeQuestion)
        .then((response) => {
            console.log(response)
            // const employee = new employee(response.employee_first, response.employee_last, response.eployee_role, response.employee_manager)
            db.query('INSERT INTO employee SET ?', response, function (err, data) {
                console.log(data)
                menu()
            })
        }
        );
}
