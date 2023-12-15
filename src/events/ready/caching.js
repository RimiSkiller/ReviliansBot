const config = require('../../../configs/config.json');
const logger = require('../../../configs/logger.json');
const Votes = require('../../models/votes');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	// channels
	client.log = async (m) => (await client.channels.fetch(config.mainlog, { cache: true })).send(m);
	await client.channels.fetch(config.proof.mute, { cache: true });
	await client.channels.fetch(config.proof.nomute, { cache: true });
	await client.channels.fetch(config.pointsChannel.show, { cache: true });
	await client.channels.fetch(config.pointsChannel.manage, { cache: true });
	await client.channels.fetch(config.pointsChannel.log, { cache: true });
	await client.channels.fetch(config.checkIn.show, { cache: true });
	await client.channels.fetch(config.checkIn.log, { cache: true });
	await client.channels.fetch(config.welcome, { cache: true });

	for (const log in logger) await client.channels.fetch(logger[log], { cache: true });

	// servers
	client.mainServer = await client.guilds.fetch(config.mainserver);
	client.staffServer = await client.guilds.fetch(config.testServer);
	// roles
	await client.mainServer.roles.fetch(config.muteRole, { cache: true });

	// messages
	const votes = await Votes.find();
	votes.forEach(async vote => {
		const channel = await client.channels.fetch(vote.channel, { cache: false });
		await channel.messages.fetch(vote.message, { cache: true });
	});

	// members
	await client.staffServer.members.fetch({ cache: true });

	// client variables
	client.color = 0x5865f2;
};