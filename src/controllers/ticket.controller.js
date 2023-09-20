import TicketService from "../services/ticket.service.js";
const ticketService = new TicketService();

export default class TicketController {
    
    async getById(req, res) {
        const { id } = req.params;
        try {
            const ticket = await ticketService.getById(id);
            if (!ticket) return res.status(500).json({message: "Something went wrong!"});
    
            return res.status(200).json( ticket );
        } catch (err) {
            console.log(err);
            return res.status(500).redirect('/users/profile')
        }
    }
}