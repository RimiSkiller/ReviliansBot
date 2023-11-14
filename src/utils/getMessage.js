/**
 * @param {import('discord.js').Interaction} interaction
 * @returns string
 */
module.exports = async (interaction, channel = interaction.channel, time = 30000) => {
	let msg = String();
	await channel.awaitMessages({ filter: m => m.member.id == interaction.member.id, max: 1, time: time, errors: ['time'] })
		.then(collected => {
			if (collected.first().attachments.first()) msg = collected.first().attachments.first().url;
			else msg = collected.first().content;
			collected.first().delete();
		})
		.catch(() => {
			msg = 'no-res';
		});
	return msg;
};