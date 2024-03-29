const { dev } = require('../../../configs/config.json');
const getLocalInteractions = require('../../utils/getFiles/getLocalInteractions');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').AnySelectMenuInteraction} interaction
 */
module.exports = async (client, interaction) => {
	if (!interaction.isAnySelectMenu()) return;

	const localCommands = getLocalInteractions('../selectMenu');

	try {
		const commandObject = localCommands.find(
			(cmd) => cmd.id === interaction.customId,
		);
		if (!commandObject) return;

		if (commandObject.devOnly) {
			if (dev != interaction.user.id) {
				interaction.reply({
					content: '**❌ - Only developers are allowed to select from this menu.**',
					ephemeral: true,
				});
				return;
			}
		}
		await commandObject.callback(client, interaction);
	}
	catch (error) {
		console.log(`There was an error running this command: ${error}`);
	}
};