import * as service from '../services/products.service.js';

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
    const { pid } = req.params;

    try {
        const response = await service.getById(pid);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const create = async (req, res) => {
    const product = req.body;

    try {
        const response = await service.create(product);
        res.status(200).send(`El producto fue agregado exitosamente: ${JSON.stringify(response)}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const update = async (req, res) => {
    const { pid } = req.params;
    const product = req.body;
    
    try {
        const response = await service.update(pid, product);
        res.status(200).send(`El producto fue actualizado exitosamente. Producto actualizado ${JSON.stringify(response)}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const remove = async (req, res) => {
    const { pid } = req.params
    
    try {
        const response = await service.remove(pid);
        res.status(200).send(`Producto eliminado exitósamente. Producto eliminado: ${JSON.stringify(response)}.`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}