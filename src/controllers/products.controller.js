import * as service from '../services/products.service.js';
import { formatResponse } from '../helpers/helpers.js'

export const getAll = async (req, res) => {
    const { limit, page, sort, category, stock } = req.query;
    const sanitizedQuery = {
        limit: parseInt(limit) || undefined,
        page: parseInt(page) || undefined,
        sort: sort?.match(/(asc)|(desc)/i)[0] || null,
        category: category?.match(/[a-z0-9À-ÿ]*/i)[0] || null,
        stock: (/(existance)|(nonexistance)/i).test(stock) ?
                stock.toLowerCase() :
                (/[0-9]+/i).test(stock) ?
                parseInt(stock) :
                null
    }

    try {
        const response = await service.getAll(sanitizedQuery);
        const resp = formatResponse(200, response, sanitizedQuery, req.baseUrl)
        res.status(200).render('products.hbs', { resp, user: req.session.user });
        // res.status(200).send(resp);
    } catch (err) {
        res.status(500).json(formatResponse(500, [], null, req.baseUrl));
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