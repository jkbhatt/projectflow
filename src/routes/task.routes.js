import express from "express";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.use(verifyJWT);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId", updateTaskStatus);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;