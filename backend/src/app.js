import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { FRONTEND_URL } from "../constants.js";
const app = express();

app.use(
  cors({
    origin: `${FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
import authenticationRouter from "./routers/authentication.router.js";
import pasteRouter from "./routers/paste.router.js";
app.use("/", authenticationRouter);
app.use("/", pasteRouter);

export default app;
