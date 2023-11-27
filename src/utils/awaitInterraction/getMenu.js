const { ComponentType } = require('discord.js');

/**
 * @param {import('discord.js').Message} reply
 * @returns string
 */
module.exports = async (reply) => {
	let msg = String();
	await reply.awaitMessageComponent({ filter: m => m.member.id == reply.interaction.user.id, componentType: ComponentType.StringSelect, time: 30000, errors: ['time'] })
		.then(collected => {
			msg = collected.values[0];
			collected.deferUpdate();
		})
		.catch(() => {
			msg = 'no-res';
		});
	return msg;
};