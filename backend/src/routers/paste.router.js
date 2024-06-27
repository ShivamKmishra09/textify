import { Router } from "express";
import {
  paste,
  getPaste,
  getUserDetails,
  editPaste,
} from "../controllers/paste.controller.js";

import { checkForUserAuthentication } from "../middleware/auth.middleware.js";

const router = Router();
router
  .route("/loggedin/:user_id/paste")
  .post(checkForUserAuthentication, paste);
router.get("/get/:uid/:pasteId", getPaste);
router.get("/user/:uid", getUserDetails);
router.post("/update/:uid/:pasteId", editPaste);
export default router;
