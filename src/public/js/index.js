const addToCartBtns = document.getElementsByClassName('btn-addToCart');
const deleteFromCartBtns = document.getElementsByClassName('btn-deleteFromCart');
const updateProductBtns = document.getElementsByClassName('btn-update-product');
const deleteProductBtns = document.getElementsByClassName('btn-delete-product');
const toCartLink = document.getElementById('toCartLink');
const checkoutBtn = document.getElementById('checkout-btn');
const buyBtn = document.getElementById('buy-btn');
const reqResetPassBtn = document.getElementById('btn-req-reset');
const resetPassBtn = document.getElementById('btn-reset-password');
const saveProductBtn = document.getElementById('btn-save-product');
const changeUserRoleBtns = document.getElementsByClassName('btn-upgrade-user');
const viewEditUserBtns = document.getElementsByClassName('btn-edit-user');
const deleteUserBtns = document.getElementsByClassName('btn-delete-user');
const saveUserBtn = document.getElementById('btn-save-user');

// const firstNameSpan = document.getElementById('first_name');

let accessToken, cid;

document.addEventListener("DOMContentLoaded", init);

function init() {
    cid = getCartId();
    if (cid) toCartLink?.setAttribute('href', `/api/carts/${cid}`);
    if (cid && checkoutBtn) checkoutBtn.addEventListener('click', () => checkoutCart(cid));
    if (cid && buyBtn) buyBtn.addEventListener('click', () => buyCart(cid));
    if (reqResetPassBtn) reqResetPassBtn.addEventListener('click', () => reqResetPass());
    if (resetPassBtn) resetPassBtn.addEventListener('click', () => resetPass());
    if (saveProductBtn) saveProductBtn.addEventListener('click', () => saveProduct());
    if (saveUserBtn) saveUserBtn.addEventListener('click', (e) => saveUser(e));
    
    for (const btn of addToCartBtns) {
        let pid = btn.getAttribute('data-id');
        btn.addEventListener('click', () => addToCart(pid));
    }

    for (const btn of deleteFromCartBtns) {
        let pid = btn.getAttribute('data-id');
        btn.addEventListener('click', () => deleteFromCart(pid));
    }

    for (const btn of updateProductBtns) {
        let pid = btn.getAttribute('data-id');
        btn.addEventListener('click', () => goToUpdateProduct(pid));
    }

    for (const btn of deleteProductBtns) {
        let pid = btn.getAttribute('data-id');
        btn.addEventListener('click', () => deleteProduct(pid));
    }

    for (const btn of changeUserRoleBtns) {
        let userId = btn.getAttribute('data-id');
        btn.addEventListener('click', () => changeUserRole(userId));
    }

    for (const btn of viewEditUserBtns) {
        let userId = btn.getAttribute('data-id');
        btn.addEventListener('click', () => viewEditUser(userId));
    }

    for (const btn of deleteUserBtns) {
        let userId = btn.getAttribute('data-id');
        btn.addEventListener('click', () => deleteUser(userId));
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
    .then(json => {
        checkRedirects(json);
        if (json.message) alert(json.message);
    })
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
        if (json.message) alert(json.message);
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
        if (json.message) alert(json.message);
    })
    .catch(e => console.log(e))
}

export function saveProduct() {
    const data = {
        title: document.getElementsByName('title')[0].value,
        description: document.getElementsByName('description')[0].value,
        price: document.getElementsByName('price')[0].value,
        code: document.getElementsByName('code')[0].value,
        status: document.getElementsByName('status')[0].checked,
        stock: document.getElementsByName('stock')[0].value,
        category: document.getElementsByName('category')[0].value,
        thumbnails: document.getElementsByName('thumbnails')[0].value
    }

    let path, method;
    if (window.location.pathname.includes('products/add')) {
        path = '/api/products'
        method = 'POST';
    }
    if (window.location.pathname.includes('products/update/')) {
        const pid = saveProductBtn.getAttribute('data-id');
        path = `/api/products/${pid}`;
        method = 'PUT';
    }

    fetch(path, {
        method,
        redirect: 'follow',
        headers: setHeaders(),
        body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(json => {
        console.log(json);
        if (json.message) alert(json.message);
    })
    .catch(err => {
        console.log(err);
        alert(err.message);
    })
}

export function goToUpdateProduct(pid) {
    window.location.href = '/api/products/update/' + pid;
}

export function deleteProduct(pid) {
    fetch(`/api/products/${pid}`, {
        method: 'DELETE',
        redirect: 'follow',
        headers: setHeaders()
    })
    .then(resp => resp.json())
    .then(json => {
        console.log(json);
        if (json.message) alert(json.message);
    })
    .catch(err => {
        console.log(err);
        alert(err.message);
    })
}

export function checkoutCart(cid) {
    window.location.href = `/api/carts/${cid}/checkout`;
    // fetch(`/api/carts/${cid}/checkout`, {
    //     method: "GET",
    //     redirect: 'follow',
    //     headers: setHeaders()
    // })
    // .then(res => {
    //     checkRedirects(res);
    //     return res.json();
    // })
    // .then(json => {
    //     console.log(json);
    //     if (json.message) alert(json.message);
    // })
    // .catch(err => console.log('---> Error:', err));
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
        if (json.message) alert(json.message);
    })
    .catch(err => console.log('---> Error:', err));
}

function changeUserRole(userId) {
    fetch(`/users/premium/${userId}`, {
        method: "POST",
        redirect: 'follow',
        headers: setHeaders()
    })
    .then(res => {
        checkRedirects(res);
        return res.json();
    })
    .then(json => {
        if (json.message) alert(json.message);
        if (json.status === 'success') window.location.reload();
    })
    .catch(err => console.log('---> Error:', err))
}

function viewEditUser(userId) {
    window.location.href = '/users/edit/' + userId
}

function saveUser(e) {
    const id = e.target.dataset.id;
    const data = {
        first_name: document.getElementsByName('first_name')[0].value,
        last_name: document.getElementsByName('last_name')[0].value,
        email: document.getElementsByName('email')[0].value,
        age: document.getElementsByName('age')[0].value
    }
    
    // ! Falta crear los endpoints de aquí en adelante

    fetch(`/users/${id}`, {
        method: "PUT",
        redirect: 'follow',
        headers: setHeaders(),
        body: JSON.stringify(data)
    })
    .then(res => {
        checkRedirects(res);
        return res.json();
    })
    .then(json => {
        console.log(json);
        if (json.message) alert(json.message);
        if (json.status === 'success') window.location.reload();
    })
    .catch(err => console.log('---> Error:', err));
}

function deleteUser(userId) {
    fetch(`/users/${userId}`, {
        method: "DELETE",
        redirect: 'follow',
        headers: setHeaders()
    })
    .then(res => {
        checkRedirects(res);
        return res.json();
    })
    .then(json => {
        console.log(json);
        if (json.message) alert(json.message);
        if (json.status === 'success') window.location.reload();
    })
    .catch(err => console.log('---> Error:', err));
}