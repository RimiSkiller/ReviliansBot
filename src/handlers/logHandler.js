const path = require('path');
const getAllFiles = require('../utils/getFiles/getAllFiles');

module.exports = (client) => {
	const eventFiles = getAllFiles(path.join(__dirname, '..', 'logger'));
	eventFiles.sort((a, b) => a > b);
	console.log('🧾 - Logger is Running');
	for (const eventFile of eventFiles) {
		const eventName = eventFile.replace(/\\/g, '/').split('/').pop().split('.')[0];

		client.on(eventName, async (...args) => await require(eventFile)(client, ...args));
	}
};
