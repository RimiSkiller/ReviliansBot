/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	client.application.commands.cache.forEach(c => console.log(`✅ - Loaded "${c.name}" Command.`));
	console.log(`⚙️  - ${client.user.username} is running.`);
	client.log('**🤖 - Bot is Running.**');
};