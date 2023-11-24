const Level = require('../../models/reset');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	try {
		const level = await Level.findOne();
		if (level) {
			require('../../../registerCmds');
			const ch = await client.channels.fetch(level.channel);
			await (await ch.messages.fetch(level.reply)).edit('**🔄️ - Finished restarting.**');
			await level.deleteOne();
		}
	}
	catch (e) {
		console.error(e);
	}
};