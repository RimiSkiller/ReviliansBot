const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

const select = new StringSelectMenuBuilder()
	.setCustomId('action')
	.setOptions(
		new StringSelectMenuOptionBuilder()
			.setEmoji('🤐')
			.setLabel('Mute')
			.setValue('mute'),
		new StringSelectMenuOptionBuilder()
			.setEmoji('🚫')
			.setLabel('Ban')
			.setValue('ban'),
		new StringSelectMenuOptionBuilder()
			.setEmoji('📨')
			.setLabel('Ticket')
			.setValue('ticket'),
	);
const row = new ActionRowBuilder().addComponents(select);

module.exports = {
	deleted: true,
	name: 'register',
	description: 'register a moderation action',
	testOnly: false,
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const reply = await interaction.reply({ content: '**● Choose an action to register it:**', components: [row], ephemeral: true });
		const res = await require('../../utils/awaitInterraction/getMenu')(reply);
		if (res == 'mute') await require('./Register Methods/mute')(interaction);
		if (res == 'ban') await require('./Register Methods/ban')(interaction);
		else if (res == 'no-res') interaction.editReply({ content: 'Aborted', components: [] });
		else console.log(res);
	},
};
