// MODULES IMPORT
import {
    signup
} from "./signup";
import {
    login
} from "./login";
import {
    update,
    updatePwd
} from "./account";
import {
    logout
} from "./logout";
import {
    getBook
} from "./stripe";
import {
    deleteBook
} from "./bookings";
import "babel-polyfill";

//FORM
const sign = document.querySelector(".signup__form");
const signBtn = document.querySelector("#signup_btn");

//LOGIN
const loginForm = document.querySelector('.login__form');
const loginBtn = document.querySelector("#login__btn");

//ACCOUNT - USER DATA
const formData = document.querySelector('.form-user-data');
const dataBtn = document.getElementById('dataBtn');

//ACCOUNT - USER PASSWORD
const formPwd = document.querySelector('.form-user-password');
const pwdBtn = document.getElementById('pwdBtn');

//LOG OUT
const btnOut = document.getElementById('log-out');

//STRIPE
const bookBtn = document.getElementById('book-home');

//BOOKING
const closeBtn = document.getElementById('close');

if (sign) {
    signBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // ANIMATION
        signBtn.textContent = "WELCOME ..."

        const name = document.querySelector('input[name="name"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const passwordConfirm = document.querySelector(
            'input[name="passwordConfirm"]'
        ).value;
        const email = document.querySelector('input[name="email"]').value;

        await signup(name, email, password, passwordConfirm);

        signBtn.textContent = "SIGN IN"
    });
}

if (loginForm) {
    loginBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // ANIMATION
        loginBtn.textContent = "CONNEXION ..."

        // LOGIN DATA
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;

        await login(email, password);

        loginBtn.textContent = "LOG IN"
    });
}

if (formData) {
    dataBtn.addEventListener('click', async e => {
        e.preventDefault();

        // ANIMATION
        dataBtn.textContent = "Updating ..."

        // UPDATED DATA
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        await update(form);

        dataBtn.textContent = "SAVE SETTINGS"
    })
}

if (formPwd) {
    pwdBtn.addEventListener('click', async e => {
        e.preventDefault();

        // ANIMATION
        pwdBtn.textContent = "Updating ..."

        // UPDATED DATA
        const passwordCurr = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConf = document.getElementById('password-confirm').value;

        await updatePwd(passwordCurr, password, passwordConf);

        pwdBtn.textContent = "SAVE SETTINGS"
    })
}

if (btnOut) {
    btnOut.addEventListener('click', e => {
        e.preventDefault();
        logout();
    })
}

if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing ...'
        const {
            homeId
        } = e.target.dataset;

        getBook(homeId);
    })
}

if (closeBtn) {
    closeBtn.addEventListener('click', e => {
        e.preventDefault();
        const {
            homeId
        } = e.target.dataset;

        deleteBook(homeId);
    })
}

//MENU

const menu = {};
menu.bool = false;
menu.menuBtn = document.querySelector('#arrow');
menu.element = document.querySelector('.user-view__menu');;

window.onresize = function () {
    if (this.innerWidth >= 800) {
        const disable = document.querySelector('.disable');
        const active = document.querySelector('.active');
        if(disable || active) {
            menu.element.classList.remove(disable);
            menu.element.classList.remove(active);
        }
    }
}

if (menu.menuBtn) {
    menu.menuBtn.addEventListener('click', e => {

        menu.bool = !menu.bool;
        changeMenu(menu.bool);
    })
}

const changeMenu = (bool) => {
    if (bool === true) {
        menu.element.classList.add('active');
        menu.element.classList.remove('disable')
    } else {
        menu.element.classList.add('disable');
        menu.element.classList.remove('active');
    }
}