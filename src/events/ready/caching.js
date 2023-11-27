const config = require('../../../config.json');
const Votes = require('../../models/votes');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	// channels
	await client.channels.fetch(config.mainlog, { cache: true });
	await client.channels.fetch(config.proof.mute, { cache: true });
	await client.channels.fetch(config.proof.nomute, { cache: true });
	await client.channels.fetch(config.pointsChannel.show, { cache: true });
	await client.channels.fetch(config.pointsChannel.manage, { cache: true });
	await client.channels.fetch(config.pointsChannel.log, { cache: true });
	await client.channels.fetch(config.checkIn, { cache: true });


	// roles
	const server = await client.guilds.fetch(config.mainserver);
	await server.roles.fetch(config.muteRole, { cache: true });

	// messages
	const votes = await Votes.find();
	votes.forEach(async vote => {
		const channel = await client.channels.fetch(vote.channel, { cache: false });
		await channel.messages.fetch(vote.message, { cache: true });
	});
};