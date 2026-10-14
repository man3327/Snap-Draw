import { Router } from "express";

import {
  createRoom,
  joinRoom,
  getRoom
} from "../controllers/room.controller.js";

const router = Router();

router.post("/", createRoom);
router.post("/join", joinRoom);
router.get("/:roomId", getRoom);

export default router;
