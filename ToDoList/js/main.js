// elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const done = document.getElementById("done");
const add = document.getElementById("add");

// variables
const CHECK = "img/check-mark.png";
const UNCHECK = "img/circle.png";
const LINE_THROUGH = "lineThrough";

// date handling
const options = {weekday:"long", month:"long", day:"numeric"};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

let LIST = [], id = 0;
let data = localStorage.getItem("TODO");

// check if data exists
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
}

// loads existing data
function loadList(array) {
    array.forEach(function(item) {
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

// adds to to-do list
function addToDo(toDo, id, done, trash) {

    if (trash) { return; }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="item">
                    <img class="done" src="${DONE}" job="complete" id="${id}">
                    <p class="text ${LINE}">${toDo}</p>
                    <img class="delete" src="img/trash.png" job="delete" id="${id}"> 
                </li>`;

    const pos = "beforeend";

    list.insertAdjacentHTML(pos, item);
}

// toggles to-do complete / not complete
function completeToDo(element) {
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;

    if (LIST[element.id].done == false) {
        element.src = UNCHECK;
    } else {
        element.src = CHECK;
    }
}

// remove to-do from the list
function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

// press enter to add to list
document.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
        const toDo = input.value;

        if (toDo) {
            addToDo(toDo, id, false, false);

            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false
            });

            localStorage.setItem("TODO", JSON.stringify(LIST));
            
            id++;
            input.value = "";
        }
    }
});

// buttons for each to-do element
list.addEventListener("click", function(event) {
    const element = event.target;
    const elementJob = element.attributes.job.value;

    if (elementJob == "complete") {
        completeToDo(element);
    } else if (elementJob == "delete") {
        removeToDo(element);
    }

    localStorage.setItem("TODO", JSON.stringify(LIST));
});

// add button new element to list on button click
add.addEventListener("click", function(event) {
    const toDo = input.value;
    
    if (toDo) {
        addToDo(toDo, id, false, false);

        LIST.push({
            name : toDo,
            id : id,
            done : false,
            trash : false
        });

        localStorage.setItem("TODO", JSON.stringify(LIST));
        id++;
        input.value = "";
    }
});

// clear button
clear.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
})