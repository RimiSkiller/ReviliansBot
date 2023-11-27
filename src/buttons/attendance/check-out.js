const ms = require('ms');
const Checks = require('../../models/attendances');
const { EmbedBuilder } = require('discord.js');
const { log } = require('../../../config.json').checkIn;

module.exports = {
	id: 'check-out',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const check = await Checks.findOne({ staff: interaction.user.id }) || new Checks({ staff: interaction.user.id });
		if (!check.online) return interaction.reply({ content: '**🤔 - You\'ve already checked-out.**', ephemeral: true });
		check.online = false;
		const period = Math.floor(Date.now() / 1000) - check.lastCheck;
		check.time += period;
		await check.save();
		interaction.reply({ content: `**🔴 - You've checked-out successfully. You have been online for \`${ms(period * 1000, { long: true })}\`**`, ephemeral: true });
		const embed = new EmbedBuilder()
			.setDescription(`**<@${interaction.user.id}> checked-out at <t:${Math.floor(Date.now() / 1000)}>**`)
			.setColor(0xff0000);
		client.channels.cache.get(log).send({ embeds: [embed] });
		require('../../utils/helpers/attendanceMessage')(client);
	},
};