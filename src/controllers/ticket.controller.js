import TicketService from "../services/ticket.service.js";
const ticketService = new TicketService();

export default class TicketController {
    
    async getById(req, res, next) {
        const { id } = req.params;
        try {
            const ticket = await ticketService.getById(id);
            if (!ticket) return res.status(500).json({message: "Something went wrong!"});
    
            return res.status(200).json( ticket );
        } catch (err) {
            return next(err);
        }
    }
}