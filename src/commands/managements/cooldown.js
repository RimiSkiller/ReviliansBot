const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');
const { mainlog } = require('../../../configs/config.json');

module.exports = {
	name: 'cooldown',
	description: 'set the cooldown of the channel',
	options: [
		{
			name: 'time',
			description: 'the time of the cooldown you want to set',
			type: ApplicationCommandOptionType.String,
		},
	],
	permissions: PermissionFlagsBits.ManageChannels,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		let time = ms(interaction.options.get('time')?.value || '0');
		if (time == undefined) return interaction.reply({ content: '**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**', ephemeral: true });
		time = Math.floor(time / 1000);
		interaction.channel.setRateLimitPerUser(time).then(() => {
			if (time) client.channels.cache.get(mainlog).send(`**● Action By ${interaction.user}:**\`\`\`diff\n+ Set the cooldown of #${interaction.channel.name} (${interaction.channelId}) to ${ms(time * 1000, { long: true })}\`\`\``);
			else client.channels.cache.get(mainlog).send(`**● Action By ${interaction.user}:**\`\`\`diff\n- turn off the cooldown of #${interaction.channel.name} (${interaction.channelId})\`\`\``);
			interaction.reply({ content: time ? `**⌛ - Set the cooldown of this channel to __${ms(time * 1000, { long: true })}__.**` : '**⌛ - Turned off the cooldown of this channel.**', ephemeral: true });
		});
	},
};