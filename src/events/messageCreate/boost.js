const gpt = require('../../utils/helpers/gpt');
const { boost } = require('../../../configs/config.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (message.guildId != client.mainServer.id) return;
	if (![8, 9, 10, 11].includes(message.type)) return;
	let msg = '';
	if (message.type == 8) msg = await gpt(`a user named "${message.member.displayName}" boosted the server, thank him in a very short message in Arabic`, `I want you to act as a Discord bot, I'll write you a scenario that may happen in Discord server called "${message.member.guild.name}", you will send me the best message in Arabic to reply to this scenario, users names must be in English, don't use more than 1 emoji in the message.`);
	else msg = await gpt(`a user named "${message.member.displayName}" boosted the server and made it reach level ${message.type - 8}, thank him in a very short message in Arabic`, `I want you to act as a Discord bot, I'll write you a scenario that may happen in Discord server called "${message.member.guild.name}", you will send me the best message in Arabic to reply to this scenario, users names must be in English, don't use more than 1 emoji in the message.`);
	message.guild.channels.cache.get(boost).send('**● ' + msg.replace(message.member.displayName, `<@${message.member.id}>`) + '**');
};
