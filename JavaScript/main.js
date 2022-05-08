// get elements we need
let myForm = document.getElementsByTagName("form")[0];
let input = document.getElementById("only");
let submit = document.getElementById("btn");
let resDiv = document.getElementsByClassName("tasks")[0];
// small function to generate unique Id
function ID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
// check if there is tasks in local storage if so we will create all tasks and add them to page
// from local storage
if (window.localStorage.tasks) {
  let tasksArray = JSON.parse(window.localStorage.tasks); // get array from local storage
  tasksArray.forEach(({ id, title, completed }) => {
    // loop trough that array and create tasks from it
    // we will use id and title and check completed stored in the array
    let myDiv = document.createElement("div");
    let text = document.createTextNode(title);
    let del = document.createElement("button");
    let delText = document.createTextNode("Delete");
    del.append(delText);
    del.className = "del";
    myDiv.id = id;
    myDiv.className = "myDiv";
    myDiv.append(text, del);
    // check if completed of the current element is true if so add a classe done to myDiv
    if (completed) {
      myDiv.className = "myDiv done";
    }
    resDiv.append(myDiv); // append myDiv to the div already in page
    del.onclick = function () {
      // delete button to delete task from page and local storage
      let push = JSON.parse(window.localStorage.getItem("tasks")) || []; // get array stored in local storage
      myDiv.remove(); // remove the task from page
      let newPush = push.filter(
        // loop trough the array and filter it , if the id of the current elem === to the id of the target i clicked
        // that elem wont be returned to the new array
        (task) => task.id !== del.parentElement.id
      );
      window.localStorage.setItem("tasks", JSON.stringify(newPush)); //push the new array to local storage using Json.stingify
      if (resDiv.innerHTML === "") {
        // check if the main div inner html is empty if so delete the Delete All Tasks Button
        resDiv.nextSibling.remove();
      }
    };
  });

  deleteAllBtn(); // add delete all tasks button
}

myForm.onsubmit = function (e) {
  e.preventDefault(); // stop the sunmit button from submitting the form and stop the page reload
  if (input.value !== "") {
    let id = ID(); // the id generated from the above funvtion
    let title = input.value; // the value of the input field
    let completed = false; // default value
    let tasks = mainFunction(id, title, completed); // call the main function

    input.value = ""; // clear input field
  }
};

function mainFunction(id, title, completed) {
  let push = JSON.parse(window.localStorage.getItem("tasks")) || []; // check if there is tasks in storage
  //if so get the array and put it in the variable if not put an empty array
  push.push({ id: id, title: title, completed: completed }); // add tasks to the array
  window.localStorage.setItem("tasks", JSON.stringify(push)); // push array to local storage
  resDiv.innerHTML = ""; // clear main div inner html cuz the previous value will be created again from the array in local storage
  for (let i = 0; i < push.length; i++) {
    // loop trough that array and create tasks
    let myDiv = document.createElement("div");
    let text = document.createTextNode(push[i].title);
    let del = document.createElement("button");
    let delText = document.createTextNode("Delete");
    del.append(delText);
    del.className = "del";
    myDiv.id = push[i].id;
    myDiv.className = "myDiv";
    myDiv.append(text, del);
    if (push[i].completed) {
      myDiv.className = "myDiv done";
    }
    resDiv.append(myDiv); // add them to page
    del.onclick = function (e) {
      // same as above
      let push = JSON.parse(window.localStorage.getItem("tasks")) || [];
      myDiv.remove();
      let newPush = push.filter((task) => task.id !== del.parentElement.id);
      window.localStorage.setItem("tasks", JSON.stringify(newPush));
      if (resDiv.innerHTML === "") {
        resDiv.nextSibling.remove();
      }
    };
  }
  deleteAllBtn();
}
resDiv.addEventListener("click", (e) => {
  // add event listner to main div
  if (e.target.classList.contains("myDiv")) {
    // check if the clicked target have class myDiv
    //if so get array from local storage loop trough it check the ids if they are identical
    //if so check the current elem.completed if its false turn it true and vice versa then push to local storage
    let push = JSON.parse(window.localStorage.getItem("tasks")) || [];
    for (let i = 0; i < push.length; i++) {
      if (e.target.id === push[i].id) {
        push[i].completed === false
          ? (push[i].completed = true)
          : (push[i].completed = false);
      }
      window.localStorage.setItem("tasks", JSON.stringify(push));
    }
    e.target.classList.toggle("done"); // when clicked add class done reclicked remove it
  }
});

document.addEventListener("click", function (e) {
  //add event listner to the document
  if (e.target.className === "clear") {
    //check if the target have class clear
    //if so it will remove the tasks from local storage and delete them all from page and delete itself
    window.localStorage.removeItem("tasks");
    resDiv.innerHTML = "";
    e.target.remove();
  }
});
function deleteAllBtn() {
  //function to create delete all btn
  if (resDiv.nextSibling.className !== "clear") {
    // check if the next sibling of main div does not have class clear
    //so the btn will be created only one time
    let delAll = document.createElement("button");
    delAll.className = "clear";
    delAll.innerText = "Delete All Tasks";
    resDiv.after(delAll);
  }
}
