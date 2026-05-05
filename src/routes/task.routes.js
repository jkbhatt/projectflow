import express from "express";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.use(verifyJWT);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId", updateTaskStatus);
router.delete("/:taskId", deleteTask);

export default router;