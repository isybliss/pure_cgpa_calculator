//Date
const currentDateParagraph = document.getElementById('current-date');

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();

const formattedDate = `${day}/${month}/${year}`;
currentDateParagraph.textContent = formattedDate;

//courseForm
const openFormBox = document.getElementById("open-form");
const openFormBtn = document.getElementById("open-form-btn");
const closeFormBtn = document.getElementById("close-form-btn");
const courseFormBox = document.getElementById("course-form-container");
const courseForm = document.getElementById("course-form");
const errorMessage1 = document.getElementById("errorMessage1");
const errorMessage2 = document.getElementById("errorMessage2");
const addUpdateBtn = document.getElementById("add-or-update-course-btn");

//Inputs
const sessionYear = document.getElementById("session-year");
const courseTitle = document.getElementById("course-title");
const courseCode = document.getElementById("course-code");
const courseUnit = document.getElementById("course-unit");
const courseGrade = document.getElementById("course-grade");


const dashboard = document.getElementById("course-dashboard");
const addBtn = document.getElementById("add-course-btn");
const courseTable = document.getElementById("course-table");
const gp = document.getElementById("gp");
const cgp = document.getElementById("cgp");



//array of each session's object
const entireData = JSON.parse(localStorage.getItem("data")) || [];
let currentSessionDetails = {}; //object of session and its courses
let currentSessionCourses = [];
let currentCourse = {};

//return remark based on grade
const remarkGrade = (str) => {
    if (str === "A") {
        return "Excellent";
    } else if (str === "B") {
        return "Very Good";
    } else if (str === "C") {
        return "Good";
    } else if (str === "D") {
        return "Pass";
    } else if (str === "E") {
        return "Pass";
    } else {
        return "Fail"
    }
}

const gradeNum = (str) => {
    if (str === "A") {
        return 5;
    } else if (str === "B") {
        return 4;
    } else if (str === "C") {
        return  3;
    } else if (str === "D") {
        return 2;
    } else if (str === "E") {
        return 1;
    } else {
        return 0;
    }
}

//remove special characters and leave spaces
const removeSpecialChars = (str) => {
    const regex = /[^a-z\s]/gi;
    return str.replace(regex, "");
}

const calcCgp = () => {
    if (entireData.length === 4) {
        const firstYear = entireData[0].gp * 0.1;
        const secondYear = entireData[1].gp * 0.2;
        const thirdYear = entireData[2].gp * 0.3;
        const fourthYear = entireData[3].gp * 0.4;
        const totalCGP = parseFloat(firstYear + secondYear + thirdYear + fourthYear).toFixed(3);
        return totalCGP;

    } else if (entireData.length === 5) {
        const firstYear = entireData[0].gp * 0.05;
        const secondYear = entireData[1].gp * 0.10;
        const thirdYear = entireData[2].gp * 0.15;
        const fourthYear = entireData[3].gp * 0.30;
        const fifthYear = entireData[4].gp * 0.40;
        const totalCGP = parseFloat(firstYear + secondYear + thirdYear + fourthYear + fifthYear).toFixed(3);
        return totalCGP;

    } else {
        return "";
    }
}

const calcGp = (str) => {
    const sessionIndex = entireData.findIndex((item) => item.session === str);
    currentSessionDetails = entireData[sessionIndex];
    /**
     * to use filter()
     * currentSessionDetails = entireData.filter((item) => item.session === str)
     */
    currentSessionCourses = currentSessionDetails.sessionCourseData;
    let totalUnit = 0;
    let totalGradeUnit = 0;
    currentSessionCourses.forEach(({ unit, grade }) => {
        const gradeNumber = gradeNum(grade);
        const gradeUnit = gradeNumber * unit;
        totalUnit += Number(unit);
        totalGradeUnit += gradeUnit;
    })
    
    const gp = parseFloat((totalGradeUnit / totalUnit).toFixed(3));
    currentSessionDetails.gp = gp;
    return gp;
}

