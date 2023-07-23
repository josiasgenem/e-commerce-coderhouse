import fs from 'fs';

export class ProductDaoFileSystem {
    
    constructor(path) {
        this.path = path;
    }
    
    async getAll(limit) {
        limit = parseInt(limit);
        try {
            // Retorna todos los productos en un Array.
            // Si el archivo está vacío o contiene un error retorna un array vacío.
            const json = await fs.promises.readFile(this.path, 'utf-8');
            if(json) {
                let fileProducts = await JSON.parse(json);
                if(limit) fileProducts = [...fileProducts.slice(0, limit)];
                // console.log("---> getProducts", [...fileProducts]);
                return [...fileProducts];
            }
            // console.log("---> getProducts Vacío", []);
            return [];
            
        } catch (err) {
            // El archivo con el path dado no existe. Por lo que devuelve un array vacío de los productos.
            if(err.code === "ENOENT") {
                // console.log("---> getProducts Error", `El archivo con el path "${this.path}" no existe.`, err);
                return [];
            }
            // console.log("---> getProducts Error", "Ocurrió un error al intentar conectarse con la DB. Vuelva a intentarlo!", err);
            return [];
        }
    }
    
    async getById(id) {
    id = parseInt(id);

        const products = await this.getAll();
        const product = products.filter(product => product.id === id);
        
        // Si no existe retorna un array vacío.
        if (product.length === 0) {
            throw new Error(`El producto con id ${id} no existe`)
        }
        
        // Retorna el producto buscado por Id como objeto.
        // console.info("---> getProductById", `El producto con Id ${id} es:`, product[0]);
        return product[0];
    }

    async create(product) {
        try {
            // Verifica si el producto está completo.
            this.#isCompleteProduct(product)

            // Obtiene los productos del archivo.
            const products = await this.getAll();
            
            // Verifica que el código del producto a ingresar no exista previamente.
            this.#isUniqueCode(product.code, products)
            
            // Agrega el producto como objeto al array y actualiza el archivo completo.
            product = {
                id: this.#getId(products),
                ...product
            }
            products.push(product);
            await this.#updateFileProducts(products);
            
            // Devuelve el producto
            // console.info("---> addProduct", "El producto fue agregado exitósamente", product);
            return product;
            
        } catch (err) {
            throw new Error(`---> addProduct error. El producto no se pudo agregar: ${err}`);
        }
    }
    
    async update(id, productUpd) {
        id = parseInt(id);
        try {
            const products = await this.getAll();
            
            // Verifica si el producto está completo y si tiene un código único.
            this.#isCompleteProduct(productUpd);
            this.#isUniqueCode(productUpd.code, products, id);
            
            const newProductsList = products.map(product => {
                if(product.id === id) {
                    return { 
                        id,
                        ...productUpd
                    }
                }
                return product;
            })
            

            await this.#updateFileProducts(newProductsList);
            
            // Devuelve el producto actualizado.
            // console.info("---> updateProduct", "El producto fue actualizado exitósamente", productUpd);
            return {id, ...productUpd};

        } catch (err) {
            throw new Error(err.message);
        }
    }

    async remove(id) {
        id = parseInt(id);
        
        try {
            const products = await this.getAll();
            const productDeleted = products.filter(product => product.id === id);
            const newProductsList = products.filter(product => product.id !== id);
            // console.log("---> deleteProduct", "Producto eliminado:", newProductsList);
            
            await this.#updateFileProducts(newProductsList);
            if (productDeleted.length === 0) throw new Error('El producto no fue encontrado!')
            // console.log("---> deleteProduct", "El producto fue eliminado exitósamente")
            return productDeleted
        } catch (err) {
            throw new Error(`El producto con id: ${id} no pudo ser eliminado.`);
        }
    }
    
    #getId(fileProducts){
        // Busca el Id mayor (número entero) y retorna el entero que le sigue.
        let maxId = 0;
        // console.log("---> #getId", fileProducts);
        if(fileProducts.length > 0) {
            fileProducts.forEach(product => { if(product.id > maxId) maxId = product.id })
        }
        return ++maxId;
    }
    
    #isCompleteProduct({ id, title, description, price, code, status , stock, category, thumbnails }) {
        // Verifica que se hayan ingresado todos los campos requeridos.
        if (!title || typeof title !== 'string' ||
            !description || typeof description !== 'string' ||
            !code || typeof code !== 'string' ||
            !price || typeof price !== 'number' ||
            /* !status ||  */typeof status !== 'boolean' ||
            !stock || typeof stock !== 'number' ||
            !category || typeof category !== 'string' ||
            (thumbnails && typeof thumbnails !== 'object') ||
            id) {

            throw new Error("El producto que ingresó es erróneo o está incompleto. Por favor, ingrese 'title' (String), 'description' (String), 'price' (Number), 'code' (String), 'status' (Boolean), 'stock' (Number) y 'thumbnails' (Array).");
        }
        return true;
    }

    #isUniqueCode(code, productsList, updId){
        // Corrobora si el código del producto ingresado se repite en algún producto existente.
        // Además, contempla si se está queriendo actualizar un producto y no lo toma como código repetido.
        if (productsList.some(product => product.code === code && updId && product.id !== updId)) throw new Error("El código que ingresó ya existe en otro producto! Debe ser único!");
        return true;
    }

    async #updateFileProducts(newProductsList) {
        // Actualiza todos los productos reemplazando el contenido del archivo.
        try {
            const json = await JSON.stringify(newProductsList)
            await fs.promises.writeFile(this.path, json);
            return newProductsList;
        } catch (err) {
            console.log("---> updateFileProducts", "Ocurrió un error al actualizar lor productos.", err);
        }
    }
}

/* ----------------------------- Test Propio ------------------------------------- */

/*
const productManager = new ProductManager('./helpers/usuarios.json');

(async function() {
    await productManager.addProduct({
        title: "Zapatillas Adidas", 
        description: "Zapatillas para correr en asfalto", 
        price: 60000, 
        thumbnail: "https://media.solodeportes.com.ar/media/catalog/product/cache/7c4f9b393f0b8cb75f2b74fe5e9e52aa/z/a/zapatillas-running-adidas-galaxy-6-gris-100010gw4140001-1.jpg", 
        code: "4567", 
        stock: 20
    });
    await productManager.addProduct({
        title: "Zapatillas Nike", 
        description: "Zapatillas para correr en asfalto", 
        price: 55000, 
        thumbnail: "https://www.sport.es/labolsadelcorredor/wp-content/uploads/2022/03/02-Nike-Air-Zoom-Pegasus-38.jpg", 
        code: "9867", 
        stock: 20
    });
    await productManager.addProduct({
        title: "Pelota Adidas", 
        description: "Pelota de futbol", 
        price: 30000, 
        thumbnail: "https://sporting.vtexassets.com/arquivos/ids/557628-800-800?v=637928169669670000&width=800&height=800&aspect=true", 
        code: "7534", 
        stock: 30
    });
    

    await productManager.getProductById(1);

    await productManager.updateProduct(1, {
        title: "Zapatillas Adidas",
        description: "Zapatillas running",
        price: 65000,
        thumbnail: "https://media.solodeportes.com.ar/media/catalog/product/cache/7c4f9b393f0b8cb75f2b74fe5e9e52aa/z/a/zapatillas-running-adidas-galaxy-6-gris-100010gw4140001-1.jpg",
        code: "4567",
        stock: 15
    })

    await productManager.getProducts()


    await productManager.deleteProduct(2);

})()
*/