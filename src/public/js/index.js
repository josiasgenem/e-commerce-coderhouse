const addToCartBtns = document.getElementsByClassName('btn-addToCart');
const deleteFromCartBtns = document.getElementsByClassName('btn-deleteFromCart');
const toCartLink = document.getElementById('toCartLink');
const logoutBtn = document.getElementById('logout');
const firstNameSpan = document.getElementById('first_name');

let cid = sessionStorage.getItem('cid');

document.addEventListener("DOMContentLoaded", init);

function init() {
    if (!cid || cid == 'undefined') createCart();
    if (cid && toCartLink) {
        fetch(`/api/carts/${cid}`)
            .then(resp => {
                resp.status === 404 ?
                createCart() :
                toCartLink.setAttribute('href', `/api/carts/${cid}`)
            })
    }

    for (const btn of addToCartBtns) {
        let pid = btn.getAttribute('data-id');
        btn.addEventListener('click', () => addToCart(pid));
    }

    for (const btn of deleteFromCartBtns) {
        let pid = btn.getAttribute('data-id');
        btn.addEventListener('click', () => deleteFromCart(pid));
    }
}

function createCart() {
    fetch("/api/carts", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(json => {
        cid = json._id;
        toCartLink?.setAttribute('href', `/api/carts/${cid}`);
        sessionStorage.setItem('cid', json._id);
    })
    .catch(err => console.log(err));
}

function addToCart(pid) {
    fetch(`/api/carts/${cid}/products/${pid}`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .catch(err => console.log(err));
}

function deleteFromCart(pid) {
    fetch(`/api/carts/${cid}/products/${pid}`, {
        method: "delete",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        location.reload();
    })
    .catch(err => console.log('---> Error:', err));
}