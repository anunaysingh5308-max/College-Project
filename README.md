# Student Result Management System

A web-based Student Result Management System built using **Python Flask, SQLite, HTML, CSS, and JavaScript**.

## Features

- Add and save student results
- Automatically calculate total marks
- Automatically calculate average and percentage
- Automatic grade calculation
- Automatic PASS/FAIL result
- Search students by name or roll number
- View all students
- Edit/update an existing result
- Delete a student
- View complete result
- Class statistics
- Grade distribution
- Responsive modern dashboard
- Persistent SQL database using SQLite

## Grading System

| Percentage | Grade |
|---|---|
| 90–100 | A+ |
| 80–89 | A |
| 70–79 | B |
| 60–69 | C |
| 50–59 | D |
| 40–49 | E |
| Below 40 | F |

A student is marked **PASS** when the percentage is 40 or above.

## Technologies Used

- Python
- Flask
- SQLite / SQL
- HTML5
- CSS3
- JavaScript
- Fetch API

## Project Structure

```text
COLLEGE PROJECT/
│
├── main.py
├── student.db
├── requirements.txt
├── README.md
├── statement.md
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## Database

The SQLite database contains a `students` table with:

- `id`
- `name`
- `roll_no`
- `subject1`
- `subject2`
- `subject3`
- `subject4`
- `subject5`
- `total`
- `average`
- `percentage`
- `grade`
- `result`

The database file is created automatically when the Flask application starts.

## Installation

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install Flask:

```bash
python -m pip install Flask
```

Or install from requirements:

```bash
pip install -r requirements.txt
```

## Run the Project

From the project folder:

```bash
python main.py
```

Then open:

```text
http://127.0.0.1:5000
```

## How the System Works

1. User enters student details and five subject marks.
2. JavaScript sends the information to Flask.
3. Flask validates the marks.
4. Python calculates total, average, percentage, grade, and result.
5. The result is stored in SQLite using SQL.
6. The frontend displays the saved result.
7. Saved records can later be searched, viewed, edited, deleted, or analyzed.

## Main Flask Routes

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Opens the dashboard |
| `/calculate` | POST | Adds a new result |
| `/students` | GET | Returns all students |
| `/search` | GET | Searches by name or roll number |
| `/students/<id>` | PUT | Updates a result |
| `/students/<id>` | DELETE | Deletes a student |
| `/statistics` | GET | Returns class statistics |

## SQL Concepts Used

The project demonstrates:

- `CREATE TABLE`
- `INSERT`
- `SELECT`
- `WHERE`
- `LIKE`
- `UPDATE`
- `DELETE`
- Aggregate functions such as `COUNT`, `AVG`, `MAX`, `MIN`, and `SUM`
- Parameterized SQL queries

## Educational Purpose

This project demonstrates how a Python program can be converted into a complete database-backed web application. It combines programming logic, database management, frontend development, backend development, and basic data analytics.

## Author

Student Result Management System — Academic Project
