import { Router } from "express";

import { CartsManager } from '../helpers/cartsManager.js'
import { ProductManager } from "../helpers/productManager.js";
const cartsManager = new CartsManager('./src/helpers/carrito.json');
const productManager = new ProductManager('./src/helpers/productos.json');

const router = Router();

router.post('/', async (req, res) => {
    try {
        const response = await cartsManager.addCart();
        res.status(200).json({message: `El carrito fue agregado exitósamente: ${JSON.stringify(response)}`});
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

router.get('/', async (req, res) => {
    try {
        const response = await cartsManager.getCarts();
        res.status(200).json(response)
    
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const response = await cartsManager.getCartById(parseInt(cid));
        
        res.status(200).json(response);
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
    
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const products = await productManager.getProductById(parseInt(pid));
        const response = await cartsManager.addProductToCart(cid, pid)
        res.status(200).json(response);
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

export default router;