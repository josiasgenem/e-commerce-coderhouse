export default class TicketReqDTO {
    constructor(ticket) {
        this.code = ticket.code;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.created_at = ticket.purchase_datetime;
    }
}