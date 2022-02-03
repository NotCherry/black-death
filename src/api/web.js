const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Koa = require("koa");
const router = require("@koa/router")();
const app = new Koa();
const bodyParser = require("koa-bodyparser");
require("dotenv").config();

const PORT = process.env.PORT || 3000

app.use(bodyParser());

router.get("/", async (ctx, next) => {
  ctx.body = await prisma.deathStats.findMany()
})

router.get("/emojis", async (ctx, next) => {
  ctx.body = await prisma.emojis.findMany();
});
router.get("/emojis/:serverId", async (ctx, next) => {
  let { serverId } = ctx.params;
  ctx.body = await prisma.emojis.findMany({ where: { serverId: serverId } });
});

router.get("/dethbringers", async (ctx, next) => {
  ctx.body = await prisma.deathbringer.findMany()
})
router.get("/servers", async (ctx, next) => {
  ctx.body = await prisma.purgedServer.findMany()
})

app.use(router.routes());
app.listen(PORT)

console.log(`Server running: http://localhost:${PORT}`)
