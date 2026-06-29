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
router.use(trackRouter);
// IMPORTANT: adminAuthRouter MUST come before adminCustomersRouter
// and adminAnalyticsRouter. Those two each register
// `router.use("/admin", adminAuth)` at their top, which means every
// /admin/* request hits their auth gate first if their sub-router is
// matched ahead of adminAuthRouter. The invite-lookup endpoint
// (`GET /admin/auth/invites/:token`) is intentionally public — a
// recipient clicking an invite link is, by definition, not signed
// in yet. When the gated routers ran first, that recipient would
// get a 401 long before reaching the public route, and the
// /admin/join page surfaced it as "invite link invalid".
router.use(adminAuthRouter);
router.use(adminCustomersRouter);
router.use(adminAnalyticsRouter);

export default router;
