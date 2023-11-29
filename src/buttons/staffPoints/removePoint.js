const Points = require('../../models/staffPoints');
const { EmbedBuilder } = require('@discordjs/builders');
const { log } = require('../../../configs/config.json').pointsChannel;

module.exports = {
	id: 'staffDown',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const user = interaction.message.mentions.users.first();
		if (!user) return interaction.reply({ content: '**❌ - Please select a staff to manage his point.**', ephemeral: true });
		const data = await Points.findOne({ staff: user.id }) || new Points({ staff: user.id });
		if (data.points < 1) return interaction.reply({ content: '**❌ - Points can\'t be less than 0.**', ephemeral: true });
		data.points--;
		await data.save();
		interaction.message.edit({ content: `**<@${user.id}><:arrow:1170430004493033594>__${data ? data.points : 'No data'}__**` });
		interaction.deferUpdate();
		client.channels.cache.get(log).send({ embeds: [new EmbedBuilder().setDescription(`- **<@${interaction.user.id}> removed a point from staff <@${user.id}>.**`).setColor(0xff0000)] });
		require('../../utils/helpers/pointMessage')(client);
	},
};