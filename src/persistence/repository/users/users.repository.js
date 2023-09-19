import UsersReqDTO from "../../dtos/users/users.req.dto.js";
import UsersResDTO from "../../dtos/users/users.res.dto.js";

export default class UsersRepository {

    formatFromDB(user) {
        this.user = new UsersResDTO(user);
        return this.user;
    }
    
    formatToDB(user) {
        this.user = new UsersReqDTO(user);
        return this.user;
    }
}