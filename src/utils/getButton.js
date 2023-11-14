const { ComponentType } = require('discord.js');

/**
 * @param {import('discord.js').Message} reply
 * @returns string
 */
module.exports = async (reply, id = reply.interaction.user.id, time = 30000) => {
	let msg = String();
	await reply.awaitMessageComponent({ filter: m => m.member.id == id, componentType: ComponentType.Button, time: time, errors: ['time'] })
		.then(collected => {
			msg = collected.customId;
			collected.deferUpdate();
		})
		.catch(() => {
			msg = 'no-res';
		});
	return msg;
};