export default class TicketResDTO {
    constructor(dbTicket) {
        this.id = dbTicket._id;
        this.code = dbTicket.code;
        this.amount = dbTicket.amount;
        this.purchaser = dbTicket.purchaser;
        this.purchase_datetime = dbTicket.created_at;
    }
}