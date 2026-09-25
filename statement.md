# Project Statement

## Title

**Student Result Management System**

## Problem Statement

Educational institutions need an organized way to store, calculate, search, update, and analyze student examination results. Maintaining results manually can make it difficult to retrieve records, update marks, calculate statistics, and prepare complete result information.

The proposed Student Result Management System provides a simple web-based solution for managing student academic results using a SQL database.

## Objective

The main objective is to develop a database-driven application that can:

1. Store student details and subject marks.
2. Calculate total marks automatically.
3. Calculate average and percentage.
4. Assign grades according to predefined percentage ranges.
5. Determine PASS or FAIL status.
6. Search students by name or roll number.
7. Display all stored student records.
8. Update existing student results.
9. Delete student records.
10. Display a complete result for an individual student.
11. Calculate and display class-level statistics.

## Technologies

- Python
- Flask
- SQLite / SQL
- HTML
- CSS
- JavaScript

## Database Design

The system uses a SQLite database named `student.db`.

The `students` table contains:

| Field | Purpose |
|---|---|
| id | Unique student ID |
| name | Student name |
| roll_no | Student roll number |
| subject1 | Marks in Subject 1 |
| subject2 | Marks in Subject 2 |
| subject3 | Marks in Subject 3 |
| subject4 | Marks in Subject 4 |
| subject5 | Marks in Subject 5 |
| total | Total marks |
| average | Average marks |
| percentage | Percentage |
| grade | Calculated grade |
| result | PASS or FAIL |

## Grade Logic

- 90% and above → A+
- 80% and above → A
- 70% and above → B
- 60% and above → C
- 50% and above → D
- 40% and above → E
- Below 40% → F

Percentage of 40% or above is considered PASS.

## Functional Modules

### 1. Add Result

The user enters the student's name, roll number, and five subject marks. The application validates the data, calculates the result, and stores it in SQLite.

### 2. Search Student

The user can search the database using a student's name or roll number. Partial matching is supported through SQL `LIKE`.

### 3. View All Students

All saved student records are retrieved using a SQL `SELECT` query and displayed in the web interface.

### 4. Update Result

An existing student can be selected using the Student ID. The name, roll number, and marks can be edited. The system recalculates the total, average, percentage, grade, and result.

### 5. Delete Student

A selected student record can be permanently removed from the database using a SQL `DELETE` query.

### 6. Class Statistics

The application calculates the total number of students, class average, highest percentage, lowest percentage, number of passed students, number of failed students, pass percentage, and grade distribution.

### 7. Complete Result

The system displays the complete academic record of a selected student, including all five subject marks, total, average, percentage, grade, and final result.

## Expected Outcome

The completed system provides a centralized and easy-to-use platform for student result management. It demonstrates the integration of Python programming with a SQL database and a web-based frontend.

## Conclusion

The Student Result Management System converts a basic result-calculation program into a complete database-backed application. It demonstrates CRUD operations, SQL queries, Python calculations, Flask routing, frontend interaction, and class-level data analysis.
