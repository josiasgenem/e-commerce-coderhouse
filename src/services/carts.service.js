// import CartsDaoMongoDB from "../persistence/mongodb/carts.dao.js";
// import CartsDaoFileSystem from "../persistence/daos/filesystem/carts.dao.js";

// let cartsDao;
// if (process.env.DB_ENGINE === 'MONGODB') cartsDao = new CartsDaoMongoDB();
// if (process.env.DB_ENGINE === 'FILESYSTEM') cartsDao = new CartsDaoFileSystem('./src/persistence/filesystem/carrito.json');
import { cartsDao } from "../persistence/factory.js";
import CartsRepository from "../persistence/repository/carts/carts.repository.js";
const cartRepository = new CartsRepository();

export const getAll = async () => {
    try {
        const carts = await cartsDao.getMany();
        const repositoryCarts = carts.map(cart => cartRepository.formatFromDB(cart));
        return repositoryCarts;
    } catch (err) {
        console.log(err);
    }
}

export const getById = async (id) => {
    try {
        const cart = await cartsDao.getById(id);
        if (!cart) return false;

        const repositoryCart = cartRepository.formatFromDB(cart);
        return repositoryCart;
    } catch (err) {
        console.log(err);
    }
}

export const getCurrentUserCartId = (req) => req.user.cartId;

export const getCurrentUserCart = async (req) => {
    try {
        const cartId = getCurrentUserCartId(req);
        let repositoryCart = await getById(cartId);
        if (!repositoryCart) {
            let cart = await create(cartId, []);
            repositoryCart = cartRepository.formatFromDB(cart);
        }
        return repositoryCart;
    } catch (err) {
        console.log(err, '---> getCurrentUserCart error.');
        return false;
    }
}

export const create = async (cartId, products) => {
    try {
        if (!cartId) throw new Error('Any Cart ID received, you must create a cart with the cart ID saved for the user!');
        const repositoryCartExist = await getById(cartId);
        if (repositoryCartExist) throw new Error(`Cart ID already exist!`)

        const newRepositoryCart = await cartsDao.create(cartRepository.formatToDB({id: cartId, products}));
        // const newCart = await cartsDao.create({_id: cartId, products});
        
        return newRepositoryCart;
    } catch (err) {
        console.log(err);
    }
}

export const addProduct = async (cid, pid) => {
    try {
        const repositoryCart = await getById(cid);
        
        let exist = false;

        repositoryCart.products.map(product => {
            if (product.product.id.toString() === pid.toString()) {
                product.quantity++;
                exist = true;
            }
            return product;
        })
        if (!exist) repositoryCart.products.push({
            product: pid,
            quantity: 1
        })
        
        const updRepositoryCarts = await updateAllProducts(cid, cartRepository.formatToDB(repositoryCart).products);
        return updRepositoryCarts;
    } catch (err) {
        console.log(err);
    }
}

export const updateAllProducts = async (cid, products) => {
    try {
        const updCart = await cartsDao.updateAllProducts(cid, products);
        const updRepositoryCarts = cartRepository.formatFromDB(updCart);
        return updRepositoryCarts;
    } catch (err) {
        console.log(err);
    }
}

export const updateProductQty = async (cid, pid, quantity) => {
    try {
        const updCart = await cartsDao.updateProductQty(cid, pid, quantity);
        const updRepositoryCart = cartRepository.formatFromDB(updCart);
        return updRepositoryCart;
    } catch (err) {
        console.log(err);
    }
}

export const removeOneProduct = async (cid, pid) => {
    try {
        const updCart = await cartsDao.removeOneProduct(cid, pid);
        const updRepositoryCart = cartRepository.formatFromDB(updCart);
        return updRepositoryCart;
    } catch (err) {
        console.log(err);
    }
}

export const removeAllProducts = async (id) => {
    try {
        const updCart = await cartsDao.removeAllProducts(id);
        const updRepositoryCart = cartRepository.formatFromDB(updCart);
        return updRepositoryCart;
    } catch (err) {
        console.log(err);
    }
}