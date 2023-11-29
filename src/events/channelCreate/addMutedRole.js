const { muteRole, mainserver } = require('../../../configs/config.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').GuildChannel} channel
 */
module.exports = async (client, channel) => {
	if (channel.guildId != mainserver) return;
	channel.permissionOverwrites.create(muteRole, { SendMessages: false });
};