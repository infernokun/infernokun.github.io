const projectListHTML = [];
const projects = document.querySelector('.section.projects');
const co = projects.querySelector('.content');

$(document).ready(function () {
    $("#year").text(new Date().getFullYear());

    allProjects.forEach(function (item) {
        projectListHTML.push(item.innerHTML);
    });


    if ($(document).width() <= 768) {
        pushSingleProject();
    } else {
        pushAllProjects();
    }

    $(window).resize(function () {
        if ($(document).width() <= 768) {
            pushSingleProject();
        } else {
            pushAllProjects();
        }
    });
});

function pushSingleProject() {
    co.innerHTML = '';
    const newItem = `<div class="project-item">${projectListHTML[0]}</div>`;

    co.insertAdjacentHTML('beforeend', newItem);
}

function pushAllProjects() {
    co.innerHTML = '';
    projectListHTML.forEach(function (item) {

        const newItem = `<div class="project-item">${item}</div>`;

        co.insertAdjacentHTML('beforeend', newItem);
    });
}

const menu = document.querySelector('.menu');
const navOpen = document.querySelector('.hamburger');
const navClose = document.querySelector('.close');
const navBar = document.querySelector('.nav');
const navLogo = document.querySelector('.nav-logo');
const showMore = document.querySelector('.show-more');

showMore.addEventListener('click', () => {
    pushAllProjects();

    showMore.style.display = 'none';
});

const allProjects = document.querySelectorAll('.project-item');

const navLeft = menu.getBoundingClientRect().left;
navOpen.addEventListener("click", () => {
    if (navLeft < 0) {
        menu.classList.add("show");
        document.body.classList.add("show");
        navBar.classList.add("show");
        navLogo.classList.add("move");
    }
});

navClose.addEventListener("click", () => {
    if (navLeft < 0) {
        menu.classList.remove("show");
        document.body.classList.remove("show");
        navBar.classList.remove("show");
        navLogo.classList.remove("move");
    }
});

document.body.addEventListener("click", function (event) {

    var element = event.target;
    if (element.classList.contains("show")) {
        menu.classList.remove("show");
        document.body.classList.remove("show");
        navBar.classList.remove("show");
        navLogo.classList.remove("move");
    }
});