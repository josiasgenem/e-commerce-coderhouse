// import CartsDaoMongoDB from "../persistence/mongodb/carts.dao.js";
// import CartsDaoFileSystem from "../persistence/daos/filesystem/carts.dao.js";

// let cartsDao;
// if (process.env.DB_ENGINE === 'MONGODB') cartsDao = new CartsDaoMongoDB();
// if (process.env.DB_ENGINE === 'FILESYSTEM') cartsDao = new CartsDaoFileSystem('./src/persistence/filesystem/carrito.json');
import { cartsDao } from "../persistence/factory.js";
import ProductsService from './products.service.js'
const productsService = new ProductsService();
import TicketService from "./ticket.service.js";
const ticketService = new TicketService();
import CartsRepository from "../persistence/repository/carts/carts.repository.js";
import { BadRequestError, NotFoundError, ServerError } from "../config/errors.js";
const cartRepository = new CartsRepository();


export default class CartsService {

    async getAll() {
        try {
            const carts = await cartsDao.getMany();
            const repositoryCarts = carts.map(cart => cartRepository.formatFromDB(cart));
            return repositoryCarts;
        } catch (err) {
            throw err;
        }
    }
    
    async getById(id) {
        try {
            const cart = await cartsDao.getById(id);
            if (!cart) return false;
            // throw new NotFoundError(`Cart with ID: ${id} does not exist!`);
            
            const repositoryCart = cartRepository.formatFromDB(cart);
            return repositoryCart;
        } catch (err) {
            throw err;
        }
    }
    
    getCurrentUserCartId(req) {
        return req.user.cartId;
    }
    
    async getCurrentUserCart(req) {
        try {
            const cartId = this.getCurrentUserCartId(req);
            let repositoryCart = await this.getById(cartId);
            if (!repositoryCart) {
                let cart = await this.create(cartId, []);
                repositoryCart = cartRepository.formatFromDB(cart);
            }
            return repositoryCart;
        } catch (err) {
            throw err;
            // return false;
        }
    }
    
    async create(id, products) {
        try {
            if (!id) throw new BadRequestError('Any Cart ID received, you must create a cart with the cart ID saved for the user!');
            const repositoryCartExist = await this.getById(id);
            if (repositoryCartExist) throw new BadRequestError(`Cart ID already exist! You can't create a new one with the same ID ${id}.`);
            
            const newRepositoryCart = await cartsDao.create(cartRepository.formatToDB({id, products}));
            // const newCart = await cartsDao.create({_id: id, products});
            
            return newRepositoryCart;
        } catch (err) {
        throw err;
    }
}

async addOneProduct(id, pid) {
    try {
        const repositoryCart = await this.getById(id);
        
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
        if (!isProductAvailable) throw new NotFoundError(`Product with ID ${id} does not exist, is not in stock or the requested amount is higher than the stock.`);
        
        const updRepositoryCarts = await this.updateAllProducts(id, cartRepository.formatToDB(repositoryCart).products);
        return updRepositoryCarts;
    } catch (err) {
        throw err;
    }
}

async updateAllProducts(id, products) {
    try {
        const updCart = await cartsDao.updateAllProducts(id, products);
        const updRepositoryCarts = cartRepository.formatFromDB(updCart);
        return updRepositoryCarts;
    } catch (err) {
        throw err;
    }
}

async updateProductQty(id, pid, quantity) {
    try {
        const updCart = await cartsDao.updateProductQty(id, pid, quantity);
        const updRepositoryCart = cartRepository.formatFromDB(updCart);
        return updRepositoryCart;
    } catch (err) {
        throw err;
    }
}

async removeOneProduct(id, pid) {
    try {
        const updCart = await cartsDao.removeOneProduct(id, pid);
        const updRepositoryCart = cartRepository.formatFromDB(updCart);
        return updRepositoryCart;
    } catch (err) {
        throw err;
    }
}

async removeAllProducts(id) {
    try {
        const updCart = await cartsDao.removeAllProducts(id);
        const updRepositoryCart = cartRepository.formatFromDB(updCart);
        return updRepositoryCart;
    } catch (err) {
        throw err;
    }
}

async purchase(id, user) {
    try {
        
        const repositoryCart = await this.getById(id);
        const notAvailablesProducts = [],
        notUpdatedProducts = [];
        let cartAmount = 0;
        
        for (const { product, quantity } of repositoryCart.products) {
            const isAvailableProduct = await productsService.isAvailable(product.id, quantity);
            if (!isAvailableProduct) notAvailablesProducts.push({product, quantity});
        }
        if (notAvailablesProducts.length) throw new BadRequestError('Some products in the cart do not have enough stock!', { notAvailablesProducts });
        
        for (const { product, quantity } of repositoryCart.products) {
            const repositoryProductUpdated = await productsService.updateStock(product.id, `-${quantity}`);
            if (!repositoryProductUpdated) notUpdatedProducts.push(
                {
                    id: product.id,
                    modification: `-${quantity}`,
                    datetime: Date.now()
                }
                )
                cartAmount += product.price * quantity;
            }
            
            //! All errors behind this comment should be handled in its own called service function, I think.
            if (!notUpdatedProducts.length) throw new ServerError('Some products weren\'t updated', notUpdatedProducts);
            const repositoryCartUpdated = await this.removeAllProducts(id);
            if (!repositoryCartUpdated) throw new ServerError(`Cart ${id} weren\'t updated.`);
            
            const ticket = await ticketService.create({amount: cartAmount, purchaser: user.id})
            
            return ticket;
            
        } catch (err) {
            throw err;
        }
    }
}