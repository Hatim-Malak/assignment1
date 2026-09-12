import express from "express";
import { 
    getAllProjects, 
    getProjectById, 
    createProject, 
    updateProject, 
    deleteProject 
} from "../controllers/project.controller.js";
import { authenticateToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", requireRole(['Admin', 'Project Manager']), getAllProjects);
router.get("/:id", requireRole(['Admin', 'Project Manager']), getProjectById);

router.post("/", requireRole(['Admin', 'Project Manager']), validate(createProjectSchema), createProject);

router.put("/:id", requireRole(['Admin', 'Project Manager']), validate(updateProjectSchema), updateProject);
router.delete("/:id", requireRole(['Admin', 'Project Manager']), deleteProject);

export default router;
