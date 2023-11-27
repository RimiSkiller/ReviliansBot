const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { proof, mainserver, muteRole } = require('../../../../config.json');
const Mutes = require('../../../models/mutes');
const TRoles = require('../../../models/temproles');
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

	const button1 = new ButtonBuilder()
		.setCustomId('sub')
		.setLabel('Submit Proof')
		.setStyle(ButtonStyle.Primary);
	const button2 = new ButtonBuilder()
		.setCustomId('cancel')
		.setLabel('No proof')
		.setStyle(ButtonStyle.Danger);


	const reply = await channel.send({ content: `## <@${muteData.staff}>, Please click on the button to provide a proof.`, embeds: [proofEmbed], components: [new ActionRowBuilder().addComponents(button1, button2)] });


	const regSec = async (resM) => {
		const file = new AttachmentBuilder(resM, { name: 'proof.png' });
		const newmsg = await reply.edit({ content: `## <@${muteData.staff}> **\`#${staffMutes}\`**`, files: [file], components: [] });
		require('./addButtons')(newmsg);
		await new Mutes({
			staff: muteData.staff,
			member: muteData.member,
			embed: newmsg.embeds[0].data,
		}).save();
	};


	let resB = await require('../../../utils/getButton')(reply, muteData.staff, 600000);
	if (resB == 'sub') {
		await reply.edit({ content: '**● Send the proof image file or url in this channel.**', components: [new ActionRowBuilder().addComponents(button1.setDisabled(true).setLabel('Submitting'))] });
		channel.permissionOverwrites.create(muteData.staff, { SendMessages: true });

		const resM = await require('../../../utils/getMessage')(muteData.staff, channel, 300000);
		if (resM == 'no-res') resB = 'no-res';
		else regSec(resM);

		channel.permissionOverwrites.delete(muteData.staff);
	}
	if (resB == 'no-res' || resB == 'cancel') {
		const m = await client.guilds.cache.get(mainserver).members.fetch(member.id);
		m.roles.remove(muteRole);
		await TRoles.findOne({ role: muteRole, member: muteData.member }).deleteOne();
		await reply.delete();
		client.channels.cache.get(proof.nomute).send({ content: `**● <@${muteData.staff}> muted <@${muteData.member}> (${muteData.member}) without a proof.**`, embeds: [proofEmbed] });
	}
};