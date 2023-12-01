const { testServer } = require('../../../configs/config.json');
const areCommandsDifferent = require('../../utils/others/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getFiles/getApplicationCommands');
const getLocalCommands = require('../../utils/getFiles/getLocalInteractions');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	try {
		const localCommands = getLocalCommands('../commands');
		const applicationCommands = await getApplicationCommands(
			client,
		);

		applicationCommands.cache.forEach(cmd => {
			const found = localCommands.find(c => c.name === cmd.name);
			if (!found || found.testOnly) cmd.delete().then(() => console.log(`🗑 Deleted command "${cmd.name}".`));
		});

		for (const localCommand of localCommands) {
			const { name, description, options, permissions } = localCommand;

			const existingCommand = applicationCommands.cache.find((cmd) => cmd.name === name);

			if (existingCommand) {
				if (localCommand.deleted) {
					await applicationCommands.delete(existingCommand.id);
					console.log(`🗑 - Deleted command "${name}".`);
					continue;
				}

				if (areCommandsDifferent(existingCommand, localCommand)) {
					await applicationCommands.edit(existingCommand.id, {
						description,
						options,
					});

					console.log(`✏️ - Edited command "${name}".`);
				}
			}
			else {
				if (!name || !description) continue;
				if (localCommand.deleted) {
					console.log(
						`⏩ - Skipped  "${name}" (deleted).`,
					);
					continue;
				}
				if (localCommand.testOnly) {
					console.log(
						`⏩ - Skipped "${name}" (testOnly).`,
					);
					getApplicationCommands(client, testServer).then(async c => await c.create({ name, description, options }));
					continue;
				}

				if (!permissions) {
					await applicationCommands.create({
						name,
						description,
						options,
						dmPermission: false,
					});
				}
				else {
					await applicationCommands.create({
						name,
						description,
						options,
						dmPermission: false,
						defaultMemberPermissions: permissions,
					});
				}
				console.log(`👍 Registered command "${name}."`);
			}
		}
	}
	catch (error) {
		console.error(error);
	}
};
