import express from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(verifyJWT);

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);

export default router;