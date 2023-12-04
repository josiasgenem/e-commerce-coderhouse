import { updateProducts } from "./index.js";

const socketClient = io();

export function socketAddProduct(product) {
    socketClient.emit('addProduct', product);
}

export function socketDelProduct(pid) {
    socketClient.emit('delProduct', pid);
}

// Desarrollar actualización de lista de productos.
socketClient.on('productsUpdated', (products) => {
    updateProducts(products);
})