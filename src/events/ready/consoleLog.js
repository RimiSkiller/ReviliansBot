const { log, proof } = require('../../../config.json');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	client.application.commands.cache.forEach(c => console.log(`✅ - Loaded "${c.name}" Command.`));
	console.log(`⚙️  - ${client.user.username} is running.`);
	await client.channels.fetch(log, { cache: true });
	await client.channels.fetch(proof.ban, { cache: true });
	await client.channels.fetch(proof.mute, { cache: true });
};