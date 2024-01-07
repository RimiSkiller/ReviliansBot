const gpt = require('../../utils/helpers/gpt');
const { boost } = require('../../../configs/config.json');
const { EmbedBuilder } = require('discord.js');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (message.guildId != client.mainServer.id) return;
	if (![8, 9, 10, 11].includes(message.type)) return;
	let msg = '';
	if (message.type == 8) msg = await gpt(`a user named "${message.member.displayName}" boosted the server, thank him in a very short message in Arabic`, `I want you to act as a Discord bot, I'll write you a scenario that may happen in Discord server called "${message.member.guild.name}", you will send me the best message in Arabic to reply to this scenario, users names must be in English, don't use more than 1 emoji in the message.`);
	else msg = await gpt(`a user named "${message.member.displayName}" boosted the server and made it reach level ${message.type - 8}, thank him in a very short message in Arabic`, `I want you to act as a Discord bot, I'll write you a scenario that may happen in Discord server called "${message.member.guild.name}", you will send me the best message in Arabic to reply to this scenario, users names must be in English, don't use any emoji in the message.`);
	const embed = new EmbedBuilder({
		'type': 'rich',
		'description': '**● ' + msg.replace(message.member.displayName, `<@${message.member.id}>`) + ' <a:NitroBoost:1193681046827438161>**',
		'color': 13806328,
		'footer': {
			'text': `Server Current Boosts: ${message.guild.premiumSubscriptionCount}`,
			'icon_url': message.member.avatarURL({ size: 256, extension: 'png' }),
		},
		'thumbnail': {
			'url': message.guild.iconURL({ size: 64, extension: 'png' }),
			'width': 64,
			'height': 64,
		},
		'author': {
			'name': 'Server Got Boosted',
			'icon_url': 'https://message.style/cdn/images/852b5fdbe07776762c94b7e192cac119d6adcbac40476e66da8d5332fb6659be.png',
			'proxy_icon_url': 'https://images-ext-2.discordapp.net/external/wRL53LjBL3LUTlF6Bn6F180ra5GASKoBseRsFkVTyGY/https/message.style/cdn/images/852b5fdbe07776762c94b7e192cac119d6adcbac40476e66da8d5332fb6659be.png',
		},
	});
	message.guild.channels.cache.get(boost).send({ embeds: [embed] });
};
