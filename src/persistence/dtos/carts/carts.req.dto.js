export default class CartsReqDTO {
    constructor(cart) {
        this._id = cart.id;
        this.products = cart.products.map(prod => prod.id);
    }
}