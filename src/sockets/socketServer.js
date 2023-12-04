import { Server } from 'socket.io';
import { ProductManager } from '../helpers/productManager.js';
const productManager = new ProductManager('./src/helpers/productos.json');


export function io(httpServer) {
    const socketServer = new Server(httpServer);

    socketServer.on('connection', (socket) => {
        console.log("Nuevo cliente conectado!", socket.id);

        const emitProducts = async () => socketServer.emit('productsUpdated', await productManager.getProducts());

        socket.on('addProduct', async (product) => {
            try {
                await productManager.addProduct(product);
                emitProducts();    
            } catch (err) {
                console.log(err);
            }
        })
        
        socket.on('delProduct', async (pid) => {
            try {
                await productManager.deleteProduct(pid)
                emitProducts();
            } catch (err) {
                console.log(err);
            }
        })
    })

    return socketServer;
}

