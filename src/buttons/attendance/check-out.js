const ms = require('ms');
const Checks = require('../../models/attendances');
const { EmbedBuilder } = require('discord.js');
const { log } = require('../../../configs/config.json').checkIn;

module.exports = {
	id: 'check-out',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const check = await Checks.findOne({ staff: interaction.user.id }) || new Checks({ staff: interaction.user.id });
		if (!check.online) return interaction.reply({ content: '**🤔 - You\'ve already checked-out.**', ephemeral: true });
		check.online = false;
		const period = Math.floor(Date.now() / 1000) - check.lastCheck;
		if (check.afkStart) {
			check.afkTime += Math.floor(Date.now() / 1000) - check.afkStart;
			check.afkStart = 0;
			client.mainServer.members.fetch(interaction.user.id).then(member => member.setNickname(check.name != member.user.displayName ? check.name : null));
		}
		check.time += period - check.afkTime;
		const afkTime = check.afkTime;
		check.afkTime = 0;
		await check.save();
		interaction.reply({ content: `**🔴 - You've checked-out successfully. You have been online for \`${ms(period * 1000, { long: true })}\`${afkTime ? `, Removed \`${ms(afkTime * 1000, { long: true })}\` for AFKing.` : '.'}**`, ephemeral: true });
		const embed = new EmbedBuilder()
			.setDescription(`**🔴 - <@${interaction.user.id}> checked-out at <t:${Math.floor(Date.now() / 1000)}>**`)
			.setColor(0xff0000);
		interaction.member.roles.remove('1200477671071698944');
		client.channels.cache.get(log).send({ embeds: [embed] });
		if (interaction.guild == null) interaction.message.delete();
		require('../../utils/helpers/attendanceMessage')(client);
	},
};