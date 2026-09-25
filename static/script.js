// ======================================
// ADD / CALCULATE RESULT
// ======================================

async function calculateResult() {

    const name =
        document.getElementById("studentName").value.trim();

    const rollNo =
        document.getElementById("rollNumber").value.trim();

    const marks = [

        Number(
            document.getElementById("subject1").value
        ),

        Number(
            document.getElementById("subject2").value
        ),

        Number(
            document.getElementById("subject3").value
        ),

        Number(
            document.getElementById("subject4").value
        ),

        Number(
            document.getElementById("subject5").value
        )

    ];


    if (!name || !rollNo) {

        showMessage(
            "addMessage",
            "Please enter student name and roll number.",
            "error"
        );

        return;
    }


    if (
        marks.some(
            mark =>
                isNaN(mark) ||
                mark < 0 ||
                mark > 100
        )
    ) {

        showMessage(
            "addMessage",
            "Marks must be between 0 and 100.",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch("/calculate", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    roll_no: rollNo,

                    marks: marks

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                "addMessage",
                data.error ||
                    "Unable to save result.",
                "error"
            );

            return;
        }


        showMessage(
            "addMessage",
            `Result saved successfully! Student ID: ${data.id}`,
            "success"
        );


        clearAddForm();

    }

    catch (error) {

        console.error(error);

        showMessage(
            "addMessage",
            "Unable to connect to the server.",
            "error"
        );
    }
}


// ======================================
// CLEAR ADD FORM
// ======================================

function clearAddForm() {

    document.getElementById(
        "studentName"
    ).value = "";

    document.getElementById(
        "rollNumber"
    ).value = "";

    for (let i = 1; i <= 5; i++) {

        document.getElementById(
            `subject${i}`
        ).value = "";
    }
}


// ======================================
// SEARCH STUDENT
// ======================================

async function searchStudent() {

    const query =
        document.getElementById(
            "searchInput"
        ).value.trim();

    const results =
        document.getElementById(
            "searchResults"
        );

    const message =
        document.getElementById(
            "searchMessage"
        );


    results.innerHTML = "";
    message.innerHTML = "";


    if (!query) {

        message.innerHTML =
            `<p class="error-text">
                Enter a name or roll number.
            </p>`;

        return;
    }


    try {

        const response =
            await fetch(
                `/search?query=${encodeURIComponent(query)}`
            );

        const students =
            await response.json();


        if (students.length === 0) {

            message.innerHTML =
                `<p class="muted-text">
                    No student found.
                </p>`;

            return;
        }


        message.innerHTML =
            `<p class="muted-text">
                ${students.length} student(s) found.
            </p>`;


        students.forEach(
            student => {

                results.innerHTML +=
                    createStudentCard(
                        student
                    );

            }
        );

    }

    catch (error) {

        console.error(error);

        message.innerHTML =
            `<p class="error-text">
                Unable to search database.
            </p>`;
    }
}


// ======================================
// VIEW ALL STUDENTS
// ======================================

async function loadAllStudents() {

    const results =
        document.getElementById(
            "studentsResults"
        );

    const message =
        document.getElementById(
            "studentsMessage"
        );


    results.innerHTML = "";

    message.innerHTML =
        `<p class="muted-text">
            Loading students...
        </p>`;


    try {

        const response =
            await fetch("/students");

        const students =
            await response.json();


        if (students.length === 0) {

            message.innerHTML =
                `<p class="muted-text">
                    No students have been saved yet.
                </p>`;

            return;
        }


        message.innerHTML =
            `<p class="muted-text">
                ${students.length} student(s) found.
            </p>`;


        students.forEach(
            student => {

                results.innerHTML +=
                    createStudentCard(
                        student
                    );

            }
        );

    }

    catch (error) {

        console.error(error);

        message.innerHTML =
            `<p class="error-text">
                Unable to load students.
            </p>`;
    }
}


// ======================================
// CREATE STUDENT CARD
// ======================================

