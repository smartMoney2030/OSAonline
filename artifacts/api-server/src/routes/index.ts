import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import adminLoginRouter from "./adminLogin.js";
import eventsRouter from "./events.js";
import businessesRouter from "./businesses.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminLoginRouter);
router.use(eventsRouter);
router.use(businessesRouter);

export default router;
