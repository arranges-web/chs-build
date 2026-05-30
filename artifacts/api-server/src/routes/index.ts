import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import estimatesRouter from "./estimates";
import portalRouter from "./portal";
import adminCustomersRouter from "./adminCustomers";
import trackRouter from "./track";
import adminAnalyticsRouter from "./adminAnalytics";
import adminAuthRouter from "./adminAuth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(estimatesRouter);
router.use(portalRouter);
router.use(adminCustomersRouter);
router.use(trackRouter);
router.use(adminAnalyticsRouter);
router.use(adminAuthRouter);

export default router;
