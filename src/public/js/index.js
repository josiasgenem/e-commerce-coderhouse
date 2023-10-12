const addToCartBtns = document.getElementsByClassName('btn-addToCart');
const deleteFromCartBtns = document.getElementsByClassName('btn-deleteFromCart');
const toCartLink = document.getElementById('toCartLink');
const buyBtn = document.getElementById('buy-btn');
const reqResetPassBtn = document.getElementById('btn-req-reset');
const resetPassBtn = document.getElementById('btn-reset-password');
// const firstNameSpan = document.getElementById('first_name');

let accessToken, cid;

document.addEventListener("DOMContentLoaded", init);

function init() {
    cid = getCartId();
    if (cid) toCartLink?.setAttribute('href', `/api/carts/${cid}`);
    if (cid && buyBtn) buyBtn.addEventListener('click', () => buyCart(cid));
    if (reqResetPassBtn) reqResetPassBtn.addEventListener('click', () => reqResetPass());
    if (resetPassBtn) resetPassBtn.addEventListener('click', () => resetPass());
    
    for (const btn of addToCartBtns) {
        let pid = btn.getAttribute('data-id');
        btn.addEventListener('click', () => addToCart(pid));
    }

    for (const btn of deleteFromCartBtns) {
        let pid = btn.getAttribute('data-id');
        btn.addEventListener('click', () => deleteFromCart(pid));
    }
}

export function getAccessToken () { return accessToken };

export function getCartId () {
    return document.cookie.split(';').map(pair => {
        let [key, value] = pair.split('=');
        key = key?.trim();
        value = value?.trim();
        if(key === 'coderhouse-ecommerce-cart-id') return value;
    })[0];
}

export async function checkRedirects(response) {
    if (response.redirected) {
        const json = response.json();
        if (json.redirect && typeof json.redirect === 'object') {
            const { path, method } = response.redirect;
            fetch(path, {
                method,
                redirect: "follow",
                headers: setHeaders()
            })
            .then(resp => checkRedirects(resp))
        }
        if (response.redirected) {
            window.location.href = response.url;
        }
    }
}

export function setHeaders() {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    return headers;
}

function addToCart(pid) {
    fetch(`/api/carts/${cid}/products/${pid}`, {
        method: "POST",
        redirect: 'follow',
        headers: setHeaders()
    })
    .then(res => res.json())
    .then(json => checkRedirects(json))
    .catch(err => console.log(err));
}

function deleteFromCart(pid) {
    fetch(`/api/carts/${cid}/products/${pid}`, {
        method: "DELETE",
        redirect: 'follow',
        headers: setHeaders()
    })
    .then(res => {
        checkRedirects(res);
        return res.json()
    })
    .then(json => {
        console.log(json);
        location.reload();
    })
    .catch(err => console.log('---> Error:', err));
}

function reqResetPass() {
    const email = document.getElementsByName('email')[0];
    const data = {
        email: email.value
        // ! ESTOY OBTENIENDO LOS INPUTS PARA MANDAR LOS DATOS AL BACKEND
        // ! DESPUÉS TENGO QUE SEGUIR CON LAS OTRAS VISTAS Y POST PARA RESETEAR LA PASS
    }
    fetch(`/users/reset-password/`, {
        method: 'POST',
        redirect: 'follow',
        headers: setHeaders(),
        body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(json => {
        console.log(json);
        alert(json.message);
    })
    .catch(e => console.log(e))
}

function resetPass() {
    const password = document.getElementsByName('password')[0];
    const password2 = document.getElementsByName('repeat-password')[0];
    
    
    if (!password.value || password.value !== password2.value) {
        alert('Invalid password, or both password are not the same')
        return;
    }
    fetch(window.location.href, {
        method: 'POST',
        redirect: 'follow',
        headers: setHeaders(),
        body: JSON.stringify({password: password.value})
    })
    .then(resp => resp.json())
    .then(json => {
        console.log(json);
        alert(json.message);
    })
    .catch(e => console.log(e))
}

export function buyCart(cid) {
    fetch(`/api/carts/${cid}/purchase`, {
        method: "POST",
        redirect: 'follow',
        headers: setHeaders()
    })
    .then(res => {
        checkRedirects(res);
        return res.json();
    })
    .then(json => {
        console.log(json);
    })
    .catch(err => console.log('---> Error:', err));
}