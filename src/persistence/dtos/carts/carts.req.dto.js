export default class CartsReqDTO {
    constructor(cart) {
        this._id = cart.id;
        this.products = cart.products.map(cartElement => {
            return {
                product: typeof cartElement.product === 'string' ?
                    cartElement.product :
                    cartElement.product.id,
                quantity: cartElement.quantity
            }
        })
    }
}