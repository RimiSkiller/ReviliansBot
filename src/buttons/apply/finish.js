const { EmbedBuilder } = require('discord.js');
const gpt = require('../../utils/helpers/gpt');

module.exports = {
	id: 'apply-finish',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const applyType = interaction.message.embeds[0].data.title.slice(0, -3);
		const category = (await client.staffServer.channels.fetch()).find(ch => ch.name == applyType);
		if (!category) return interaction.reply({ content: '**❌ - Some thing went wrong, contact the staff team.**', ephemeral: true });
		const resChannel = category.children.cache.find(ch => ch.name == 'responses');
		const embed = new EmbedBuilder()
			.setAuthor({ name: interaction.user.displayName, url: `https://discord.com/users/${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })
			.setColor(0xffff00);
		resChannel.send({ embeds: [embed, ...interaction.message.embeds.map(e => e.data)] });
		interaction.message.delete();
		interaction.deferReply();
		interaction.reply({ content: await gpt(`a user named "${interaction.user.displayName}" finished filling an application in the server, inform him that his application have been submitted to high staff.`, 'I want to act as a Discord bot, I\'ll write you a scenario that may happen in Discord server called "Revilians Community", you will send me the best message to reply to this scenario.'), ephemeral: true });
	},
};