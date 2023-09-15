import ProductDaoMongoDB from "../daos/mongodb/products.dao.js";
import ProductDaoFileSystem from "../daos/filesystem/products.dao.js";

let productDao;
if (process.env.DB_SYSTEM === 'MONGODB') productDao = new ProductDaoMongoDB();
if (process.env.DB_SYSTEM === 'FILESYSTEM') productDao = new ProductDaoFileSystem('./src/daos/filesystem/productos.json');

export const getAll = async ({ limit = 10, page = 1, sort, category = null, stock = null }) => {
    try {
        sort === 'asc' ? sort = 1 :
        sort === 'desc' ? sort = -1 : sort = null;
        
        const query = {};
        if (category) query.category = category;
        if (stock) {
            if (typeof stock === 'string' && stock === 'existance') query.stock = { $gt: 0 };
            if (typeof stock === 'string' && stock === 'nonexistance') query.stock = { $eq: 0 };
            if (typeof stock === 'number') query.stock = { $eq: stock };
        }

        const response = await productDao.getAll(query, { limit, page, sort });
        return response;
    } catch (err) {
        console.log(err, '---> getAll:productService');
    }
}

export const getById = async (id) => {
    try {
        const response = await productDao.getById(id);
        if (!response) return {
            message: "Not Found!",
            status: 404
        }
        return response;
    } catch (err) {
        console.log(err, '---> getById:productService');
    }
}

export const create = async (product) => {
    try {
        const response = await productDao.create(product);
        return response;
    } catch (err) {
        console.log(err, '---> create:productService');
    }
}

export const update = async (id, productUpd) => {
    try {
        const response = await productDao.update(id, productUpd);
        return response;
    } catch (err) {
        console.log(err, '---> update:productService');
    }
}

export const remove = async (id) => {
    try {
        const response = await productDao.remove(id);
        return response;
    } catch (err) {
        console.log(err, '---> remove:productService');
    }
}

export const isAvailable = async (id, qty = 1) => {
    try {
        const product = await getById(id);
        if (!product || product.status === 404 || product.stock < qty) return false;
        return true;
    } catch (err) {
        console.log(err, '---> isAvailable:productService');
        return false;
    }
}