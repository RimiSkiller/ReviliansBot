const { ChannelType } = require('discord.js');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Channel} channel
 */
module.exports = async (client, channel) => {
	if (channel.type != ChannelType.GuildText) return;
	if (channel.guildId != client.mainServer.id) return;
	const newName = channel.name.split('-')
		.map(str => str[0].replace('a', '𝖠')
			.replace('b', '𝖡')
			.replace('c', '𝖢')
			.replace('d', '𝖣')
			.replace('e', '𝖤')
			.replace('f', '𝖥')
			.replace('g', '𝖦')
			.replace('h', '𝖧')
			.replace('i', '𝖨')
			.replace('j', '𝖩')
			.replace('k', '𝖪')
			.replace('l', '𝖫')
			.replace('m', '𝖬')
			.replace('n', '𝖭')
			.replace('o', '𝖮')
			.replace('p', '𝖯')
			.replace('q', '𝖰')
			.replace('r', '𝖱')
			.replace('s', '𝖲')
			.replace('t', '𝖳')
			.replace('u', '𝖴')
			.replace('v', '𝖵')
			.replace('w', '𝖶')
			.replace('x', '𝖷')
			.replace('y', '𝖸')
			.replace('z', '𝖹') + str.substring(1));
	channel.setName(`•︱${newName.join('︲')}`);
};