import "dotenv/config.js";

import Koa from "koa";
import KoaRouter from "@koa/router";
import Prisma from "@prisma/client";
import { Server } from "socket.io";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import http from "http";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();
const app = new Koa();
const router = new KoaRouter();

const API_PORT = process.env.API_PORT || 4000;

app.use(cors());
app.use(bodyParser());

router.get("/", async (ctx, next) => {
  ctx.body = await prisma.deathStats.findMany();
});
router.get("/emojis", async (ctx, next) => {
  ctx.body = await prisma.emojis.findMany();
});
router.get("/emojis/:serverId", async (ctx, next) => {
  let { serverId } = ctx.params;
  ctx.body = await prisma.emojis.findMany({ where: { serverId: serverId } });
});
router.get("/dethbringers", async (ctx, next) => {
  ctx.body = await prisma.deathbringer.findMany();
});
router.get("/servers", async (ctx, next) => {
  ctx.body = await prisma.purgedServer.findMany();
});
router.get("/logs", async (ctx, next) => {
  ctx.body = await prisma.log.findMany();
});

app.use(router.routes());

const server = http.createServer(app.callback());
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("log", (msg) => {
    if (msg.key === (process.env.SOCKET_KEY || "")) {
      console.log(process.env.SOCKET_KEY);
      io.emit("log", msg.text);
    }
  });
});

server.listen(API_PORT);
console.log(`Server running: http://localhost:${API_PORT}`);
