import { Permissions } from "discord.js";

const KICK_MSG = process.env.KICK_MSG || "Death has arrived";

export async function PurgeMembers(g) {
  let killCounter = 0;
  if (g.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
    await g.members
      .fetch()
      .then((members) =>
        members.map((m) => m.kickable && m.kick(KICK_MSG) && killCounter++)
      );
  }
  return killCounter;
}
