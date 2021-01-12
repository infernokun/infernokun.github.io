// elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const done = document.getElementById("done");
const add = document.getElementById("add");
const history = document.getElementById("history");
const historyForm = document.getElementById("historyForm");
const info = document.getElementById("info");

// variables
const CHECK = "img/check-mark.png";
const UNCHECK = "img/circle.png";
const LINE_THROUGH = "lineThrough";

// date handling
const options = { weekday: "long", month: "long", day: "numeric" };
const today = new Date();
const today_date = today.toLocaleDateString("en-US", options);
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

let LIST = [], id = 0, ALL_LIST = [];
let data = localStorage.getItem("TODO");

let current_list = 0;
let viewing_history = false;

// check if data exists
if (data) {
    ALL_LIST = JSON.parse(data);

    current_list = ALL_LIST.length-1;

    id = ALL_LIST[current_list].length;

    loadList(ALL_LIST);
} else {
    loadList(ALL_LIST);

    current_list = ALL_LIST.length-1;

    if (ALL_LIST[current_list] == undefined) {
        let LIST = []
        ALL_LIST.push(LIST);
    }
}

let newOption = new Option(today_date, current_list);
history.add(newOption, undefined);

// upon form submit for history change
function historyChange() {
    list.innerHTML = "";

    history_id = history.value;

    if (history_id == current_list) {
        viewing_history = false;
        loadListHistory(ALL_LIST, history_id);
    } else {
        viewing_history = true;
        loadListHistory(ALL_LIST, history_id);
    }
}

// loads existing data
function loadList(array) {
    f_date = "";

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j].date == today_date) {
                addToDo(array[i][j].name, array[i][j].id, array[i][j].done, array[i][j].trash);
            }
        }
        f_date = array[i][0].date;

        if (f_date != today_date) {
            let newOption = new Option(`${f_date}`, i);
            history.add(newOption, undefined);
        }
    }
}

// loads the history items to the view and creates option for select
function loadListHistory(array, history_id) {
    let found = false;

    Array.from(history.options).forEach(function (item) {
        if (item.value == current_list) {
            found = true;
        }
    });

    /*if (!found) {
        let newOption = new Option(`${today_date}`, current_list);
        history.add(newOption, undefined);
    }*/

    array[history_id].forEach(function (item) {
        addToDo(item.name, item.id, item.done, item.trash);
        dateElement.innerHTML = item.date;
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

    ALL_LIST[current_list][element.id].done = ALL_LIST[current_list][element.id].done ? false : true;

    if (ALL_LIST[current_list][element.id].done == false) {
        element.src = UNCHECK;
    } else {
        element.src = CHECK;
    }
}

// remove to-do from the list
function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);

    ALL_LIST[current_list][element.id].trash = true;
}

// press enter to add to list
document.addEventListener("keydown", function (event) {
    if (viewing_history == false) {
        if (event.keyCode == 13) {
            const toDo = input.value;

            if (toDo) {
                if (toDo.length >= 25) {
                    alert("Must be below 25 characters!");
                } else {
                    addToDo(toDo, id, false, false);

                    let current_date = [];

                    ALL_LIST[current_list].push({
                        name: toDo,
                        id: id,
                        done: false,
                        trash: false,
                        date: today_date
                    });

                    localStorage.setItem("TODO", JSON.stringify(ALL_LIST));
                    id++;

                    input.value = "";
                }
            }
        }
    }
});

// buttons for each to-do element
list.addEventListener("click", function (event) {
    if (viewing_history == false) {
        const element = event.target;
        const elementJob = element.attributes.job.value;

        if (elementJob == "complete") {
            completeToDo(element);
        } else if (elementJob == "delete") {
            removeToDo(element);
        }
        localStorage.setItem("TODO", JSON.stringify(ALL_LIST));
    }
});

// add button new element to list on button click
add.addEventListener("click", function (event) {
    if (viewing_history == false) {
        const toDo = input.value;

        if (toDo) {
            addToDo(toDo, id, false, false);

            let current_date = [];

            ALL_LIST[current_list].push({
                name: toDo,
                id: id,
                done: false,
                trash: false,
                date: today_date
            });


            localStorage.setItem("TODO", JSON.stringify(ALL_LIST));
            id++;

            input.value = "";
        }
    }

});

// clear button
clear.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
})