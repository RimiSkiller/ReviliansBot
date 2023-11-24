const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { proof, mainserver } = require('../../../../config.json');
const Mutes = require('../../../models/mutes');
const ms = require('ms');
/**
 * @param {import('discord.js').Client} client
 * @param {{member: String, staff: String, time: Number, proof: Buffer, reason: String }} muteData
 */
module.exports = async (client, muteData, timestamp) => {
	const channel = client.channels.cache.get(proof.mute);
	const memberMutes = (await Mutes.find({ member: muteData.member })).length + 1;
	const staffMutes = (await Mutes.find({ Staff: muteData.staff })).length + 1;
	const member = await client.users.fetch(muteData.member, { cache: false });

	const image = new AttachmentBuilder(muteData.proof, { name: 'proof.png' });
	const proofEmbed = new EmbedBuilder()
		.setAuthor({ name: `[${member.username}] Mute #${memberMutes}`, iconURL: member.avatarURL() })
		.setColor(0x5865f2)
		.addFields(
			{ name: '● Member:', value: `<@${muteData.member}> (${muteData.member})` },
			{ name: '● Staff:', value: `<@${muteData.staff}> (${muteData.staff})` },
			{ name: '● Duration', value: ms(muteData.time, { long: true }) },
			{ name: '● Reason:', value: muteData.reason },
		)
		.setImage('attachment://proof.png')
		.setFooter({ text: client.guilds.cache.get(mainserver).name, iconURL: client.guilds.cache.get(mainserver).iconURL() })
		.setTimestamp(timestamp);

	const newmsg = await channel.send({ content: `## <@${muteData.staff}> **\`#${staffMutes}\`**`, embeds: [proofEmbed], files: [image] });
	require('./addButtons')(newmsg);
	await new Mutes({ member: muteData.member, staff: muteData.staff, embed: newmsg.embeds[0].data }).save();
};