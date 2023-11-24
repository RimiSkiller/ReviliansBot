const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	id: 'proofRefuse',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '**🚫 - Only highstaff can press this button.**', ephemeral: true });
		const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(0xff0000);
		interaction.message.edit({ embeds: [embed], components: [], files: [] });
		interaction.deferUpdate();
	},
};