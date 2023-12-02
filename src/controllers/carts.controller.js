import { NotFoundError } from '../config/errors.js';
import CartsService from '../services/carts.service.js';
import { logger } from '../utils/logger.js';
const service = new CartsService();


export const getAll = async (req, res, next) => {
    try {
        const response = await service.getAll();
        res.status(200).json(response);
    } catch (err) {
        return next(err);
    }
}

export const getCurrentUserCart = async (req, res, next) => {
    try {
        const cart = await service.getCurrentUserCart(req, res, next);
        if (!cart) return res.status(400).json({ message: 'Not Found!' });
        
        return res.status(301).redirect(`/api/carts/${cart.id}`);
    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}

export const getById = async (req, res, next) => {
    const { cid } = req.params;
    try {
        let cart = await service.getCurrentUserCart(req);
        if (cart.id.toString() !== cid) {
            if (req.user.role !== 'admin') {
                req.session.context = { message: "You're Not Authorized to get carts that you are not owner!" }
                return res.status(403).redirect(`/api/carts/${cart.id.toString()}`);
            }

            cart = await service.getById(cid);
            if (!cart) throw new NotFoundError(`Cart ${cid} Not Found!`);
        }
    
        return res.status(200).render('cart', {resp: cart, user: req.user});
        // res.status(200).json(response);
    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}

// export const create = async (req, res, next) => {
//     const { products } = req.body;
//     try {        
//         const response = await service.create(cartId, products);
//         res.status(200).json(response);
//     } catch (err) {
//         console.log('--->error create cart: ',err);
//         res.status(500).send(err.message);
//     }
// }

export const addOneProduct = async (req, res, next) => {
    const { cid, pid, pQty } = req.params;
    try {
        const userCartId = service.getCurrentUserCartId(req);
        if (cid !== userCartId && req.user.role !== 'admin') {
            req.session.context = { message: "You're Not Authorized to add products to carts that you are not owner!" }
            return res.status(403).redirect(`/api/carts/${userCartId}`);
        }
        
        const cart = await service.addOneProduct(cid, pid, req.user);

        // logger.debug(cart);

        if (!cart.success) return res.status(400).json({ message: cart.message });
        return res.status(200).json({ cart: cart.data, message: cart.message });
    } catch (err) {
        return next(err);
        // return res.status(500).send(err.message);
    }
}

export const updateAllProducts = async (req, res, next) => {
    const { cid } = req.params;
    const { products } = req.body;
    
    try {
        if (!Array.isArray(products)) throw new Error('Invalid Products')

        const response = await service.updateAllProducts(cid, products);
        res.status(200).send(`El carrito fue actualizado exitosamente: ${JSON.stringify(response)}`);

    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}

export const updateProductQty = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    try {
        if (typeof quantity !== 'number') throw new Error('Invalid Quantity')
        const userCartId = service.getCurrentUserCartId(req);
        if (cid !== userCartId && req.user.role !== 'admin') {
            req.session.context = { message: "You're Not Authorized to add products to carts that you are not owner!" }
            return res.status(403).redirect(`/api/carts/${userCartId}`);
        }

        const response = await service.updateProductQty(cid, pid, quantity);
        res.status(200).send(`El producto fue actualizado exitosamente: ${JSON.stringify(response)}`);

    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}

export const removeOneProduct = async (req, res, next) => {
    const { cid, pid } = req.params
    
    try {
        const userCartId = service.getCurrentUserCartId(req);
        if (cid !== userCartId && req.user.role !== 'admin') {
            req.session.context = { message: "You're Not Authorized to get carts that you are not owner!" }
            return res.status(403).redirect(`/api/carts/${userCartId}`);
        }

        const response = await service.removeOneProduct(cid, pid);
        res.status(200).json(response);
    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}

export const checkout = async (req, res, next) => {
    const { cid } = req.params;
    try {
        const cart = await service.getById(cid);
        if (!cart) return res.status(400).json({ message: 'Not Found!' });
        console.log(cart, 'CART FROM CHECKOUT CONTROLLER')
        return res.render('checkout', { user: req.user, cart });
    } catch (err) {
        return next(err);
    }
}

export const purchase = async (req, res, next) => {
    const { cid } = req.params;
    
    try {
        const ticket = await service.purchase(cid, req.user);
        return res.status(301).redirect(`/api/tickets/${ticket.id}`);
    } catch (err) {
        return next(err);
        // res.status(500).json({message: err.message});
    }
}

export const removeAllProducts = async (req, res, next) => {
    const { cid } = req.params
    
    try {
        const userCartId = service.getCurrentUserCartId(req);
        if (cid !== userCartId && req.user.role !== 'admin') {
            req.session.context = { message: "You're Not Authorized to get carts that you are not owner!" }
            return res.status(403).redirect(`/api/carts/${userCartId}`);
        }
        
        const response = await service.removeAllProducts(cid);
        res.status(200).send(`El carrito fue vaciado exitósamente. Carrito vacío: ${JSON.stringify(response)}.`);
    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}