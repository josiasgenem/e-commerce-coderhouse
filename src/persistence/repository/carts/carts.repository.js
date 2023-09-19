import CartsResDTO from "../../dtos/carts/carts.res.dto.js";
import CartsReqDTO from "../../dtos/carts/carts.req.dto.js";

export default class CartsRepository {

    formatFromDB(cart) {
        this.cart = new CartsResDTO(cart);
        return this.cart;
    }
    
    formatToDB(cart) {
        this.cart = new CartsReqDTO(cart);
        return this.cart;
    }
}