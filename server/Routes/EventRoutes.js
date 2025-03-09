import express from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventByDate
} from "../Controller/EventController.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.get("/-by-date", getEventByDate);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
