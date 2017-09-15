import userRoutes from "./Users/user.route";
import taskRoutes from "./Tasks/task.route";
import express from "express";

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;