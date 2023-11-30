const Checks = require('../../models/attendances');
const { testServer } = require('../../../configs/config.json');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Presence} oldPresence
 * @param {import('discord.js').Presence} newPresence
 */
module.exports = async (client, oldPresence, newPresence) => {
	if (oldPresence?.status == 'online' || newPresence?.status != 'online') return;
	if (newPresence.guild.id != testServer) return;
	const member = newPresence.member;
	let check = await Checks.findOne({ staff: member.id });
	if (!check || check.online || member.presence.status != 'online') return;
	await client.wait(600_000);
	check = await Checks.findOne({ staff: member.id });
	if (!check || check.online || member.presence.status != 'online') return;
	const button = new ButtonBuilder({ customId: 'check-in', label: 'Check-In', style: ButtonStyle.Success });
	member.send({ content: '**ℹ️ - You\'ve been online for 10 minutes, Do you want to check-in?**', components: [new ActionRowBuilder().addComponents(button)] }).then(msg => setTimeout(() => msg.delete().catch(() => null), 300_000));
};