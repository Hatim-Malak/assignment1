import express from "express";
import { 
    getAllClients, 
    getClientById, 
    createClient, 
    updateClient, 
    deleteClient 
} from "../controllers/client.controller.js";
import { authenticateToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createClientSchema, updateClientSchema } from "../validators/client.validator.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", requireRole(['Admin', 'Project Manager']), getAllClients);
router.get("/:id", requireRole(['Admin', 'Project Manager']), getClientById);

router.post("/", requireRole(['Admin']), validate(createClientSchema), createClient);
router.put("/:id", requireRole(['Admin']), validate(updateClientSchema), updateClient);
router.delete("/:id", requireRole(['Admin']), deleteClient);

export default router;
