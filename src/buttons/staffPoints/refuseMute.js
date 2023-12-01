const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const TRoles = require('../../models/temproles');
const Mutes = require('../../models/mutes');
const { muteRole } = require('../../../configs/config.json');

module.exports = {
	id: 'proofRefuse',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '**🚫 - Only highstaff can press this button.**', ephemeral: true });
		const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(0xff0000).setImage('attachment://proof.png');
		const data = await Mutes.findOne({ embed: interaction.message.embeds[0].data });
		if (!data) return interaction.reply({ content: 'Error', ephemeral: true });
		await TRoles.findOne({ role: muteRole, member: data.member }).deleteOne();
		const member = await client.mainServer.members.fetch(data.member).catch(() => null);
		member.roles.remove(muteRole);
		data.refused = true;
		await data.save();
		interaction.message.edit({ embeds: [embed], components: [] });
		interaction.deferUpdate();
	},
};