import { Router } from "express";
const router = Router();

import { ProductManager } from '../helpers/productManager.js';
const productManager = new ProductManager('./src/helpers/productos.json')

// Devuelve una lista con todos los productos en tiempo real.
// Se puede aplicar un límite mediante una query.
router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        let products = await productManager.getProducts();
        if(limit) products = products.slice(0, parseInt(limit));
        
        res.status(200).render('home.hbs', { products });

    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.get('/realtimeproducts', async (req, res) => {
    const { limit } = req.query;
    try {
        let products = await productManager.getProducts();
        if(limit) products = products.slice(0, parseInt(limit));
        
        res.status(200).render('realTimeProducts.hbs', { products });

    } catch (err) {
        res.status(500).send(err.message);
    }
})

export default router;