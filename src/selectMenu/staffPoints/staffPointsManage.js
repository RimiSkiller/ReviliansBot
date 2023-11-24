const Points = require('../../models/staffPoints');

module.exports = {
	id: 'staffPointManage',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').UserSelectMenuInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const user = interaction.values[0];
		const data = await Points.findOne({ staff: user });
		interaction.deferUpdate();
		interaction.message.edit({ content: `**<@${user}><:arrow:1170430004493033594>__${data ? data.points : 'No data'}__**` });
	},
};