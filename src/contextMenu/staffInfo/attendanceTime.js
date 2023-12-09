const Attend = require('../../models/attendances');

module.exports = {
	name: 'Attendance Time',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').UserContextMenuCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const { default: pms } = await import('pretty-ms');
		const staff = interaction.targetId;
		const data = (await Attend.findOne({ staff: staff }))?.time || 0;
		interaction.reply({ content: `**⌚ - <@${staff}> has \`${pms(data * 1000)}\` of work time.**`, ephemeral: true });
	},
};