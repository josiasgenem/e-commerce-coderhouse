import { checkRedirects, setHeaders } from "./index.js";

const btnLogin = document.getElementById('btn-login');
const btnRefresh = document.getElementById('btn-refresh');
const logoutBtn = document.getElementById('btn-logout');
const alertLogin = document.getElementById('alert-login');
const email = document.getElementsByName('email')[0];
const password = document.getElementsByName('password')[0];

document.addEventListener("DOMContentLoaded", initlogin);

function initlogin() {
    btnLogin?.addEventListener('click', e => login(e));
    window.addEventListener('keypress', e => { if (e.key === 'Enter' && window.location.pathname === '/users/login') return login(e) });
    btnRefresh?.addEventListener('click', e => refreshToken());
    logoutBtn?.addEventListener('click', () => logout())
}

function login(e) {
    e.preventDefault();
    const data = {
            email: email.value,
            password: password.value
    }

    fetch('/users/login', {
        method: 'POST',
        headers: setHeaders(),
        redirect: "follow",
        body: JSON.stringify(data)
    })
        .then(resp => {
            checkRedirects(resp);
            return resp.json()
        })
        .then(json => {
            console.log(json);
            alert(json.message);
        })
        .catch(e => console.log(e))
    }
    
    function refreshToken() {
        fetch('/users/login/refresh', {
            method: 'POST',
            redirect: "follow",
            headers: setHeaders()
        })
        .then(resp => resp.json())
        .then(json => {
            console.log(json);
            alert(json.message);
        // setAccessToken(json.accessToken);
        // checkRedirects(json);
    })
}

function logout() {
    fetch(`/users/refresh`, {
        method: 'DELETE',
        redirect: "follow",
        headers: setHeaders()
    })
    .then(resp => {
        checkRedirects(resp);
        return resp.json()
    })
    .then(json => {
        // setAccessToken(json);
        // checkRedirects(json);
    })
}