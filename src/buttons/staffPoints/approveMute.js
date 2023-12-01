const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Points = require('../../models/staffPoints');
const { log } = require('../../../configs/config.json').pointsChannel;

module.exports = {
	id: 'proofApprove',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '**🚫 - Only highstaff can press this button.**', ephemeral: true });
		const user = interaction.message.mentions.users.first();
		const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(0x00ff00).setImage('attachment://proof.png');
		const data = await Points.findOne({ staff: user.id }) || new Points({ staff: user.id });
		data.points++;
		await data.save();
		client.channels.cache.get(log).send({ embeds: [new EmbedBuilder().setDescription(`- **Added a point for staff <@${user.id}> for registering a proof.**`).setColor(0x00ff00)] });
		interaction.message.edit({ embeds: [embed], components: [] });
		interaction.deferUpdate();
		require('../../utils/helpers/pointMessage')(client);
	},
};