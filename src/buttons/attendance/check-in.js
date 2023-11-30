const { EmbedBuilder } = require('discord.js');
const Checks = require('../../models/attendances');
const { log } = require('../../../configs/config.json').checkIn;

module.exports = {
	id: 'check-in',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (client.mainServer.members.cache.get(interaction.user.id).presence?.status != 'online') return interaction.reply({ content: '**❌ - You must set your status to __online__ in order to check-in.**', ephemeral: true });
		const check = await Checks.findOne({ staff: interaction.user.id }) || new Checks({ staff: interaction.user.id });
		if (check.online) return interaction.reply({ content: '**🤔 - You\'ve already checked-in.**', ephemeral: true });
		check.online = true;
		check.lastCheck = Math.floor(Date.now() / 1000);
		await check.save();
		interaction.reply({ content: '**🟢 - You\'ve checked-in successfully. Make sure you stay online.**', ephemeral: true });
		const embed = new EmbedBuilder()
			.setDescription(`**🟢 - <@${interaction.user.id}> checked-in at <t:${Math.floor(Date.now() / 1000)}>**`)
			.setColor(0x00ff00);
		client.channels.cache.get(log).send({ embeds: [embed] });
		if (interaction.guild == null) interaction.message.delete();
		require('../../utils/helpers/attendanceMessage')(client);
	},
};