import TicketResDTO from "../../dtos/ticket/ticket.res.dto.js";
import TicketReqDTO from "../../dtos/ticket/ticket.req.dto.js";

export default class TicketsRepository {

    formatFromDB(ticket) {
        this.ticket = new TicketResDTO(ticket);
        return this.ticket;
    }
    
    formatToDB(ticket) {
        this.ticket = new TicketReqDTO(ticket);
        return this.ticket;
    }

}   