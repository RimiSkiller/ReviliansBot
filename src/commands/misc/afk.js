const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Attend = require('../../models/attendances');
const { log } = require('../../../configs/config.json').checkIn;

module.exports = {
	name: 'afk',
	description: 'set your status to afk when you are not on the computer',
	permissions: PermissionFlagsBits.ManageMessages,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const attend = await Attend.findOne({ staff: interaction.user.id });
		if (!attend?.online) return interaction.reply({ content: '**🤔 - You must be checked-in to AFK.**', ephemeral: true });
		if (!attend || attend.afkStart) return interaction.reply({ content: '**🤔 - You are AFKing.**', ephemeral: true });
		attend.afkStart = Math.floor(Date.now() / 1000);
		interaction.reply({ content: '**😴 - You\'re AFKing now...**', ephemeral: true });
		interaction.guild.members.fetch(interaction.user.id).then(member => {
			attend.name = member.displayName;
			member.setNickname(`${member.displayName} [AFK]`);
		});
		await attend.save();
		const embed = new EmbedBuilder()
			.setDescription(`**💤 - <@${interaction.user.id}> started AFKing at <t:${Math.floor(Date.now() / 1000)}>**`)
			.setColor(0xFF7575);
		client.channels.cache.get(log).send({ embeds: [embed] });
		require('../../utils/helpers/attendanceMessage')(client);
	},
};