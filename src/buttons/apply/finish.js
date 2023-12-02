const { EmbedBuilder } = require('discord.js');

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
		interaction.reply({ content: '**📃 - Your application was sent to our staff to review.**', ephemeral: true }).then(msg => setTimeout(() => msg.delete(), 10000));
	},
};