const addToCartBtns = document.getElementsByClassName('btn-addToCart');
const deleteFromCartBtns = document.getElementsByClassName('btn-deleteFromCart');
const toCartLink = document.getElementById('toCartLink');
const buyBtn = document.getElementById('buy-btn');
// const firstNameSpan = document.getElementById('first_name');

let accessToken, cid;

document.addEventListener("DOMContentLoaded", init);

function init() {
    cid = getCartId();
    if (cid) toCartLink?.setAttribute('href', `/api/carts/${cid}`);
    if (cid && buyBtn) buyBtn.addEventListener('click', () => buyCart(cid));
    
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