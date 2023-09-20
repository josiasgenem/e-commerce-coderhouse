import { MongoDao } from './mongoDB.dao.js';
import { TicketModel } from './models/ticket.model.js'

export default class TicketDao extends MongoDao {
    constructor() {
        super(TicketModel);
    }
}