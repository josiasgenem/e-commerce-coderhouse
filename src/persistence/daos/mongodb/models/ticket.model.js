import mongoose, {Schema} from "mongoose";

const TicketSchema = new Schema({
    code: { type: String, unique: true },
    created_at: { type: Date, default: Date.now() },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
})

export const TicketModel = mongoose.model('Ticket', TicketSchema);