const Attend = require('../../models/attendances');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (message.guildId != client.mainServer.id) return;
	if (message.author.id == client.user.id) return;
	const afked = message.mentions.members.filter(m => m.displayName.endsWith('[AFK]'));
	if (afked.size == 0) return;
	async function filter(arr, callback) {
		const fail = Symbol();
		return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail);
	}
	const results = await filter(afked, async m => {
		const attend = await Attend.findOne({ staff: m.id });
		return Boolean(attend.afkStart);
	});
	const msg = await Promise.all(results.map(async m => {
		const attend = await Attend.findOne({ staff: m.id });
		return `**● \`${attend.name}\` is currently AFKing${attend.afkMessage ? `, Message:** ${attend.afkMessage}.` : '.**'}`;
	}));
	if (!msg.length) return;
	message.reply(msg.join('\n'));
};