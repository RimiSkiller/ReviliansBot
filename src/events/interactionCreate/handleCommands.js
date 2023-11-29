const { dev } = require('../../../configs/config.json');
const getLocalCommands = require('../../utils/getFiles/getLocalInteractions');

module.exports = async (client, interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const localCommands = getLocalCommands('../commands');

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
