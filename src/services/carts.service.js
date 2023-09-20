// import CartsDaoMongoDB from "../persistence/mongodb/carts.dao.js";
// import CartsDaoFileSystem from "../persistence/daos/filesystem/carts.dao.js";

// let cartsDao;
// if (process.env.DB_ENGINE === 'MONGODB') cartsDao = new CartsDaoMongoDB();
// if (process.env.DB_ENGINE === 'FILESYSTEM') cartsDao = new CartsDaoFileSystem('./src/persistence/filesystem/carrito.json');
import { cartsDao } from "../persistence/factory.js";
import * as productsService from './products.service.js'
import TicketService from "./ticket.service.js";
const ticketService = new TicketService();
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

export const create = async (id, products) => {
    try {
        if (!id) throw new Error('Any Cart ID received, you must create a cart with the cart ID saved for the user!');
        const repositoryCartExist = await getById(id);
        if (repositoryCartExist) throw new Error(`Cart ID already exist!`)

        const newRepositoryCart = await cartsDao.create(cartRepository.formatToDB({id, products}));
        // const newCart = await cartsDao.create({_id: id, products});
        
        return newRepositoryCart;
    } catch (err) {
        console.log(err);
    }
}

export const addOneProduct = async (id, pid) => {
    try {
        const repositoryCart = await getById(id);

        let existInCart = false,
            prodQty;
            
            if (repositoryCart.products.length) {
                repositoryCart.products.map(cartElement => {
                
                if (cartElement.product.id == pid) {
                    cartElement.quantity++;

                    prodQty = cartElement.quantity;
                    existInCart = true;
                }
                return cartElement;
            })
        }
        if (!existInCart) {
            repositoryCart.products.push({
                product: pid,
                quantity: 1
            })
            prodQty = 1;
        }
        
        const isProductAvailable = await productsService.isAvailable(pid, prodQty);
        if (!isProductAvailable) return false;

        const updRepositoryCarts = await updateAllProducts(id, cartRepository.formatToDB(repositoryCart).products);
        return updRepositoryCarts;
    } catch (err) {
        console.log(err);
    }
}

export const updateAllProducts = async (id, products) => {
    try {
        const updCart = await cartsDao.updateAllProducts(id, products);
        const updRepositoryCarts = cartRepository.formatFromDB(updCart);
        return updRepositoryCarts;
    } catch (err) {
        console.log(err);
    }
}

export const updateProductQty = async (id, pid, quantity) => {
    try {
        const updCart = await cartsDao.updateProductQty(id, pid, quantity);
        const updRepositoryCart = cartRepository.formatFromDB(updCart);
        return updRepositoryCart;
    } catch (err) {
        console.log(err);
    }
}

export const removeOneProduct = async (id, pid) => {
    try {
        const updCart = await cartsDao.removeOneProduct(id, pid);
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

export const purchase = async (id, user) => {
    try {
        
        const repositoryCart = await getById(id);
        const notAvailablesProducts = [];
        let isAllProductsUpdated = true;
        let cartAmount = 0;
        
        for (const { product, quantity } of repositoryCart.products) {
            const isAvailableProduct = await productsService.isAvailable(product.id, quantity);
            if (!isAvailableProduct) notAvailablesProducts.push({product, quantity});
        }
        if (notAvailablesProducts.length) return {
            error: 'Some products in the cart do not have enough stock!',
            noStockProducts: notAvailablesProducts
        }
        
        //! Manejar mejor los errores que puedan suceder en el servidor.
        for (const { product, quantity } of repositoryCart.products) {
            const repositoryProductUpdated = await productsService.updateStock(product.id, `-${quantity}`);
            if (!repositoryProductUpdated) isAllProductsUpdated  = false;
            cartAmount += product.price * quantity;
        }

        if (!isAllProductsUpdated) return { message: 'Something went wrong, please try again!' };
        const repositoryCartUpdated = await removeAllProducts(id);
        if (!repositoryCartUpdated) return { message: 'Something went wrong, please try again!' };
        
        const ticket = await ticketService.create({amount: cartAmount, purchaser: user.id})
        if (!ticket) return { message: 'Something went wrong, please try again!' };
        
        return ticket;

    } catch (err) {
        console.log(err);
    }
}