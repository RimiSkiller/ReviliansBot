const { EmbedBuilder } = require('discord.js');
const { suggChannel } = require('../../../configs/config.json');
const Suggestion = require('../../models/suggestions');
const barMaker = require('../../utils/helpers/barMaker');

module.exports = {
	id: 'suggDown',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (interaction.channelId != suggChannel) return;
		const data = await Suggestion.findOne({ message: interaction.message.id });
		if (!data) return;
		if (data.up.some(v => v == interaction.user.id) || data.down.some(v => v == interaction.user.id)) return interaction.reply({ content: '**❌ - You already voted for this suggestion.**', ephemeral: true });
		const message = await interaction.message.fetch(true);

		data.down.push(interaction.user.id);
		const upCount = data.up.length; const downCount = data.down.length;

		interaction.reply({ content: `**☑️ - Voted for the suggestion: [Suggestion](<${message.url}>)**`, ephemeral: true });
		const bar = barMaker(upCount, downCount);
		const embed = EmbedBuilder.from(message.embeds[0]);
		embed.setFields([embed.data.fields[0], { name: '● Votes:', value: `**${Math.round(bar.uPer)}% <:upvote:1193689532764270623> ${bar.pb} <:downvote:1193689536191012967> ${bar.dPer}%**` }]);
		await message.edit({ embeds: [embed] });
		await data.save();
	},
};