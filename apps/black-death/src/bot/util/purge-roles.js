import { Permissions } from "discord.js";

export async function PurgeRoles(g) {
  let rolesCounter = 0;
  if (g.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
    await g.roles.fetch().then((roles) =>
      roles.map((role) => {
        role.editable &&
          role.name !== "@everyone" &&
          role.delete() &&
          rolesCounter++;
      })
    );
  }
  return rolesCounter;
}
