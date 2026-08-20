import { Router, type IRouter } from "express";
import healthRouter from "./health";
import allocationRouter from "./allocation";

const router: IRouter = Router();

router.use(healthRouter);
router.use(allocationRouter);

export default router;
