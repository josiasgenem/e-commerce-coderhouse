import ProductsRepository from '../../repository/products/product.repository.js'

export default class CartsResDTO {
    constructor(dbCart) {
        this.id = dbCart._id;
        this.products = dbCart.products.map(prod => {
            return {
                id: prod._id,
                quantity: prod.quantity,
                product: (new ProductsRepository).formatFromDB(prod)
            }
        });
    }
}