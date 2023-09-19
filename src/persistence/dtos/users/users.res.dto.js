export default class UsersResDTO {
    constructor(dbUser) {
        this.id = dbUser._id;
        this.first_name = dbUser.first_name;
        this.last_name = dbUser.last_name;
        this.email = dbUser.email;
        this.age = dbUser.age;
        this.role = dbUser.role;
        this.password = dbUser.password;
        this.refreshTokens = dbUser.refreshTokens;
        this.cartId = dbUser.cart;
        this.isThirdAuth = dbUser.isThirdAuth;
    }

    sanitize() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            age: this.age,
            role: this.role,
            cartId: this.cartId,
        }
    }
}