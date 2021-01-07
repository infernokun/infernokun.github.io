const notes = document.getElementById("notes");
const text = document.getElementById("text");
const clear = document.querySelector(".clear");
const add = document.getElementById("add_note");
const title = document.getElementById("title");
const remove = document.querySelector(".delete");
const test = document.querySelector(".test");

let LIST = [], id = 0;
let data = localStorage.getItem("NOTES");

//localStorage.removeItem("NOTES");
//location.reload();

// note class
class Note {
    constructor(id, title, note) {
        this.id = id;
        this.title = title;
        this.note = note;
    }
}

// check for existing data
if (data) {
    LIST = JSON.parse(data);
    loadNotes(LIST);
    id = LIST.length;
}

// load function for existing data
function loadNotes(array) {
    array.forEach(function (item) {
        if (item) {
            addNote(item.title, item.note);
        }
    });
}

// parse the long data
function parseText(txt) {
    if (txt.length > 150) {
        txt = txt.slice(0, 150) + "...";
    }
    return txt;
}

// adds a note to the view
function addNote(note_title, note_text) {
    note_text = parseText(note_text);

    if (note_text == "") return
    if (note_title == "" || note_title.length > 25) return

    let new_note = new Note(id, note_title, note_text);

    let note = `<li class="note">
                        <h3>${new_note.title}</h3> 
                        <p class="text">${new_note.note}</p>
                        <p class="detail" job="detail" id="${new_note.id}">View Detail</p>
                        <p class="delete" job="delete" id="${new_note.id}">Delete</p>
                    </li>`;

    let count = id + 1;

    if (count % 2 == 0) {
        note = `${note}<br>`;
    }

    notes.insertAdjacentHTML("beforeend", note);

    text.value = "";
    title.value = ""
    ++id;
    
    return new_note;
}

// clear button functionality
clear.addEventListener("click", function (event) {
    localStorage.removeItem("NOTES");
    location.reload();
});

// add button functionality
add.addEventListener("click", function (event) {
    note_val = text.value;
    note_title = title.value;

    if (note_val) {
        new_note = addNote(note_title, note_val);

        let added = false;
        let count = 0;

        LIST.push(new_note);

        localStorage.setItem("NOTES", JSON.stringify(LIST));

        text.value = "";
        title.value = "";
    }
});

// delete and detail button functionality
notes.addEventListener("click", function (event) {
    const element = event.target;
    const elementID = element.attributes.id.value;
    const elementJob = element.attributes.job.value;

    if (elementJob == "delete") {
        element.parentNode.parentNode.removeChild(element.parentNode);

        LIST[elementID] = "";

        localStorage.setItem("NOTES", JSON.stringify(LIST));
    } else if (elementJob == "detail") {
        alert(elementID);
    }
});

/*test.addEventListener("click", function(event) {
    LIST.forEach(function(item) {
        if (item) {console.log(item.id + ": " + item.title);}
    });
});*/