import CartsDaoMongoDB from "../daos/mongodb/carts.dao.js";
import CartsDaoFileSystem from "../daos/filesystem/carts.dao.js";

let cartsDao;
if (process.env.DB_SYSTEM === 'MONGODB') cartsDao = new CartsDaoMongoDB();
if (process.env.DB_SYSTEM === 'FILESYSTEM') cartsDao = new CartsDaoFileSystem('./src/daos/filesystem/carrito.json');

export const getAll = async (/* {page = 1, limit = 10, sort, query = null} */) => {
    try {
        // sort === "asc" ? sort = 1 :
        // sort === "desc" ? sort = -1 : sort = null;
        const carts = await cartsDao.getAll();
        return carts;
    } catch (err) {
        console.log(err);
    }
}

export const getById = async (id) => {
    try {
        const cart = await cartsDao.getById(id);
        if (!cart) return {
            message: "Not Found!",
            status: 404
        }
        return cart;
    } catch (err) {
        console.log(err);
    }
}

export const create = async (products) => {
    try {
        const newCart = await cartsDao.create(products);
        return newCart;
    } catch (err) {
        console.log(err);
    }
}

export const addProduct = async (cid, pid) => {
    try {
        const cart = await getById(cid);

        //TODO: Falta chequear si el producto existe antes de agregarlo
        
        let exist = false;

        cart.products.map(product => {
            if (product.product._id.toString() === pid.toString()) {
                product.quantity++;
                exist = true;
            }
            return product;
        })
        if (!exist) cart.products.push({
            product: pid,
            quantity: 1
        })
        const updCarts = await cartsDao.updateAllProducts(cid, cart.products);
        return updCarts;
    } catch (err) {
        console.log(err);
    }
}

export const updateAllProducts = async (cid, products) => {
    try {
        const updCart = await cartsDao.updateAllProducts(cid, products);
        return updCart;
    } catch (err) {
        console.log(err);
    }
}

export const updateProductQty = async (cid, pid, quantity) => {
    try {
        const updCart = await cartsDao.updateProductQty(cid, pid, quantity);
        return updCart;
    } catch (err) {
        console.log(err);
    }
}

export const removeProduct = async (cid, pid) => {
    try {
        const response = await cartsDao.removeProduct(cid, pid);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const removeAllProducts = async (id) => {
    try {
        const response = await cartsDao.removeAllProducts(id);
        return response;
    } catch (err) {
        console.log(err);
    }
}