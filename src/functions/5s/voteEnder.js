const { ButtonStyle } = require('discord.js');
const Votes = require('../../models/votes');
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client) => {
	const votes = await Votes.where('time').lte(Date.now());
	votes.forEach(async vote => {
		const channel = await client.channels.fetch(vote.channel, { cache: false });
		const message = channel.messages.cache.get(vote.message);
		const up = message.reactions.cache.get('1173758537227309067').count - 1;
		const down = message.reactions.cache.get('1173758586816561235').count - 1;
		const upButton = new ButtonBuilder()
			.setCustomId('1')
			.setDisabled(true)
			.setLabel(up.toString())
			.setEmoji({ id: '1173758537227309067' })
			.setStyle(ButtonStyle.Secondary);
		const downButton = new ButtonBuilder()
			.setCustomId('2')
			.setDisabled(true)
			.setLabel(down.toString())
			.setEmoji({ id: '1173758586816561235' })
			.setStyle(ButtonStyle.Secondary);
		message.edit({ components: [new ActionRowBuilder().addComponents(upButton, downButton)] });
		message.reactions.removeAll();
		await vote.deleteOne();
	});
};