import express from "express";
const router = express.Router();
import {
  ping,
  getHelpers,
  getHelper,
  getHelperByLanguage,
  createHelper,
  updateHelper,
  deleteHelper,
  getHelpersByLanguage,
} from "../controllers/helpers";

router.get("/ping", ping);

router.route("/help").get(getHelpers).post(createHelper);

router.get("/help/lang/:language_code", getHelpersByLanguage);

router
  .route("/help/:slug")
  .get(getHelper)
  .put(updateHelper)
  .delete(deleteHelper);

router.get("/help/:slug/:language_code", getHelperByLanguage);

module.exports = router;
