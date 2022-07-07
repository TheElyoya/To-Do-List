let myForm = document.querySelector("form");
let myInput = document.getElementById("only");
let resDiv = document.querySelector(".tasks");
let clear = document.querySelector(".clear");
//check if todo exesit in localstorage if so add to page from it
window.onload = function () {
  if (localStorage.todo && localStorage.todo.length > 0) {
    addTaskToPage();
  }
};
//function to generate unique id
let id = () => {
  return Math.random().toString(36).slice(2, 10);
};

// on submit executes functions
myForm.onsubmit = function (e) {
  e.preventDefault();
  addToLocalStorage(myInput.value, id());
  addTaskToPage();

  myInput.value = "";
};

//function to add tasks to local storage
let addToLocalStorage = (task, id) => {
  let tasks = { id, task };
  let arrayOfTasks;
  window.localStorage.todo
    ? (arrayOfTasks = JSON.parse(window.localStorage.todo))
    : (arrayOfTasks = []);
  arrayOfTasks.push(tasks);
  window.localStorage.todo = JSON.stringify(arrayOfTasks);
};

//function to add tasks to page
let addTaskToPage = () => {
  resDiv.innerHTML = "";
  let myTasks = JSON.parse(localStorage.todo);
  myTasks.forEach((element) => {
    let bigDiv = document.createElement("div");
    bigDiv.innerText = element.task;
    let smallDiv = document.createElement("div");
    smallDiv.innerText = "Delete";
    smallDiv.className = "del";
    bigDiv.dataset.id = element.id;
    bigDiv.className = "myDiv";
    bigDiv.append(smallDiv);
    resDiv.append(bigDiv);
    clear.style.visibility = "visible";
  });
};
//eventlistner to delete tasks from page and localstorage

document.body.addEventListener("click", function (e) {
  if (e.target.className === "del") {
    let oldTasks = JSON.parse(localStorage.todo) || [];
    let newTasks = oldTasks.filter(
      (ele) => ele.id !== e.target.parentElement.dataset.id
    );
    localStorage.todo = JSON.stringify(newTasks);
    e.target.parentElement.remove();
  }
  if (resDiv.childNodes.length === 0) {
    clear.style.visibility = "hidden";
  }
});

//button to clear all tasks
clear.onclick = function () {
  resDiv.innerHTML = "";
  localStorage.removeItem("todo");
  if (resDiv.childNodes.length === 0) {
    clear.style.visibility = "hidden";
  }
};