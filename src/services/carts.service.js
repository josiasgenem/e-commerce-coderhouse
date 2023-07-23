import CartsDaoMongoDB from "../daos/mongodb/carts.dao.js";
const cartsDao = new CartsDaoMongoDB();

// import { CartsDaoFileSystem } from "../daos/filesystem/carts.dao.js";
// const cartsDao = new CartsDaoFileSystem('./src/daos/filesystem/carrito.json');

export const getAll = async (limit) => {
    try {
        const response = await cartsDao.getAll(limit);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const getById = async (id) => {
    try {
        const response = await cartsDao.getById(id);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const create = async (products) => {
    try {
        const response = await cartsDao.create(products);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const addProduct = async (cid, pid) => {
    try {
        const cart = await getById(cid);
        let exist = false;
        cart.products.map(product => {
            if (product.productId.toString() === pid.toString()) {
                product.quantity++;
                exist = true;
            }
            return product;
        })
        if (!exist) cart.products.push({
            productId: pid,
            quantity: 1
        })
        const response = await cartsDao.updateProducts(cid, cart.products);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const remove = async (id) => {
    try {
        const response = await cartsDao.remove(id);
        return response;
    } catch (err) {
        console.log(err);
    }
}