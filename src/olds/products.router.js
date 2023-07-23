import { Router } from 'express';
const router = Router();

import { ProductManager } from '../controllers/productManager.js';
const productManager = new ProductManager('./src/helpers/productos.json')

router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        let products = await productManager.getProducts();
        if(limit) products = products.slice(0, parseInt(limit));
        
        res.status(200).send(products);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        let product;
        
        if(parseInt(pid)) product = await productManager.getProductById(parseInt(pid));
    
        res.status(200).send(product);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.post('/', async (req, res) => {
    const product = req.body;
    try {
        const response = await productManager.addProduct(product);
        res.status(200).send(`El producto fue agregado exitosamente: ${JSON.stringify(response)}`);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = req.body;
    try {
        const response = await productManager.updateProduct(parseInt(pid), product);
        res.status(200).send(`El producto fue actualizado exitosamente. Producto actualizado ${JSON.stringify(response)}`);

    } catch (err) {
        res.status(500).send(err.message);
    }
    
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        const response = await productManager.deleteProduct(parseInt(pid));
        res.status(200).send(`Producto eliminado exitósamente. Producto eliminado: ${JSON.stringify(response)}.`);
    
    } catch (err) {
        res.status(500).send(err.message);
    }
})

export default router;