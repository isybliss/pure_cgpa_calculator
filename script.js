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
    dashboard.innerHTML = "";
    courseData.forEach(({ id, title, code, unit, grade }) => {
        dashboard.innerHTML += `
        <div class="task" id="${id}">
            <p><strong>Title:</strong>${title}</p>
            <p><strong>Date:</strong>${code}</p>
            <p><strong>Description:</strong>${unit}</p>
            <p><strong>Description:</strong>${grade}</p>
            <button onclick="editTask(this)" type="button" class="btn">Edit</button>
            <button onclick="deleteTask(this)" type="button" class="btn">Delete</button>
        </div>
        `
    });
    btnContainer.innerHTML = `
    <button class="btn blue-btn">Add course</button>
    <button class="btn">Edit course</button>
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

//open initial form
addCourseBtn.addEventListener("click", () => { 
    courseFormBox.showModal();
})

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