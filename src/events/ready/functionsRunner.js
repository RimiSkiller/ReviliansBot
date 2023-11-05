const getAllFiles = require('../../utils/getAllFiles');
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
		func();
		setInterval(func, ms(time));
	}
};