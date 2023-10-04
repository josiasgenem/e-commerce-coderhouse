// import ProductDaoMongoDB from "../daos/mongodb/products.dao.js";
// import ProductDaoFileSystem from "../daos/filesystem/products.dao.js";

// let productDao;
// if (process.env.DB_ENGINE === 'MONGODB') productDao = new ProductDaoMongoDB();
// if (process.env.DB_ENGINE === 'FILESYSTEM') productDao = new ProductDaoFileSystem('./src/daos/filesystem/productos.json');
import { productsDao } from "../persistence/factory.js";
import { NotFoundError } from '../config/errors.js';
import ProductsRepository from "../persistence/repository/products/product.repository.js";
const repository = new ProductsRepository();
import Mocks from "../utils/mocks.js";
const mock = new Mocks();

export default class ProductService {

    async getAll ({ limit = 10, page = 1, sort, category = null, stock = null }) {
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
            
            const response = await productsDao.getMany(query, { limit, page, sort, lean: true });
            response.docs = response.docs.map(doc => doc = repository.formatFromDB(doc));
            return response;
        } catch (err) {
            throw err;
        }
    }
    
    async getById (id) {
        try {
            const response = await productsDao.getById(id);
            if (!response) throw new NotFoundError(`Product with ID ${id} does not exist!`);
            const repositoryResp = repository.formatFromDB(response);
            return repositoryResp;
        } catch (err) {
            throw err;
        }
    }
    
    async create (product) {
        try {
            const response = await productsDao.create(product);
            const repositoryResp = repository.formatFromDB(response);
            return repositoryResp;
        } catch (err) {
            throw err;
        }
    }
    
    async mock (quantity) {
        try {
            const productsMock = mock.products(quantity);
            
            const savedProducts = productsMock.map(async mockProduct => {
                const repositoryReqProduct = repository.formatToDB(mockProduct);
                const dbProduct = await productsDao.create(repositoryReqProduct);
                const repositoryResProduct = repository.formatFromDB(dbProduct);
                return repositoryResProduct;
            })

            return savedProducts;
        } catch (err) {
            throw err;
        }
    }
    
    async update (id, productUpd) {
        try {
            const response = await productsDao.update(id, productUpd);
            const repositoryResp = repository.formatFromDB(response);
            return repositoryResp;
        } catch (err) {
            throw err;
        }
    }
    
    async updateStock (id, newStock) {
        try {
            const response = await productsDao.updateStock(id, newStock);
            // if (!response) return false;
            const repositoryResp = repository.formatFromDB(response);
            return repositoryResp;
        } catch (err) {
            throw err;
        }
    }
    
    async remove (id) {
        try {
            const response = await productsDao.remove(id);
            const repositoryResp = repository.formatFromDB(response);
            return repositoryResp;
        } catch (err) {
            throw err;
        }
    }
    
    async isAvailable (id, qty = 1) {
        try {
            const product = await this.getById(id);
            if (!product || product.stock < qty) return false;
            return true;
        } catch (err) {
            throw err;
        }
    }
}