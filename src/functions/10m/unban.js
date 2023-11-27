const Ban = require('../../models/activeBan');
const { mainlog } = require('../../../config.json');
/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const bans = await Ban.where('time').lte(Date.now());
	bans.forEach(ban => {
		client.guilds.cache.get(ban.guildId).bans.remove(ban.userId, 'Ban Duration Ended').then(u => client.channels.cache.get(mainlog).send(`**● Automatic:**\`\`\`diff\n+ Unbanned the user "${u.username}" (${u.id})\`\`\``));
		ban.deleteOne();
	});
};