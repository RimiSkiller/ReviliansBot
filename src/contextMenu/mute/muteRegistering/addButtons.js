const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

/**
 * @param {import('discord.js').Message} message
 */
module.exports = (message) => {
	const b1 = new ButtonBuilder({ customId: 'proofApprove', label: 'Approve', style: ButtonStyle.Success });
	const b2 = new ButtonBuilder({ customId: 'proofRefuse', label: 'Refuse', style: ButtonStyle.Danger });
	message.edit({ components: [new ActionRowBuilder().addComponents(b1, b2)] });
};