import ProductsRepository from '../../repository/products/product.repository.js'

export default class CartsResDTO {
    constructor(dbCart) {
        this.id = dbCart._id;
        this.products = dbCart.products.map(cartElement => {
            return {
                // id: cartElem.product._id,
                quantity: cartElement.quantity,
                product: (new ProductsRepository).formatFromDB(cartElement.product)
            }
        });
        this.totalAmount = dbCart.products.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    }
}