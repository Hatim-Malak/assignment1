import express from "express";
import { 
    getAllClients, 
    getClientById, 
    createClient, 
    updateClient, 
    deleteClient 
} from "../controllers/client.controller.js";
import { authenticateToken, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", requireRole(['Admin', 'Project Manager']), getAllClients);
router.get("/:id", requireRole(['Admin', 'Project Manager']), getClientById);

router.post("/", requireRole(['Admin']), createClient);
router.put("/:id", requireRole(['Admin']), updateClient);
router.delete("/:id", requireRole(['Admin']), deleteClient);

export default router;
