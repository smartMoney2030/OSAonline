import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import adminLoginRouter from "./adminLogin.js";
import eventsRouter from "./events.js";
import businessesRouter from "./businesses.js";
import businessSubmissionsRouter from "./businessSubmissions.js";
import contactRouter from "./contact.js";
import aboutUsRouter from "./aboutUs.js";
import uploadRouter from "./upload.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminLoginRouter);
router.use(eventsRouter);
router.use(businessesRouter);
router.use(businessSubmissionsRouter);
router.use(contactRouter);
router.use(aboutUsRouter);
router.use(uploadRouter);

export default router;
