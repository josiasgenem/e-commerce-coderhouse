import { socketAddProduct, socketDelProduct } from './socketClient.js';


updateEventListeners();

function updateEventListeners() {
    const form = document.getElementById('my-form');
    const title = document.getElementsByName('title')[0];
    const description = document.getElementsByName('description')[0];
    const code = document.getElementsByName('code')[0];
    const category = document.getElementsByName('category')[0];
    const stock = document.getElementsByName('stock')[0];
    const status = document.getElementsByName('status')[0];
    const price = document.getElementsByName('price')[0];
    const addProductBtn = document.getElementById('add-product-btn');
    const delProductBtns = Array.from(document.getElementsByClassName('delete-btn'));
    
    form.addEventListener('submit', (e) => e.preventDefault());
    
    addProductBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const product = {
            title: title.value,
            description: description.value,
            code: code.value,
            category: category.value,
            stock: parseInt(stock.value),
            status: status.checked ? true : false,
            price: parseInt(price.value)
        }
        socketAddProduct(product);
    })
    
    delProductBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pid = parseInt(e.target.dataset.id);
            socketDelProduct(pid);
        })
    });
}

export function updateProducts(products) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";
    
    for (const product of products) {
        const refObject = {
            id: '',
            title: '',
            description: '',
            code: '',
            category: '',
            stock: '',
            status: '',
            price: '',
            thumbnails: [],
            delete: ''
        }
        const row = document.createElement('tr');
        row.id = product.id;
        
        for (const key in refObject) {
            const col = row.appendChild(document.createElement('td'));
            if (Object.hasOwnProperty.call(product, key)) {
                col.innerText = product[key];
            } else if (key === 'delete') {
                col.innerHTML = `<i data-id="${product.id}" class="delete-btn fa fa-trash"></i>`;
            }
        }

        tableBody.appendChild(row);
        updateEventListeners();
    }
}