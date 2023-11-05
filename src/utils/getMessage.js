/**
 * @param {import('discord.js').Interaction} interaction
 * @returns string
 */
module.exports = async (interaction) => {
	let msg = String();
	await interaction.channel.awaitMessages({ filter: m => m.member.id == interaction.member.id, max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
			msg = collected.first().content || collected.first().attachments.first().url;
			collected.first().delete();
		})
		.catch(() => {
			msg = 'no-res-1';
		});
	return msg;
};