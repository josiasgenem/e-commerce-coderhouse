import ProductsResDTO from "../../dtos/products/products.res.dto.js";
import ProductsReqDTO from "../../dtos/products/products.req.dto.js";

export default class ProductsRepository {

    formatFromDB(product) {
        this.product = new ProductsResDTO(product);
        return this.product;
    }
    
    formatToDB(product) {
        this.product = new ProductsReqDTO(product);
        return this.product;
    }

}   