function createStudentCard(student) {

    const resultClass =
        student.result === "PASS"
            ? "pass-text"
            : "fail-text";


    return `

        <div class="student-card">

            <div class="student-card-header">

                <div>

                    <p class="student-id">
                        ID: ${student.id}
                    </p>

                    <h3>
                        ${escapeHTML(student.name)}
                    </h3>

                    <p class="roll">
                        Roll Number:
                        ${escapeHTML(student.roll_no)}
                    </p>

                </div>


                <div class="grade-circle">
                    ${student.grade}
                </div>

            </div>


            <div class="subject-row">

                <div>
                    <span>Subject 1</span>
                    <strong>${student.subject1}</strong>
                </div>

                <div>
                    <span>Subject 2</span>
                    <strong>${student.subject2}</strong>
                </div>

                <div>
                    <span>Subject 3</span>
                    <strong>${student.subject3}</strong>
                </div>

                <div>
                    <span>Subject 4</span>
                    <strong>${student.subject4}</strong>
                </div>

                <div>
                    <span>Subject 5</span>
                    <strong>${student.subject5}</strong>
                </div>

            </div>


            <div class="summary-row">

                <div>
                    <small>Total</small>
                    <strong>
                        ${student.total}
                    </strong>
                </div>

                <div>
                    <small>Average</small>
                    <strong>
                        ${student.average}
                    </strong>
                </div>

                <div>
                    <small>Percentage</small>
                    <strong>
                        ${student.percentage}%
                    </strong>
                </div>

                <div>
                    <small>Result</small>
                    <strong class="${resultClass}">
                        ${student.result}
                    </strong>
                </div>

            </div>


            <div class="card-actions">

                <button
                    class="view-btn"
                    onclick="showCompleteResult(${student.id})"
                >
                    📄 View Result
                </button>


                <button
                    class="edit-btn"
                    onclick="findStudentForUpdate(${student.id})"
                >
                    ✏️ Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    🗑️ Delete
                </button>

            </div>

        </div>

    `;
}


// ======================================
// FIND STUDENT FOR UPDATE
// ======================================

async function findStudentForUpdate(
    selectedId = null
) {

    const input =
        document.getElementById(
            "updateStudentId"
        );


    const id =
        selectedId ||
        input.value.trim();


    if (!id) {

        alert(
            "Please enter a Student ID."
        );

        return;
    }


    try {

        const response =
            await fetch("/students");

        const students =
            await response.json();


        const student =
            students.find(
                s => s.id == id
            );


        if (!student) {

            document.getElementById(
                "updateForm"
            ).innerHTML =
                `<p class="error-text">
                    Student not found.
                </p>`;

            return;
        }


        document.getElementById(
            "updateStudentId"
        ).value = student.id;


        document.getElementById(
            "updateForm"
        ).innerHTML = `

            <div class="update-form">

                <h3>
                    Edit ${escapeHTML(student.name)}
                </h3>


                <div class="form-grid">

                    <div class="input-group">

                        <label>
                            Student Name
                        </label>

                        <input
                            type="text"
                            id="updateName"
                            value="${escapeAttribute(student.name)}"
                        >

                    </div>


                    <div class="input-group">

                        <label>
                            Roll Number
                        </label>

                        <input
                            type="text"
                            id="updateRoll"
                            value="${escapeAttribute(student.roll_no)}"
                        >

                    </div>

                </div>


                <div class="marks-grid">

                    ${createUpdateInput(
                        1,
                        student.subject1
                    )}

                    ${createUpdateInput(
                        2,
                        student.subject2
                    )}

                    ${createUpdateInput(
                        3,
                        student.subject3
                    )}

                    ${createUpdateInput(
                        4,
                        student.subject4
                    )}

                    ${createUpdateInput(
                        5,
                        student.subject5
                    )}

                </div>


                <button
                    class="primary-btn"
                    onclick="updateResult(${student.id})"
                >
                    💾 Update Result
                </button>

            </div>
        `;

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load student."
        );
    }
}


// ======================================
// UPDATE INPUT
// ======================================

