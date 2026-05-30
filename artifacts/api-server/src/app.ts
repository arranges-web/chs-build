import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// Cookies must come BEFORE any auth middleware so cookies are parsed.
app.use(cookieParser());
// CORS needs `credentials: true` so the browser sends our session
// cookie. The exact same-origin deploys (Replit) don't need an
// allowlist; for split origins we'd configure `origin` here.
app.use(cors({ credentials: true }));
// Photo uploads ship as base64 data URLs (~150 kB after browser-side
// compression), well above the express default of 100 kB. 10 mb leaves
// headroom for multi-photo uploads without ever blocking a legit request.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", router);

export default app;
