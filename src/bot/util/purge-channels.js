import { Permissions } from "discord.js";

export async function PurgeChannels(g) {
  let textChannelCounter = 0;
  let voiceChannelCounter = 0;
  if (g.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
    await g.channels.fetch().then((channels) =>
      channels.map((ch) => {
        ch.deletable && ch.delete();
        ch.isText() ? textChannelCounter++ : voiceChannelCounter++;
      })
    );
  }
  return [textChannelCounter, voiceChannelCounter];
}
