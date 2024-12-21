const addCourseBtn = document.getElementById("open-form-btn");
const addCourseBox = document.getElementById("add-course-container");
const courseFormBox = document.getElementById("course-form-container");
const courseForm = document.getElementById("course-form");
const closeFormButton = document.getElementById("close-course-form-btn");
const courseTitle = document.getElementById("course-title");
const courseCode = document.getElementById("course-code");
const courseUnit = document.getElementById("course-unit");
const courseGrade = document.getElementById("course-grade");
const dashboard = document.getElementById("course-dashboard");
const btnContainer = document.getElementById("button-container");
const courseTable = document.getElementById("course-table");

const courseData = JSON.parse(localStorage.getItem("data")) || [];

const currentCourse = {};

//remove special characters and leave spaces
const removeSpecialChars = (str) => {
    const regex = /[^a-z0-9\s]/gi;
    return str.replace(regex, "");
}

/*
* determine if task exist or not
* add to taskData array if task doesnt exist
* update if task exist
*/
const addOrUpdateCourseDetails = () => {
    //if space is inputed instead of letters ie does not return a value after the spaces are trimmed out
    if (!courseTitle.value.trim()) {
        alert("Input valid details");
        return;
    }

   const dataArrIndex = courseData.findIndex(item => item.id === currentCourse.id);
   //returns -1 if no element exist, returns the index of the element if it exist
   const courseDetails = {
    id: `${removeSpecialChars(courseTitle.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: removeSpecialChars(courseTitle.value),
    code: removeSpecialChars(courseCode.value),
    unit: courseUnit.value,
    grade: courseGrade.value, 
   };

   if (dataArrIndex === -1) {
        courseData.unshift(courseDetails);   //add course to to beginning of the task array if task doesn't exist
   } else {
        courseData[dataArrIndex] = courseDetails;
   }
   localStorage.setItem('data', JSON.stringify(courseData));
   updateDashboard();
   reset();
};

//display on the dashboard
const updateDashboard = () => {
    dashboard.classList.remove("hidden");
    courseTable.innerHTML = "";
    courseData.forEach(({ id, title, code, unit, grade }) => {
        const dataArrIndex = courseData.findIndex(item => item.id === id) + 1;
        courseTable.innerHTML += `
        <tr>
            <td>${dataArrIndex}</td>
            <td>${code}</td>
            <td>${title}</td>
            <td>${unit}</td>
            <td>${grade}</td>
            <td class="edit-delete">
                <button class="btn">Edit course</button>
                <button onclick="deleteTask(this)" class="close-course-form-btn" type="button" aria-label="close">
                    <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#F44336" d="M21.5 4.5H26.501V43.5H21.5z" transform="rotate(45.001 24 24)" /><path fill="#F44336" d="M21.5 4.5H26.5V43.501H21.5z" transform="rotate(135.008 24 24)" /></svg>
                </button>
            </td>
        </tr>
        `
    });
    btnContainer.innerHTML = `
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
    addCourseBox.classList.add("hidden");
    currentTask = {};
};

//to delete task
const deleteTask = (buttonEl) => {
    const dataArrIndex = courseData.findIndex((item) => item.id === buttonEl.parentElement.id);
    buttonEl.parentElement.parentElement.remove();
    courseData.splice(dataArrIndex, 1);
    localStorage.setItem('data', JSON.stringify(courseData));
    updateDashboard();
};
const addCourse = () => { 
    courseFormBox.showModal();
}

//open initial form
addCourseBtn.addEventListener("click", addCourse)

//close form with buttin
closeFormButton.addEventListener("click", () => {
    reset();
})

//submit form to add to/update the dashboard
courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //add or Edit the course details
    addOrUpdateCourseDetails();
})