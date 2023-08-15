import * as service from '../services/carts.service.js';

export const getAll = async (req, res) => {
    try {
        const response = await service.getAll();
        res.status(200).json(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const getById = async (req, res) => {
    const { cid } = req.params;

    try {
        const response = await service.getById(cid);
        if (!response) return res.status(404).json({message: 'Not Found!'})
        console.log('Pas+o después de res en controller');
        return res.status(200).render('cart', {resp: response, user: req.user});
        // res.status(200).json(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const create = async (req, res) => {
    const { products } = req.body;

    try {
        const response = await service.create(products);
        res.status(200).json(response);
    } catch (err) {
        console.log('--->error create cart: ',err);
        res.status(500).send(err.message);
    }
}

export const addProduct = async (req, res) => {
    const { cid, pid } = req.params;
    
    try {
        const response = await service.addProduct(cid, pid);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const updateAllProducts = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    
    try {
        if (!Array.isArray(products)) throw new Error('Invalid Products')

        const response = await service.updateAllProducts(cid, products);
        res.status(200).send(`El carrito fue actualizado exitosamente: ${JSON.stringify(response)}`);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const updateProductQty = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    try {
        if (typeof quantity !== 'number') throw new Error('Invalid Quantity')

        const response = await service.updateProductQty(cid, pid, quantity);
        res.status(200).send(`El producto fue actualizado exitosamente: ${JSON.stringify(response)}`);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const removeProduct = async (req, res) => {
    const { cid, pid } = req.params
    
    try {
        const response = await service.removeProduct(cid, pid);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const removeAllProducts = async (req, res) => {
    const { cid } = req.params
    
    try {
        const response = await service.removeAllProducts(cid);
        res.status(200).send(`El carrito fue vaciado exitósamente. Carrito vacío: ${JSON.stringify(response)}.`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}