import ProductService from '../services/products.service.js';
const service = new ProductService();
import { formatResponse } from '../helpers/helpers.js'

export const getAll = async (req, res, next) => {
    const { limit, page, sort, category, stock, owner } = req.query;
    const sanitizedQuery = {
        limit: parseInt(limit) || undefined,
        page: parseInt(page) || undefined,
        sort: sort?.match(/(asc)|(desc)/i)[0] || null,
        category: category?.match(/[a-z0-9À-ÿ]*/i)[0] || null,
        stock: (/(existance)|(nonexistance)/i).test(stock) ?
                stock.toLowerCase() :
                (/[0-9]+/i).test(stock) ?
                parseInt(stock) :
                null,
        owner: owner?.match(/[a-z0-9À-ÿ]*/i)[0] || null
    }

    try {
        const response = await service.getAll(sanitizedQuery);
        const resp = formatResponse(200, response, sanitizedQuery, req.baseUrl)
        res.status(200).render('products.hbs', { resp, user: req.user });
    } catch (err) {
        return next(err);
        // res.status(500).json(formatResponse(500, [], null, req.baseUrl));
    }
}

export const getById = async (req, res, next) => {
    const { pid } = req.params;
    
    try {
        const response = await service.getById(pid);
        res.status(200).send(response);
    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}

export const viewDashboard = async (req, res, next) => {
    const { limit, page, sort, category, stock, owner } = req.query;
    const sanitizedQuery = {
        limit: parseInt(limit) || undefined,
        page: parseInt(page) || undefined,
        sort: sort?.match(/(asc)|(desc)/i)[0] || null,
        category: category?.match(/[a-z0-9À-ÿ]*/i)[0] || null,
        stock: (/(existance)|(nonexistance)/i).test(stock) ?
        stock.toLowerCase() :
        (/[0-9]+/i).test(stock) ?
        parseInt(stock) :
        null,
        owner: owner?.match(/[a-z0-9À-ÿ]*/i)[0] || null
    }
    
    try {
        let response;
        if (req.user.role !== 'admin' && req.user.role !== 'premium') return res.status(403).json({ message: 'You\'re not authorized!' });
        if (req.user.role !== 'admin' && req.user.role === 'premium') sanitizedQuery.owner = req.user.id;
        
        response = await service.getAll(sanitizedQuery);
        const resp = formatResponse(200, response, sanitizedQuery, req.baseUrl)
        res.status(200).render('products-dashboard', { resp, user: req.user });
    } catch (err) {
        return next(err);
        // res.status(500).json(formatResponse(500, [], null, req.baseUrl));
    }
}

export const viewAddProduct = async (req, res, next) => {
    res.status(200).render('product-inputs', {title: 'Add Product', user: req.user});
}

export const viewUpdateProduct = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const response = await service.viewUpdateProduct(pid, req.user);

        if (!response.success) return res.status(400).json({message: response.message, data: null})
        res.status(200).render('product-inputs', {title: 'Update Product', product: response.data, user: req.user});
    } catch (err) {
        return next(err);
    }
}

export const create = async (req, res, next) => {
    const product = req.body;
    const user = req.user;

    try {
        const response = await service.create(product, user);
        res.status(200).json({status: 'success', message: `El producto fue agregado exitosamente: ${JSON.stringify(response)}`});
    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}

export const mock = async (req, res, next) => {
    const { quantity } = req.body;
    try {
        const response = await service.mock(quantity); //! HARDCODED
        res.status(200).redirect('/api/products');
    } catch (err) {
        return next(err);
        // res.status(500).json({error: err.message});
    }
}

export const update = async (req, res, next) => {
    const { pid } = req.params;
    const product = req.body;
    const user = req.user;
    
    try {
        const response = await service.update(pid, product, user);
        if (!response.success) return res.status(400).json({message: response.message, data: response.data})
        res.status(200).json({message: response.message, data: { product: response.data }});
    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}

export const remove = async (req, res, next) => {
    const { pid } = req.params;
    const user = req.user;
    
    try {
        const response = await service.remove(pid, user);
        if (!response.success) return res.status(400).json({message: response.message, data: response.data})
        res.status(200).json({message: `Producto eliminado exitósamente.`, data: { product: response }});
    } catch (err) {
        return next(err);
        // res.status(500).send(err.message);
    }
}