import { NotFoundError, ServerError } from "../config/errors.js";
import { ticketsDao } from "../persistence/factory.js";
import TicketsRepository from "../persistence/repository/ticket/ticket.repository.js";
const ticketRepository = new TicketsRepository();


export default class TicketService {

    async getAll({ limit = 10, page = 1, sort }) {
        try {
            sort === 'asc' ? sort = 1 :
            sort === 'desc' ? sort = -1 : sort = null;
    
            const response = await ticketsDao.getMany(query, { limit, page, sort, lean: true });
            response.docs = response.docs.map(doc => doc = ticketRepository.formatFromDB(doc));
            return response;
        } catch (err) {
            return next(err);
            // console.log(err, '---> getMany:ticketService');
        }
    }
    
    async getById(id) {
        try {
            const response = await ticketsDao.getById(id);
            if (!response) throw NotFoundError(`Cart with ID ${id} does not exist!`)
            const repositoryResp = ticketRepository.formatFromDB(response);
            return repositoryResp;
        } catch (err) {
            return next(err);
            // console.log(err, '---> getById:ticketService');
        }
    }
    
    async create({amount, purchaser}) {
        try {
            const code = this.#generateCode();
            const formattedTicket = ticketRepository.formatToDB({amount, purchaser, code})
            
            const response = await ticketsDao.create(formattedTicket);
            if (!response) throw new ServerError('Ticket couldn\'t be created.');

            const repositoryResp = ticketRepository.formatFromDB(response);
            return repositoryResp;
        } catch (err) {
            return next(err);
            // console.log(err, '---> create:ticketService');
        }
    }
    
    async remove(id) {
        try {
            const response = await ticketsDao.remove(id);
            if (!response) throw new ServerError(`Ticket with ID ${id} couldn\'t be deleted!`)
            const repositoryResp = ticketRepository.formatFromDB(response);
            return repositoryResp;
        } catch (err) {
            return next(err);
            // console.log(err, '---> remove:ticketService');
        }
    }

    #generateCode(length = 5) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const date = new Date(),
            year = date.getUTCFullYear(),
            month = ('0' + (date.getUTCMonth() +1)).slice(-2),
            day = date.getUTCDate(),
            fullDate = [year, month, day].join('');

        let result = fullDate;
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}