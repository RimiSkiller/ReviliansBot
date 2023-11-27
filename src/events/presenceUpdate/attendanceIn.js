const Checks = require('../../models/attendances');
const { testServer } = require('../../../config.json');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Presence} oldPresence
 * @param {import('discord.js').Presence} newPresence
 */
module.exports = async (client, oldPresence, newPresence) => {
	if (oldPresence?.status == 'online' || newPresence?.status != 'online') return;
	if (newPresence.guild.id != testServer) return;
	await client.wait(600_000);
	const member = newPresence.member;
	const check = await Checks.findOne({ staff: member.id });
	if (!check || check.online) return;
	const button = new ButtonBuilder({ customId: 'check-in', label: 'Check-In', style: ButtonStyle.Success });
	member.send({ content: '**ℹ️ - You\'ve been online for 10 minutes, Do you want to check-in?**', components: [new ActionRowBuilder().addComponents(button)] }).then(msg => setTimeout(() => msg.delete(), 300_000));
};