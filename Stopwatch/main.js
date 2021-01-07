var sec = 00;
var tens = 00;
var min = 00;
var Interval;

let lapcount = 0;
let started = false;

const appendTens = document.getElementById('tens');
const appendSec = document.getElementById('sec');
const appendMin = document.getElementById('min');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const lap = document.getElementById('lap');
const laplist = document.getElementById('laplist');

// start button functionality
start.addEventListener('click', function (event) {
    clearInterval(Interval);
    Interval = setInterval(startTimer, 10);

    started = true;
});

// stop button functionality
stop.addEventListener('click', function (event) {
    clearInterval(Interval);
    started = false;
});

// reset button funtionality
reset.addEventListener('click', function (event) {
    clearInterval(Interval);
    tens = "00";
    sec = "00";
    min = "00";
    appendTens.innerHTML = tens;
    appendMin.innerHTML = min;

    laplist.innerHTML = "";
    lapcount = 0;

    started = false;
});

// lap button functionality
lap.addEventListener('click', function (event) {
    if (started) {
        lapcount++;
        const lapitem = `<li>Lap ${lapcount}:  ${appendMin.innerHTML}:${appendSec.innerHTML}:${appendTens.innerHTML}</li>`;

        laplist.insertAdjacentHTML("beforeend", lapitem);
    }
});

function startTimer() {
    tens++;

    // when the miliseconds are greater than 9 for double digits
    if (tens < 9) {
        appendTens.innerHTML = "0" + tens;
    }

    // miliseconds for double digits
    if (tens > 9) {
        appendTens.innerHTML = tens;
    }

    // when miliseconds finish, increment a second and reset miliseconds
    if (tens > 99) {
        sec++;
        appendSec.innerHTML = "0" + sec;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }
    // when seconds are greater than 9 for double digits
    if (sec > 9) {
        appendSec.innerHTML = sec;
    }

    // when seconds finish, increment a minute and reset seconds | single digit minutes
    if (sec > 59) {
        min++;
        appendMin.innerHTML = "0" + min;
        sec = 0;
        appendSec.innerHTML = "0" + 0;
    } 

    // when minutes are greater than 9 for double digits
    if (min > 9) {
        appendMin.innerHTML = min;
    }
}
