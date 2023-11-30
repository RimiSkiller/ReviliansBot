const { EmbedBuilder } = require('discord.js');
const Attend = require('../../models/attendances');
const { log } = require('../../../configs/config.json').checkIn;
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (message.guildId != client.mainServer.id) return;
	const attend = await Attend.findOne({ staff: message.author.id });
	if (!attend?.afkStart) return;
	attend.afkTime += Math.floor(Date.now() / 1000) - attend.afkStart;
	attend.afkStart = 0;
	await attend.save();
	message.member.setNickname(attend.name);
	message.reply({ content: '**👋 - Welcome Back, removed your afk.**' }).then(msg => setTimeout(() => msg.delete(), 5000));
	const embed = new EmbedBuilder()
		.setDescription(`**💤 - <@${message.author.id}> stoped AFKing at <t:${Math.floor(Date.now() / 1000)}>**`)
		.setColor(0x75ff75);
	client.channels.cache.get(log).send({ embeds: [embed] });
	require('../../utils/helpers/attendanceMessage')(client);
};