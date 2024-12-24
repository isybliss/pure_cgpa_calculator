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



//array of each session's object
const entireData = JSON.parse(localStorage.getItem("data")) || [];
let currentSessionDetails = {}; //object of session clicked on and its course datas

let currentCourse = {}; //object of course to be edited with its properties: id, title etc

//remove special characters and leave spaces
const removeSpecialChars = (str) => {
    const regex = /[^a-z0-9\s]/gi;
    return str.replace(regex, "");
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
        alert("Input valid details");
        return;
    }

    const sessionValue = sessionYear.value;
    
    //check if session exist
    const sessionIndex = entireData.findIndex((item) => item.session === sessionValue);
    
    if (sessionIndex !== -1) {
        currentSessionDetails = entireData[sessionIndex];
        currentSessionDetails.session = sessionValue; //sessionArray[sessionArrayIndex];
        const currentSessionCourseData = currentSessionDetails.sessionCourseData; //courses per session array
        const courseDataArrIndex = currentSessionCourseData.findIndex(item => item.id === currentCourse.id);
        const courseDetails = {
            id: `${removeSpecialChars(courseTitle.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
            title: removeSpecialChars(courseTitle.value),
            code: removeSpecialChars(courseCode.value),
            unit: courseUnit.value,
            grade: courseGrade.value, 
        };
        //add or edit course
        if (courseDataArrIndex === -1) {
            //add course
            currentSessionCourseData.unshift(courseDetails);
        } else {
            //update existing/edited course
            currentSessionCourseData[courseDataArrIndex] = courseDetails;
        }
        currentSessionDetails.sessionCourseData = currentSessionCourseData;
    } else{

        //if session doesn't exist
        const newSessionDetails = {};
        newSessionDetails.session = sessionValue;
        const newSessionCourseData = [];
        const courseDetails = {
            id: `${removeSpecialChars(courseTitle.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
            title: removeSpecialChars(courseTitle.value),
            code: removeSpecialChars(courseCode.value),
            unit: courseUnit.value,
            grade: courseGrade.value, 
        };
        newSessionCourseData.push(courseDetails);
        newSessionDetails.sessionCourseData = newSessionCourseData;
        entireData.unshift(newSessionDetails);
    }
    localStorage.setItem('data', JSON.stringify(entireData));
    console.log(entireData);
    updateDashboard(sessionValue);
    reset();
};

//display on the dashboard
const updateDashboard = (str) => {
    dashboard.classList.remove("hidden");
    const sessionIndex = entireData.findIndex((item) => item.session === str);
    currentSessionDetails = entireData[sessionIndex];
    const display = currentSessionDetails.sessionCourseData;
    let courseIndex = 0;
        
    courseTable.innerHTML = "";
    display.forEach(({ id, title, code, unit, grade }) => {
        courseIndex += 1;
        courseTable.innerHTML += `
        <tr>
            <td>${courseIndex}</td>
            <td>${code}</td>
            <td>${title}</td>
            <td>${unit}</td>
            <td>${grade}</td>
            <td>${grade}</td>
            <td class="edit-delete">
                <button class="btn small-btn">Edit</button>
                <button onclick="deleteTask(this)" class="close-course-form-btn" type="button" aria-label="close">
                    <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#F44336" d="M21.5 4.5H26.501V43.5H21.5z" transform="rotate(45.001 24 24)" /><path fill="#F44336" d="M21.5 4.5H26.5V43.501H21.5z" transform="rotate(135.008 24 24)" /></svg>
                </button>
            </td>
        </tr>
        `;
    });
    
    addBtn.innerHTML = `
    <button class="btn blue-btn" onclick="addCourse()">Add course</button>
    `
};

//Tidy up the form
const reset = () => {
    courseTitle.value = "";
    courseCode.value = "" ;
    courseUnit.value = "";
    courseGrade.value = "";
    courseFormBox.close();
    openFormBox.classList.add("hidden");
    currentTask = {};
    sessionYear.value = ""
};
/*
//to delete task
const deleteTask = (buttonEl) => {
    const sessionIndex = entireData.findIndex((item) => item.session === sessionValue);
    const dataArrIndex = courseData.findIndex((item) => item.id === buttonEl.parentElement.id);
    buttonEl.parentElement.parentElement.remove();
    courseData.splice(dataArrIndex, 1);
    localStorage.setItem('data', JSON.stringify(entireData));
    updateDashboard();
};
*/
/*
const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(item => item.id === buttonEl.parentElement.id);

    currentTask = taskData[dataArrIndex];

    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    descriptionInput.value = currentTask.description;

    addOrUpdateTaskBtn.innerText = "Update Task";
    taskForm.classList.toggle("hidden");
};
*/

//input course details to form
const addCourse = () => {
    openFormBox.classList.add("hidden");
    //console.log(entireData);
    courseFormBox.showModal();
}

const submitForm = (e) => {
    e.preventDefault();
    //add or Edit the course details
    addOrUpdateCourseDetails();
}

//input initial course detail to form
openFormBtn.addEventListener("click", addCourse)

//close form
closeFormBtn.addEventListener("click", reset)

//submit form to add to/update the dashboard
courseForm.addEventListener("submit", submitForm)

sessionYear.addEventListener('change', () => {
    const sessionValue = sessionYear.value;
    const dataArrIndex = entireData.findIndex((item) => item.session === sessionValue);
    console.log(entireData);
    console.log(dataArrIndex);
    if (dataArrIndex === -1) {
        dashboard.classList.add("hidden");
        openFormBox.classList.remove("hidden");
    } else{
        console.log('Dashboard exist');
        openFormBox.classList.add("hidden");
        //updateDashboard(sessionYear.value);
        dashboard.classList.remove("hidden");
        addBtn.innerHTML = `
        <button class="btn blue-btn" onclick="addCourse()">Add course</button>
        `
    }

});
/*
const id = () => {
    switch (sessionYear.value) {
        case '2024/2025':
            return 1;
        case '2023/2024':
            return 2;
        case '2022/2023':
            return 3;
        case '2021/2022':
            return 4;
        case '2020/2021':
            return 5;
        case '2019/2020':
            return 6;
        case '2018/2019':
            return 7;
        case '2017/2018':
            return 8;
        default:
            return 9;
    }
}

//check if the session dashboard exist
const checkDashboard = () => {
    const dataArrIndex = entireData.findIndex((item) => item.session === sessionYear.value );
    if (dataArrIndex === -1) {
        dashboard.classList.add("hidden");
        openFormBox.classList.remove("hidden");
    } else{
        openFormBox.classList.add("hidden");
        //updateDashboard(sessionYear.value);
        dashboard.classList.remove("hidden");
        addBtn.innerHTML = `
        <button class="btn blue-btn" onclick="addCourse()">Add course</button>
        `
    }
}
*/
    
    


//localStorage.clear();

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