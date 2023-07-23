import * as service from '../services/carts.service.js';

export const getAll = async (req, res) => {
    const { limit } = req.query;

    try {
        const response = await service.getAll(limit);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const getById = async (req, res) => {
    const { cid } = req.params;

    try {
        const response = await service.getById(cid);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const create = async (req, res) => {
    const { products } = req.body;

    try {
        const response = await service.create(products);
        res.status(200).send(`El carrito fue agregado exitosamente: ${JSON.stringify(response)}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const addProduct = async (req, res) => {
    const { cid, pid } = req.params;
    
    try {
        const response = await service.addProduct(cid, pid);
        res.status(200).send(`El carrito fue actualizado exitosamente: ${JSON.stringify(response)}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const remove = async (req, res) => {
    const { cid } = req.params
    
    try {
        const response = await service.remove(cid);
        res.status(200).send(`El carrito fue eliminado exitósamente. Carrito eliminado: ${JSON.stringify(response)}.`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}