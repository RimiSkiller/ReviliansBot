const { EmbedBuilder } = require('@discordjs/builders');
const Points = require('../../models/staffPoints');
const { log } = require('../../../configs/config.json').pointsChannel;

module.exports = {
	id: 'staffUp',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const user = interaction.message.mentions.users.first();
		if (!user) return interaction.reply({ content: '**❌ - Please select a staff to manage his point.**', ephemeral: true });
		const data = await Points.findOne({ staff: user.id }) || new Points({ staff: user.id });
		data.points++;
		await data.save();
		interaction.message.edit({ content: `**<@${user.id}><:arrow:1170430004493033594>__${data ? data.points : 'No data'}__**` });
		interaction.deferUpdate();
		client.channels.cache.get(log).send({ embeds: [new EmbedBuilder().setDescription(`- **<@${interaction.user.id}> added a point for staff <@${user.id}>.**`).setColor(0x00ff00)] });
		require('../../utils/helpers/pointMessage')(client);
	},
};