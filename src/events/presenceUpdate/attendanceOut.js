const Checks = require('../../models/attendances');
const { testServer } = require('../../../config.json');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { log } = require('../../../config.json').checkIn;
const ms = require('ms');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Presence} oldPresence
 * @param {import('discord.js').Presence} newPresence
 */
module.exports = async (client, oldPresence, newPresence) => {
	if (oldPresence?.status != 'online' || newPresence?.status == 'online') return;
	if (oldPresence.guild.id != testServer) return;
	const member = oldPresence.member;
	const check = await Checks.findOne({ staff: newPresence.userId });
	if (!check || !check.online) return;
	const button = new ButtonBuilder({ customId: 'check-out', label: 'Check-Out', style: ButtonStyle.Danger });
	const msg = await member.send({ content: '**⚠️ - You will be checked-out if you don\'t go back online in 5 minutes.**', components: [new ActionRowBuilder().addComponents(button)] });
	await client.wait(300_000);
	if (member.presence?.status == 'online' || !(await Checks.findOne({ staff: newPresence.userId })).online) return msg.delete();
	check.online = false;
	const period = Math.floor(Date.now() / 1000) - check.lastCheck - 300;
	check.time += period;
	await check.save();
	msg.edit({ content: `**🔴 - You've been checked-out. You were online for \`${ms(period * 1000, { long: true })}\`**`, components: [] });
	require('../../utils/helpers/attendanceMessage')(client);
	const embed = new EmbedBuilder()
		.setDescription(`**<@${member.id}> checked-out at <t:${Math.floor(Date.now() / 1000) - 300}>. __(not online)__**`)
		.setColor(0xff0000);
	client.channels.cache.get(log).send({ embeds: [embed] });
};