const { ComponentType } = require('discord.js');

/**
 * @param {import('discord.js').Message} reply
 * @returns string
 */
module.exports = async (reply) => {
	let msg = String();
	await reply.awaitMessageComponent({ filter: m => m.member.id == reply.interaction.user.id, componentType: ComponentType.Button, time: 30000, errors: ['time'] })
		.then(collected => {
			msg = collected.customId;
			collected.deferUpdate();
		})
		.catch(() => {
			msg = 'no-res-3';
		});
	return msg;
};