const { log, proof } = require('../../../config.json');
const Votes = require('../../models/votes');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	await client.channels.fetch(log, { cache: true });
	await client.channels.fetch(proof.mute, { cache: true });
	await client.channels.fetch(proof.nomute, { cache: true });

	const votes = await Votes.find();
	votes.forEach(async vote => {
		const channel = await client.channels.fetch(vote.channel, { cache: false });
		await channel.messages.fetch(vote.message, { cache: true });
	});
};