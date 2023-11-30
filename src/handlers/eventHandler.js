const path = require('path');
const getAllFiles = require('../utils/getFiles/getAllFiles');

module.exports = (client) => {
	const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

	for (const eventFolder of eventFolders) {
		const eventFiles = getAllFiles(eventFolder);
		eventFiles.sort((a, b) => a > b);

		const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
		console.log(`📃 - Loaded "${eventName}" Event`);
		client.on(eventName, async (...args) => {
			for (const eventFile of eventFiles) await require(eventFile)(client, ...args);
		});
	}
};
