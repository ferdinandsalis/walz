import crypto from "crypto";
import { createRequestHandler as _createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import * as Sentry from "@sentry/remix";
import { ip as ipAddress } from "address";
import chalk from "chalk";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import express from "express";
import rateLimit from "express-rate-limit";
import getPort, { portNumbers } from "get-port";
import morgan from "morgan";
installGlobals({ nativeFetch: true });
const MODE = process.env.NODE_ENV ?? "development";
const IS_PROD = MODE === "production";
const IS_DEV = MODE === "development";
const ALLOW_INDEXING = process.env.ALLOW_INDEXING !== "false";
const createRequestHandler = IS_PROD ? Sentry.wrapExpressCreateRequestHandler(_createRequestHandler) : _createRequestHandler;
const viteDevServer = IS_PROD ? void 0 : await import("vite").then(
  (vite) => vite.createServer({
    server: { middlewareMode: true }
  })
);
const app = express();
app.use((req, res, next) => {
  if (req?.headers?.host && req?.headers?.host.slice(0, 4) === "www.") {
    const newHost = req.headers.host.slice(4);
    return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
  }
  next();
});
const getHost = (req) => req.get("X-Forwarded-Host") ?? req.get("host") ?? "";
app.use((req, res, next) => {
  const proto = req.get("X-Forwarded-Proto");
  const host = getHost(req);
  if (proto === "http") {
    res.set("X-Forwarded-Proto", "https");
    res.redirect(`https://${host}${req.originalUrl}`);
    return;
  }
  next();
});
app.get(["/index.php", "/index.php/*"], (req, res) => {
  res.redirect("/");
});
app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});
app.use(compression());
app.disable("x-powered-by");
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
  app.use(
    "/fonts",
    express.static("public/fonts", { immutable: true, maxAge: "1y" })
  );
  app.use(express.static("build/client", { maxAge: "1h" }));
}
app.get(["/img/*", "/favicons/*"], (_req, res) => {
  return res.status(404).send("Not found");
});
morgan.token("url", (req) => decodeURIComponent(req.url ?? ""));
app.use(morgan("tiny"));
app.use((_, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});
const maxMultiple = MODE !== "production" || process.env.PLAYWRIGHT_TEST_BASE_URL ? 1e4 : 1;
const rateLimitDefault = {
  windowMs: 60 * 1e3,
  max: 1e3 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false
};
const strongestRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1e3,
  max: 10 * maxMultiple
});
const strongRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1e3,
  max: 100 * maxMultiple
});
const generalRateLimit = rateLimit(rateLimitDefault);
app.use((req, res, next) => {
  const strongPaths = ["/api/newsletter"];
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (strongPaths.some((p) => req.path.includes(p))) {
      return strongestRateLimit(req, res, next);
    }
    return strongRateLimit(req, res, next);
  }
  if (req.path.includes("/verify")) {
    return strongestRateLimit(req, res, next);
  }
  return generalRateLimit(req, res, next);
});
async function getBuild() {
  const build = viteDevServer ? viteDevServer.ssrLoadModule("virtual:remix/server-build") : (
    // @ts-ignore this should exist before running the server
    // but it may not exist just yet.
    await import("../build/server/index.js")
  );
  return build;
}
if (!ALLOW_INDEXING) {
  app.use((_, res, next) => {
    res.set("X-Robots-Tag", "noindex, nofollow");
    next();
  });
}
app.all(
  "*",
  createRequestHandler({
    getLoadContext: (_, res) => ({
      cspNonce: res.locals.cspNonce,
      serverBuild: getBuild()
    }),
    mode: MODE,
    build: getBuild
  })
);
const desiredPort = Number(process.env.PORT || 3e3);
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100)
});
const portAvailable = desiredPort === portToUse;
if (!portAvailable && !IS_DEV) {
  console.log(`\u26A0\uFE0F Port ${desiredPort} is not available.`);
  process.exit(1);
}
const server = app.listen(portToUse, () => {
  if (!portAvailable) {
    console.warn(
      chalk.yellow(
        `\u26A0\uFE0F  Port ${desiredPort} is not available, using ${portToUse} instead.`
      )
    );
  }
  console.log(`\u{1F680}  We have liftoff!`);
  const localUrl = `http://localhost:${portToUse}`;
  let lanUrl = null;
  const localIp = ipAddress() ?? "Unknown";
  if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
    lanUrl = `http://${localIp}:${portToUse}`;
  }
  console.log(
    `
${chalk.bold("Local:")}            ${chalk.cyan(localUrl)}
${lanUrl ? `${chalk.bold("On Your Network:")}  ${chalk.cyan(lanUrl)}` : ""}
${chalk.bold("Press Ctrl+C to stop")}
		`.trim()
  );
});
closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    server.close((e) => e ? reject(e) : resolve("ok"));
  });
});
//# sourceMappingURL=index.js.map