function createUpdateInput(
    number,
    value
) {

    return `

        <div class="input-group">

            <label>
                Subject ${number}
            </label>

            <input
                type="number"
                id="updateSub${number}"
                value="${value}"
                min="0"
                max="100"
            >

        </div>

    `;
}


// ======================================
// UPDATE RESULT
// ======================================

async function updateResult(studentId) {

    const name =
        document.getElementById(
            "updateName"
        ).value.trim();


    const rollNo =
        document.getElementById(
            "updateRoll"
        ).value.trim();


    const marks = [];


    for (let i = 1; i <= 5; i++) {

        marks.push(
            Number(
                document.getElementById(
                    `updateSub${i}`
                ).value
            )
        );
    }


    if (!name || !rollNo) {

        alert(
            "Name and roll number are required."
        );

        return;
    }


    if (
        marks.some(
            mark =>
                isNaN(mark) ||
                mark < 0 ||
                mark > 100
        )
    ) {

        alert(
            "Marks must be between 0 and 100."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/students/${studentId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        roll_no: rollNo,

                        marks: marks

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Update failed."
            );

            return;
        }


        alert(
            "Result updated successfully!"
        );


        document.getElementById(
            "updateForm"
        ).innerHTML = "";


        document.getElementById(
            "updateStudentId"
        ).value = "";


        loadAllStudents();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to update result."
        );
    }
}


// ======================================
// DELETE STUDENT
// ======================================

async function deleteStudent(studentId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student? This cannot be undone."
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/students/${studentId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Unable to delete student."
            );

            return;
        }


        alert(
            "Student deleted successfully!"
        );


        loadAllStudents();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete student."
        );
    }
}


// ======================================
// CLASS STATISTICS
// ======================================

async function loadStatistics() {

    const results =
        document.getElementById(
            "statisticsResults"
        );


    results.innerHTML =
        `<p class="muted-text">
            Loading statistics...
        </p>`;


    try {

        const response =
            await fetch("/statistics");

        const stats =
            await response.json();


        if (!stats.total_students) {

            results.innerHTML = `

                <div class="empty-box">

                    <h3>
                        No student data
                    </h3>

                    <p>
                        Add student results first.
                    </p>

                </div>

            `;

            return;
        }


        const passPercentage =
            (
                stats.passed_students /
                stats.total_students *
                100
            ).toFixed(1);


        results.innerHTML = `

            <div class="statistics-grid">

                <div class="stat-card">
                    <span>👥</span>
                    <small>Total Students</small>
                    <strong>
                        ${stats.total_students}
                    </strong>
                </div>


                <div class="stat-card">
                    <span>📈</span>
                    <small>Class Average</small>
                    <strong>
                        ${stats.average_percentage}%
                    </strong>
                </div>


                <div class="stat-card">
                    <span>🏆</span>
                    <small>Highest</small>
                    <strong>
                        ${stats.highest_percentage}%
                    </strong>
                </div>


                <div class="stat-card">
                    <span>📉</span>
                    <small>Lowest</small>
                    <strong>
                        ${stats.lowest_percentage}%
                    </strong>
                </div>


                <div class="stat-card">
                    <span>✅</span>
                    <small>Passed</small>
                    <strong>
                        ${stats.passed_students}
                    </strong>
                </div>


                <div class="stat-card">
                    <span>❌</span>
                    <small>Failed</small>
                    <strong>
                        ${stats.failed_students}
                    </strong>
                </div>


                <div class="stat-card">
                    <span>🎯</span>
                    <small>Pass Percentage</small>
                    <strong>
                        ${passPercentage}%
                    </strong>
                </div>

            </div>


            <div class="grade-section">

                <h3>
                    Grade Distribution
                </h3>


                <div class="grade-grid">

                    <div>
                        <span>A+</span>
                        <strong>
                            ${stats.a_plus}
                        </strong>
                    </div>

                    <div>
                        <span>A</span>
                        <strong>
                            ${stats.a_grade}
                        </strong>
                    </div>

                    <div>
                        <span>B</span>
                        <strong>
                            ${stats.b_grade}
                        </strong>
                    </div>

                    <div>
                        <span>C</span>
                        <strong>
                            ${stats.c_grade}
                        </strong>
                    </div>

                    <div>
                        <span>D</span>
                        <strong>
                            ${stats.d_grade}
                        </strong>
                    </div>

                    <div>
                        <span>E</span>
                        <strong>
                            ${stats.e_grade}
                        </strong>
                    </div>

                    <div>
                        <span>F</span>
                        <strong>
                            ${stats.f_grade}
                        </strong>
                    </div>

                </div>

            </div>
        `;

    }

    catch (error) {

        console.error(error);

        results.innerHTML =
            `<p class="error-text">
                Unable to load statistics.
            </p>`;
    }
}