/**
 * check if session exist
 * if it exist: 
 * check if course exist: add new course or update/edit existing course
 * if session doesn't exist: 
 *  add the new sessionValue and  new course details to the newSessionDetails objects.
*/
const addOrUpdateCourseDetails = () => {
    //if space is inputed instead of letters ie does not return a value after the spaces are trimmed out
    if (!courseTitle.value.trim()) {
        //alert("Input valid course title");
        errorMessage1.style.display = "block";
        return;
    } else {
        errorMessage1.style.display = "none";
    }
    
    //Valdate courseCode
    const regex = /^[a-zA-Z]{3}[0-9]{3}$/;
    if (!regex.test(courseCode.value.trim())) {
        errorMessage2.style.display = "block";
        return;   
    } else {
        errorMessage2.style.display = "none";
    }
    
    const sessionValue = sessionYear.value;
    
    //check if session exist
    const sessionIndex = entireData.findIndex((item) => item.session === sessionValue);
    if (sessionIndex !== -1) {
        currentSessionDetails = entireData[sessionIndex];
        currentSessionDetails.session = sessionValue;
        currentSessionCourses = currentSessionDetails.sessionCourseData;

        //does course exist in that session?
        const courseIndex = currentSessionCourses.findIndex(item => item.id === currentCourse.id);
        const courseDetails = {
            id: `${removeSpecialChars(courseTitle.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
            title: removeSpecialChars(courseTitle.value[0].toUpperCase() + courseTitle.value.substring(1)),
            code: courseCode.value.toUpperCase(),
            unit: courseUnit.value,
            grade: courseGrade.value,
            remark : remarkGrade(courseGrade.value)
        };

        //add course
        if (courseIndex === -1) {
            currentSessionCourses.unshift(courseDetails);
        } else {
            //update course
            currentSessionCourses[courseIndex] = courseDetails;   
        }
        currentSessionDetails.sessionCourseData = currentSessionCourses;
    } else{
        //if session doesn't exist
        const newSessionDetails = {};
        newSessionDetails.session = sessionValue;
        const newSessionCourseData = [];
        const courseDetails = {
            id: `${removeSpecialChars(courseTitle.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
            title: removeSpecialChars(courseTitle.value[0].toUpperCase() + courseTitle.value.substring(1)),
            code: courseCode.value.toUpperCase(),
            unit: courseUnit.value,
            grade: courseGrade.value,
            remark : remarkGrade(courseGrade.value),
        };
        newSessionCourseData.push(courseDetails);
        newSessionDetails.sessionCourseData = newSessionCourseData;
        entireData.push(newSessionDetails);
    }
    localStorage.setItem('data', JSON.stringify(entireData));
    updateDashboard(sessionValue);
    reset();
};

//display on the dashboard
const updateDashboard = (str) => {
    dashboard.classList.remove("hidden");
    const sessionIndex = entireData.findIndex((item) => item.session === str);
    currentSessionDetails = entireData[sessionIndex];
    /**
     * to use filter() / find()
     * currentSessionDetails = entireData.filter/find((item) => item.session === str)
     */
    currentSessionCourses = currentSessionDetails.sessionCourseData;
    let courseIndex = 0;
        
    courseTable.innerHTML = "";
    currentSessionCourses.forEach(({ id, title, code, unit, grade, remark }) => {
        courseIndex += 1;
        courseTable.innerHTML += `
        <tr id="${id}">
            <td>${courseIndex}</td>
            <td>${code}</td>
            <td>${title}</td>
            <td>${unit}</td>
            <td>${grade}</td>
            <td>${remark}</td>
            <td class="edit-delete">
                <button onclick="editCourse(this)" class="btn small-btn">Edit</button>
                <button onclick="deleteCourse(this)" class="close-course-form-btn" type="button" aria-label="close">
                    <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#F44336" d="M21.5 4.5H26.501V43.5H21.5z" transform="rotate(45.001 24 24)" /><path fill="#F44336" d="M21.5 4.5H26.5V43.501H21.5z" transform="rotate(135.008 24 24)" /></svg>
                </button>
            </td>
        </tr>
        `;
    });
    gp.innerHTML = `${calcGp(sessionYear.value)}`,
    cgp.innerHTML = `${calcCgp()}`,
    addBtn.innerHTML = `
    <button class="btn blue-btn" onclick="openCourseForm()">Add course</button>
    `
};

//Tidy up the form
const reset = () => {
    courseTitle.value = "";
    courseCode.value = "" ;
    courseUnit.value = "";
    courseGrade.value = "";
    addUpdateBtn.innerText = "Add Course";
    courseFormBox.close();
    currentSessionCourses = [];
    currentSessionDetails = {};
    currentCourse = {};    
};

//to delete course
const deleteCourse = (buttonEl) => {
    const sessionValue = sessionYear.value;
    const sessionIndex = entireData.findIndex((item) => item.session === sessionValue);
    currentSessionDetails = entireData[sessionIndex];
    currentSessionCourses = currentSessionDetails.sessionCourseData;

    const courseIndex = currentSessionCourses.findIndex((item) => item.id === buttonEl.parentElement.parentElement.id);
    buttonEl.parentElement.parentElement.remove();
    currentSessionCourses.splice(courseIndex, 1);

    updateDashboard(sessionValue);
    if (currentSessionCourses.length === 0) {
        entireData.splice(sessionIndex, 1);
        addBtn.innerHTML = "";
        dashboard.classList.add("hidden");
        openFormBox.classList.remove("hidden");
    }

    localStorage.setItem('data', JSON.stringify(entireData));  
};

//Edit a course details
const editCourse = (buttonEl) => {
    const sessionValue = sessionYear.value;
    const sessionIndex = entireData.findIndex((item) => item.session === sessionValue);
    currentSessionDetails = entireData[sessionIndex];
    currentSessionCourses = currentSessionDetails.sessionCourseData;

    const courseIndex = currentSessionCourses.findIndex((item) => item.id === buttonEl.parentElement.parentElement.id);
    currentCourse = currentSessionCourses[courseIndex];
    
    courseTitle.value = currentCourse.title;
    courseCode.value = currentCourse.code;
    courseUnit.value = currentCourse.unit;
    courseGrade.value = currentCourse.grade;

    addUpdateBtn.innerText = "Update Course";
    courseFormBox.showModal();
};

const openCourseForm = () => {
    openFormBox.classList.add("hidden");
    courseFormBox.showModal();
}

const submitCourseForm = (e) => {
    e.preventDefault();
    addOrUpdateCourseDetails();
}

openFormBtn.addEventListener("click", openCourseForm)

closeFormBtn.addEventListener("click", () => {
    const sessionValue = sessionYear.value;
    const sessionIndex = entireData.findIndex((item) => item.session === sessionValue);
    //if session doesn't exist
    if (sessionIndex === -1) {
        reset();
        openFormBox.classList.remove("hidden");
    } else{
       reset();
    }
})

courseForm.addEventListener("submit", submitCourseForm)

//Change session value
sessionYear.addEventListener('change', () => {
    const sessionValue = sessionYear.value;
    //console.log(entireData);
    const sessionIndex = entireData.findIndex((item) => item.session === sessionValue);
    //if session doesnt exist
    if (sessionIndex === -1) {
        gp.innerHTML = "";
        cgp.innerHTML = "";
        addBtn.innerHTML = ""
        dashboard.classList.add("hidden");
        openFormBox.classList.remove("hidden");
    } else{
        openFormBox.classList.add("hidden");
        updateDashboard(sessionValue);
        dashboard.classList.remove("hidden");
    }
});

//NOTES
/**
 * click on a session;
 * check if the session clicked on exist already with course details or not
 * if it exist, show the course details in the dashboard
 * if it doesn't exist, add to the dashboard
 * 
 * entire data = [
 *  {
      session: sessionyear.value,
        courseData: [
            {
                id: 1,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            },
            {
                id: 2,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            },...
            {
                id: n,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            }
        ]
    },

    {
      session: sessionyear.value,
        courseData: [
            {
                id: 1,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            },
            {
                id: 2,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            },...
            {
                id: n,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            }
        ]
    }...
    {
      session: sessionyear.value,
        courseData: [
            {
                id: 1,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            },
            {
                id: 2,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            },...
            {
                id: n,
                title: math,
                code: mth111,
                unit: 10,
                grade: A,
                remark: good
            }
        ]
    }
 ]
 */