const giveaways = require('../../models/giveaways');


module.exports = {
	name: 'End Giveaway',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').MessageContextMenuCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const message = interaction.targetMessage;
		const giveaway = await giveaways.findOne({ message: message.id, channel: interaction.channelId });
		if (!giveaway) return interaction.reply({ content: '**🤔 - This isn\'t a giveaway message.**', ephemeral: true });
		if (giveaway.time == 'ended') return interaction.reply({ content: '**🤔 - This giveaway has already ended.**', ephemeral: true });
		interaction.reply({ content: '**🎉 - Ended this giveaway.**', ephemeral: true });
		giveaway.time = Date.now();
		await giveaway.save();
	},
};