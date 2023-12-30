const Points = require('../../models/staffPoints');
const { EmbedBuilder } = require('@discordjs/builders');
const { log } = require('../../../configs/config.json').pointsChannel;

module.exports = {
	id: 'staffSet',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const user = interaction.message.mentions.users.first();
		if (!user) return interaction.reply({ content: '**❌ - Please select a staff to manage his point.**', ephemeral: true });
		interaction.reply({ content: '**● Send points amount to set.**', ephemeral: true });
		const res = await require('../../utils/awaitInterraction/getMessage')(interaction.user.id, interaction.channel);
		if (res == 'no-res') return;
		if (isNaN(res)) return interaction.editReply('**❌ - You didn\'t provide a valid number.**');
		const data = await Points.findOne({ staff: user.id }) || new Points({ staff: user.id });
		data.points = res;
		await data.save();
		require('../../utils/helpers/pointMessage')(client);
		client.channels.cache.get(log).send({ embeds: [new EmbedBuilder().setDescription(`- **<@${interaction.user.id}> set the points of staff <@${user.id}> to __${res}__.**`).setColor(client.color)] });
		interaction.message.edit({ content: `**<@${user.id}><:arrow:1170430004493033594>__${data ? data.points : 'No data'}__**` });
		interaction.deleteReply();
	},
};