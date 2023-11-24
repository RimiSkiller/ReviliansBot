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
		const upRec = message.reactions.cache.get('1173758537227309067');
		const downRec = message.reactions.cache.get('1173758586816561235');
		const upCount = upRec.count - 1;
		const downCount = downRec.count - 1;
		const upButton = new ButtonBuilder()
			.setCustomId('1')
			.setDisabled(true)
			.setLabel(upCount.toString())
			.setEmoji({ id: '1173758537227309067' })
			.setStyle(ButtonStyle.Secondary);
		const downButton = new ButtonBuilder()
			.setCustomId('2')
			.setDisabled(true)
			.setLabel(downCount.toString())
			.setEmoji({ id: '1173758586816561235' })
			.setStyle(ButtonStyle.Secondary);
		message.edit({ components: [new ActionRowBuilder().addComponents(upButton, downButton)] });
		const upUsers = upCount ? (await upRec.users.fetch()).filter(u => u.id != client.user.id).map(u => `\n${u.username} - (${u.id})`) : 'diff\n- No voters';
		const downUsers = downCount ? (await downRec.users.fetch()).filter(u => u.id != client.user.id).map(u => `\n${u.username} - (${u.id})`) : 'diff\n- No voters';
		(await client.users.fetch(vote.author)).send({ content: `**🎟️ - You're vote has ended [Vote Link](<${message.url}>):**\n> Up Voters:\n\`\`\`${upUsers}\`\`\`\n> Down Voters:\n\`\`\`${downUsers}\`\`\`` });

		message.reactions.removeAll();
		await vote.deleteOne();
	});
};