// ======================================
// VIEW COMPLETE RESULT
// ======================================

async function viewCompleteResult() {

    const id =
        document.getElementById(
            "resultStudentId"
        ).value.trim();


    if (!id) {

        alert(
            "Please enter Student ID."
        );

        return;
    }


    showCompleteResult(id);
}


// ======================================
// SHOW COMPLETE RESULT
// ======================================

async function showCompleteResult(studentId) {

    const box =
        document.getElementById(
            "completeResult"
        );


    box.innerHTML =
        `<p class="muted-text">
            Loading result...
        </p>`;


    try {

        const response =
            await fetch("/students");

        const students =
            await response.json();


        const student =
            students.find(
                s => s.id == studentId
            );


        if (!student) {

            box.innerHTML =
                `<p class="error-text">
                    Student not found.
                </p>`;

            return;
        }


        const resultClass =
            student.result === "PASS"
                ? "pass-result"
                : "fail-result";


        box.innerHTML = `

            <div class="complete-result">

                <div class="result-top">

                    <div>

                        <p class="small-title">
                            STUDENT RESULT
                        </p>

                        <h2>
                            ${escapeHTML(student.name)}
                        </h2>

                        <p>
                            Roll Number:
                            ${escapeHTML(student.roll_no)}
                        </p>

                        <p>
                            Student ID:
                            ${student.id}
                        </p>

                    </div>


                    <div class="large-grade">
                        ${student.grade}
                    </div>

                </div>


                <h3>
                    Subject Marks
                </h3>


                <div class="complete-subjects">

                    ${createSubjectResult(
                        1,
                        student.subject1
                    )}

                    ${createSubjectResult(
                        2,
                        student.subject2
                    )}

                    ${createSubjectResult(
                        3,
                        student.subject3
                    )}

                    ${createSubjectResult(
                        4,
                        student.subject4
                    )}

                    ${createSubjectResult(
                        5,
                        student.subject5
                    )}

                </div>


                <div class="result-summary">

                    <div>
                        <small>Total Marks</small>
                        <strong>
                            ${student.total}/500
                        </strong>
                    </div>


                    <div>
                        <small>Average</small>
                        <strong>
                            ${student.average}
                        </strong>
                    </div>


                    <div>
                        <small>Percentage</small>
                        <strong>
                            ${student.percentage}%
                        </strong>
                    </div>


                    <div>
                        <small>Grade</small>
                        <strong>
                            ${student.grade}
                        </strong>
                    </div>

                </div>


                <div class="
                    final-result
                    ${resultClass}
                ">
                    ${student.result}
                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(error);

        box.innerHTML =
            `<p class="error-text">
                Unable to load result.
            </p>`;
    }
}


// ======================================
// SUBJECT RESULT CARD
// ======================================

function createSubjectResult(
    number,
    marks
) {

    return `

        <div class="subject-result">

            <span>
                Subject ${number}
            </span>

            <strong>
                ${marks}
            </strong>

            <small>
                / 100
            </small>

        </div>

    `;
}


// ======================================
// MESSAGE
// ======================================

function showMessage(
    elementId,
    message,
    type
) {

    const element =
        document.getElementById(
            elementId
        );


    element.innerHTML = `

        <div class="message ${type}">
            ${message}
        </div>

    `;
}


// ======================================
// SECURITY HELPERS
// ======================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {

    return escapeHTML(value);
}