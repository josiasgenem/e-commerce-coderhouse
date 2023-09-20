import { DB_ENGINE } from '../config/environment.js';
/* -------------------------------------------------------------------------- */
import ProductsDaoFileSystem from './daos/filesystem/products.dao.js';
import CartsDaoFileSystem from './daos/filesystem/carts.dao.js';
/* -------------------------------------------------------------------------- */
import { initMongoDB } from './daos/mongodb/mongoConnection.js';
import ProductsDaoMongoDB from './daos/mongodb/products.dao.js';
import CartsDaoMongoDB from './daos/mongodb/carts.dao.js';
import UsersDaoMongoDB from './daos/mongodb/users.dao.js';
import TicketDaoMongoDB from './daos/mongodb/ticket.dao.js';


let productsDao,
    cartsDao,
    usersDao,
    ticketsDao;

const DB_ENGINE_CLI = process.argv[2];
let dbEngineSelected = DB_ENGINE_CLI === 'MONGODB' || DB_ENGINE_CLI === 'FILESYSTEM' ?
    DB_ENGINE_CLI :
    DB_ENGINE;

if (dbEngineSelected === 'MONGODB') {
    initMongoDB();
    productsDao = new ProductsDaoMongoDB();
    cartsDao = new CartsDaoMongoDB();
    usersDao = new UsersDaoMongoDB();
    ticketsDao = new TicketDaoMongoDB();
}

if (dbEngineSelected === 'FILESYSTEM') {
    productsDao = new ProductsDaoFileSystem('./src/persistence/daos/filesystem/productos.json');
    cartsDao = new CartsDaoFileSystem('./src/persistence/filesystem/carrito.json');
}

export { usersDao, productsDao, cartsDao, ticketsDao };