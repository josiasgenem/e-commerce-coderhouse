export default class ProductsResDTO {
    constructor(dbProduct) {
        this.id = dbProduct._id;
        this.title = dbProduct.title;
        this.description = dbProduct.description;
        this.price = dbProduct.price;
        this.code = dbProduct.code;
        this.status = dbProduct.status;
        this.stock = dbProduct.stock;
        this.category = dbProduct.category;
        this.thumbnails = dbProduct.thumbnails;
        this.owner = dbProduct.owner.toString();
    }
}