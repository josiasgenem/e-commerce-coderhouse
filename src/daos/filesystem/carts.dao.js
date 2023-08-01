import fs from 'fs';

export default class CartsDaoFileSystem {
    
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    async getAll({limit}) {

        // TODO: Cambió y ahora recibe una query, no un 'limit'. Refactorizar!

        try {
            // Retorna todos los carritos en un Array.
            // Si el archivo está vacío o contiene un error retorna un array vacío.
            const json = await fs.promises.readFile(this.path, 'utf-8');
            if(json) {
                let fileCarts = await JSON.parse(json);
                if (limit) fileCarts = [...fileCarts.slice(0, parseInt(limit))];
                // console.log("---> getCarts", [...fileCarts]);
                return [...fileCarts];
            }
            // console.log("---> getCarts Vacío", []);
            return [];
            
        } catch (err) {
            // El archivo con el path dado no existe. Por lo que devuelve un array vacío de los carritos.
            if(err.code === "ENOENT") {
                // console.log("---> getCarts Error", `El archivo con el path "${this.path}" no existe.`, err);
                return [];
            }
            // console.log("---> getCarts Error", "Ocurrió un error al intentar conectarse con la DB. Vuelva a intentarlo!", err);
            return [];
        }
    }

    async getById(id) {
        id = parseInt(id);
        const carts = await this.getAll();
        const cart = carts.filter(cart => cart.id === id);
        
        // Si no existe retorna un array vacío.
        if (cart.length === 0) {
            return {
                error: "Cart Not Found!",
                cartId: id
            }
        }
        
        // Retorna el carrito buscado por Id como objeto.
        // console.info("---> getCartById", `El carrito con Id ${id} es:`, cart[0]);
        return cart[0];
    }

    async create(products) {
        try {
            // Obtiene los carritos del archivo.
            const carts = await this.getAll();
            const newCart = {
                id: this.#getId(carts),
                products
            }
    
            carts.push(newCart);
            await this.#updateFileCarts(carts);
    
            return newCart;
            
        } catch (err) {
            throw new Error(`---> addCart error. El carrito no se pudo agregar: ${err}`);
        }
    }

    async updateProducts(cid, products) {
        cid = parseInt(cid);
        products = products.map(product => {
            product.product = parseInt(product.product);
            return product;
        })

        try {
            const carts = await this.getAll();
            const newCartsList = carts.map(cart => {
                if(cart.id === cid) cart.products = products;
                
                // Busca el carrito y verifica que no esté vacío.
                // let hasProduct = false;
                // Busca si tiene el producto, y agrega una unidad del mismo.
                // if (cart.id === parseInt(cid) && cart.products.length > 0) {
                //     for (let i = 0; i < cart.products.length; i++) {
                //         if (cart.products[i].product === parseInt(pid)) {
                //             cart.products[i].quantity++    
                //             hasProduct = true;
                //             break;
                //         } 
                //     }
                // }
                // // Si NO tiene el producto, lo agrega con una sola unidad.
                // if (cart.id === parseInt(cid) && !hasProduct) {
                //     cart.products.push({ product: parseInt(pid), quantity: 1 });
                // }
                return cart;
            });

            await this.#updateFileCarts(newCartsList);
            return newCartsList;
    
        } catch (err) {
            throw new Error(`---> addProductToCart error. El producto no se pudo agregar al carrito: ${err}`);
        }
    }

    async remove(id) {
        id = parseInt(id);
        try {
            const carts = await this.getAll();
            const cartDeleted = carts.filter(cart => cart.id === id);
            const newCartsList = carts.filter(cart => cart.id !== id);
            // console.log("---> deleteCart", "Carrito eliminado:", newCartsList);
            
            await this.#updateFileCarts(newCartsList);
            if (cartDeleted.length === 0) throw new Error('El carrito no fue encontrado!')
            // console.log("---> deleteCart", "El carrito fue eliminado exitósamente")
            return cartDeleted
        } catch (err) {
            console.log(err);
        }
    }

    #getId(fileCarts){
        // Busca el Id mayor (número entero) y retorna el entero que le sigue.
        let maxId = 0;
        // console.log("---> #getId", fileCarts);
        if(fileCarts.length > 0) {
            fileCarts.forEach(cart => { if(cart.id > maxId) maxId = cart.id })
        }
        return ++maxId;
    }

    async #updateFileCarts(newCartsList) {
        // Actualiza todos los carritos reemplazando el contenido del archivo.
        try {
            const json = await JSON.stringify(newCartsList)
            await fs.promises.writeFile(this.path, json);
            return newCartsList;
        } catch (err) {
            console.log("---> updateFileCarts", "Ocurrió un error al actualizar los carritos.", err);
        }
    }
}