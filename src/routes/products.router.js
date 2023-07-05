import { socketServer } from '../server.js';
import { Router } from 'express';
const router = Router();

import { ProductManager } from '../helpers/productManager.js';
const productManager = new ProductManager('./src/helpers/productos.json')

// Devuelve una lista con todos los productos. Se puede aplicar un límite mediante una query.
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

// Devuelve un producto por id.
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

// Crea un producto.
router.post('/', async (req, res) => {
    const product = req.body;
    try {
        const response = await productManager.addProduct(product);
        
        socketServer.emit('productsUpdated', "Productos Actualizados!");
        res.status(200).send(`El producto fue agregado exitosamente: ${JSON.stringify(response)}`);
        
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// Actualiza un producto por id.
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = req.body;
    try {
        const response = await productManager.updateProduct(parseInt(pid), product);
        
        socketServer.emit('productsUpdated', "Productos Actualizados!");
        res.status(200).send(`El producto fue actualizado exitosamente. Producto actualizado ${JSON.stringify(response)}`);
        
    } catch (err) {
        res.status(500).send(err.message);
    }
    
})

// Elimina un producto por id.
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        const response = await productManager.deleteProduct(parseInt(pid));
        
        socketServer.emit('productsUpdated', "Productos Actualizados!");
        res.status(200).send(`Producto eliminado exitósamente. Producto eliminado: ${JSON.stringify(response)}.`);
    
    } catch (err) {
        res.status(500).send(err.message);
    }
})

export default router;