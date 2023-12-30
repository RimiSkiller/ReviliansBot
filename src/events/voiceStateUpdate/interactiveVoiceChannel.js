const { interactiveVoice } = require('../../../configs/config.json');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').VoiceState} oldState
 * @param {import('discord.js').VoiceState} newState
 */
module.exports = async (client, oldState, newState) => {
	if (oldState.channelId != interactiveVoice && newState.channelId == interactiveVoice) newState.channel.setUserLimit(newState.channel.members.size + 1);
	else if (oldState.channelId == interactiveVoice && newState.channelId != interactiveVoice) oldState.channel.setUserLimit(oldState.channel.members.size + 1);
};