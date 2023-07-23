import ProductDaoMongoDB from "../daos/mongodb/products.dao.js";
const productDao = new ProductDaoMongoDB();

// import { ProductDaoFileSystem } from "../daos/filesystem/products.dao.js";
// const productDao = new ProductDaoFileSystem('./src/daos/filesystem/productos.json');


export const getAll = async (limit) => {
    const response = await productDao.getAll(parseInt(limit));
    return response;
}

export const getById = async (id) => {
    const response = await productDao.getById(id);
    return response;
}

export const create = async (product) => {
    const response = await productDao.create(product);
    return response;
}

export const update = async (id, productUpd) => {
    const response = await productDao.update(id, productUpd);
    return response;
}

export const remove = async (id) => {
    const response = await productDao.remove(id);
    return response;
}