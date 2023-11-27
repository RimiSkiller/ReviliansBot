const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (folder) => {
	const localCommands = [];

	const commandCategories = getAllFiles(
		path.join(__dirname, '..', folder),
		true,
	);

	for (const commandCategory of commandCategories) {
		const commandFiles = getAllFiles(commandCategory);

		for (const commandFile of commandFiles) {
			const commandObject = require(commandFile);
			localCommands.push(commandObject);
		}
	}

	return localCommands;
};
