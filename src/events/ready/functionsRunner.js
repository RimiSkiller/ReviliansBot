const wait = require('node:timers/promises').setTimeout;
const getAllFiles = require('../../utils/getFiles/getAllFiles');
const path = require('path');
const ms = require('ms');

module.exports = async (client) => {
	const funcsFolders = getAllFiles(path.join(__dirname, '..', '..', 'functions'), true);

	for (const funcsFolder of funcsFolders) {
		const funcFiles = getAllFiles(funcsFolder);
		const time = funcsFolder.replace(/\\/g, '/').split('/').pop();
		const func = async () => {
			for (const funcFile of funcFiles) await require(funcFile)(client);
		};
		await wait(2000);
		func();
		setInterval(func, ms(time));
	}
};