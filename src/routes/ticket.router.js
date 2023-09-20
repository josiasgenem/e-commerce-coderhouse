import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";
import { isAuth } from "../middlewares/auth.middlewares.js";

const router = Router();
const controller = new TicketController();

router.get('/:id', isAuth, controller.getById )

export default router;