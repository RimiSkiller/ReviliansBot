const { dev } = require('../../../configs/config.json');
const getLocalInteractions = require('../../utils/getFiles/getLocalInteractions');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ContextMenuCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
	if (!interaction.isContextMenuCommand()) return;

	const localCommands = getLocalInteractions('../contextMenu');

	try {
		const commandObject = localCommands.find(
			(cmd) => cmd.name === interaction.commandName,
		);

		if (!commandObject) return;

		if (commandObject.devOnly) {
			if (dev != interaction.user.id) {
				interaction.reply({
					content: '**❌ - Only developers are allowed to run this command.**',
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