from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = "students.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection

def create_database():

    conn = get_db_connection()
    cursor = conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,
            roll_no TEXT NOT NULL,

            subject1 REAL NOT NULL,
            subject2 REAL NOT NULL,
            subject3 REAL NOT NULL,
            subject4 REAL NOT NULL,
            subject5 REAL NOT NULL,

            total REAL NOT NULL,
            average REAL NOT NULL,
            percentage REAL NOT NULL,

            grade TEXT NOT NULL,
            result TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

# Calculate the total marks of all subjects
def calculate_total(marks):
    return sum(marks)

# Decide the grade based on the percentage

def calculate_average(total, number_of_subjects):
    return total / number_of_subjects


def calculate_percentage(total, maximum_marks):
    return (total / maximum_marks) * 100


def calculate_grade(percentage):

    if percentage >= 90:
        return "A+"

    elif percentage >= 80:
        return "A"

    elif percentage >= 70:
        return "B"

    elif percentage >= 60:
        return "C"

    elif percentage >= 50:
        return "D"

    elif percentage >= 40:
        return "E"

    else:
        return "F"

def get_result_details(marks):
    total = calculate_total(marks)
    average = calculate_average(total, len(marks))
    percentage = calculate_percentage(total, 500)
    grade = calculate_grade(percentage)

    result = "PASS" if percentage >= 40 else "FAIL"

    return total, average, percentage, grade, result

def validate_marks(marks):
    if len(marks) != 5:
        return False

    for mark in marks:
        if mark < 0 or mark > 100:
            return False

    return True

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/calculate", methods=["POST"])
def calculate():

    data = request.json

    try:

        name = data["name"].strip()
        roll_no = data["roll_no"].strip()

        marks = [float(mark)for mark in data["marks"]]

    except (KeyError, ValueError, TypeError):

        return jsonify({"error": "Invalid student data."}), 400

    if not name or not roll_no:

        return jsonify({"error": "Name and roll number are required."}), 400

    if not validate_marks(marks):
        return jsonify({
        "error": "Marks must be between 0 and 100, and exactly 5 marks are required."
    }), 400

    total, average, percentage, grade, result = get_result_details(marks)

    connection = get_db_connection()

    cursor = connection.execute("""
        INSERT INTO students (
            name,
            roll_no,
            subject1,
            subject2,
            subject3,
            subject4,
            subject5,
            total,
            average,
            percentage,
            grade,
            result
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (name,roll_no,
        marks[0],
        marks[1],
        marks[2],
        marks[3],
        marks[4],total,average,percentage,grade,result))

    student_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return jsonify({

        "id": student_id,

        "name": name,

        "roll_no": roll_no,

        "marks": marks,

        "total": total,

        "average": round(average,2),

        "percentage": round(percentage,2),

        "grade": grade,

        "result": result
    })

@app.route("/students", methods=["GET"])
def get_students():

    connection = get_db_connection()

    students = connection.execute("""
        SELECT *
        FROM students
        ORDER BY id DESC
    """).fetchall()

    connection.close()

    return jsonify([
        dict(student)
        for student in students
    ])


@app.route("/search", methods=["GET"])
def search_student():

    query = request.args.get(
        "query",
        ""
    ).strip()

    if not query:

        return jsonify({"error": "Please enter a name or roll number."
        }), 400

    connection = get_db_connection()

    students = connection.execute("""
        SELECT *
        FROM students
        WHERE name LIKE ?
           OR roll_no LIKE ?
        ORDER BY id DESC
    """, (f"%{query}%",f"%{query}%")).fetchall()

    connection.close()

    return jsonify([dict(student)for student in students])


@app.route("/students/<int:student_id>",methods=["PUT"])
def update_student(student_id):

    data = request.json

    try:

        name = data["name"].strip()

        roll_no = data["roll_no"].strip()

        marks = [float(mark)for mark in data["marks"]]

    except (KeyError, ValueError, TypeError):

        return jsonify({"error": "Invalid data."}), 400

    if not name or not roll_no:

        return jsonify({"error": "Name and roll number are required."}), 400

    if not validate_marks(marks):
        return jsonify({
        "error": "Marks must be between 0 and 100, and exactly 5 marks are required."
    }), 400

    total, average, percentage, grade, result = get_result_details(marks)

    connection = get_db_connection()

    cursor = connection.execute("""
        UPDATE students
        SET
            name = ?,
            roll_no = ?,
            subject1 = ?,
            subject2 = ?,
            subject3 = ?,
            subject4 = ?,
            subject5 = ?,
            total = ?,
            average = ?,
            percentage = ?,
            grade = ?,
            result = ?
        WHERE id = ?
    """, (
        name,
        roll_no,
        marks[0],
        marks[1],
        marks[2],
        marks[3],
        marks[4],
        total,average,percentage,grade,result,student_id))

    connection.commit()

    updated = cursor.rowcount

    connection.close()

    if updated == 0:

        return jsonify({"error": "Student not found."}), 404

    return jsonify({

        "message":
            "Result updated successfully.",

        "id": student_id,

        "name": name,

        "roll_no": roll_no,

        "total": total,

        "average": round(average,),

        "percentage": round(percentage,),

        "grade": grade,

        "result": result

    })


@app.route("/students/<int:student_id>",methods=["DELETE"])
def delete_student(student_id):

    connection = get_db_connection()

    cursor = connection.execute(
        """
        DELETE FROM students
        WHERE id = ?
        """,
        (student_id,)
    )

    connection.commit()

    deleted = cursor.rowcount

    connection.close()

    if deleted == 0:

        return jsonify({
            "error": "Student not found."
        }), 404

    return jsonify({
        "message":
            "Student deleted successfully."
    })


@app.route("/statistics", methods=["GET"])
def class_statistics():

    connection = get_db_connection()

    stats = connection.execute("""
        SELECT

            COUNT(*) AS total_students,

            ROUND(
                AVG(percentage),
                2
            ) AS average_percentage,

            ROUND(
                MAX(percentage),
                2
            ) AS highest_percentage,

            ROUND(
                MIN(percentage),
                2
            ) AS lowest_percentage,

            SUM(
                CASE
                    WHEN result = 'PASS'
                    THEN 1
                    ELSE 0
                END
            ) AS passed_students,

            SUM(
                CASE
                    WHEN result = 'FAIL'
                    THEN 1
                    ELSE 0
                END
            ) AS failed_students,

            SUM(
                CASE
                    WHEN grade = 'A+'
                    THEN 1
                    ELSE 0
                END
            ) AS a_plus,

            SUM(
                CASE
                    WHEN grade = 'A'
                    THEN 1
                    ELSE 0
                END
            ) AS a_grade,

            SUM(
                CASE
                    WHEN grade = 'B'
                    THEN 1
                    ELSE 0
                END
            ) AS b_grade,

            SUM(
                CASE
                    WHEN grade = 'C'
                    THEN 1
                    ELSE 0
                END
            ) AS c_grade,

            SUM(
                CASE
                    WHEN grade = 'D'
                    THEN 1
                    ELSE 0
                END
            ) AS d_grade,

            SUM(
                CASE
                    WHEN grade = 'E'
                    THEN 1
                    ELSE 0
                END
            ) AS e_grade,

            SUM(
                CASE
                    WHEN grade = 'F'
                    THEN 1
                    ELSE 0
                END
            ) AS f_grade

        FROM students
    """).fetchone()

    connection.close()

    return jsonify(dict(stats))


if __name__ == "__main__":
    create_database()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )