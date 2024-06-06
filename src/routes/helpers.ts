import express from "express";
const router = express.Router();
import { ping, getHelpers } from "../controllers/helpers";

router.get("/ping", ping);

router.route("/help").get(getHelpers);

module.exports = router;
