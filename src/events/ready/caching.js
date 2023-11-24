const { mainlog, proof, mainserver, muteRole, pointsChannel } = require('../../../config.json');
const Votes = require('../../models/votes');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	// channels
	await client.channels.fetch(mainlog, { cache: true });
	await client.channels.fetch(proof.mute, { cache: true });
	await client.channels.fetch(proof.nomute, { cache: true });
	await client.channels.fetch(pointsChannel.show, { cache: true });
	await client.channels.fetch(pointsChannel.manage, { cache: true });
	await client.channels.fetch(pointsChannel.log, { cache: true });

	// roles
	const server = await client.guilds.fetch(mainserver);
	await server.roles.fetch(muteRole, { cache: true });

	// messages
	const votes = await Votes.find();
	votes.forEach(async vote => {
		const channel = await client.channels.fetch(vote.channel, { cache: false });
		await channel.messages.fetch(vote.message, { cache: true });
	});

};