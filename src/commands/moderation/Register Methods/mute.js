const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { proof, mainserver } = require('../../../../config.json');
const Mutes = require('../../../models/mutes');

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {{ member: String, time: String, reason: String }} mute
*/
module.exports = async (interaction, mute) => {
	const memberNumber = (await Mutes.where('member').equals(mute.member)).length;
	const staffNumber = (await Mutes.where('staff').equals(interaction.user.id)).length;

	const embed = new EmbedBuilder()
		.setTitle(`Mute Proof #${memberNumber + 1}`)
		.setColor('5865f2')
		.addFields(
			{ name: '● Member:', value: `<@${mute.member}> (${mute.member})` },
			{ name: '● Staff:', value: `<@${interaction.user.id}> (${interaction.user.id})` },
			{ name: '● Duration', value: mute.time },
			{ name: '● Reason:', value: mute.reason },
		)
		.setFooter({ text: interaction.guild.name, iconURL: interaction.client.guilds.cache.get(mainserver).iconURL() })
		.setTimestamp(interaction.createdTimestamp);

	const button1 = new ButtonBuilder()
		.setCustomId('sub')
		.setLabel('Submit Proof')
		.setStyle(ButtonStyle.Primary);

	const channel = interaction.client.channels.cache.get(proof.mute);

	const regSec = async (resM) => {
		const file = new AttachmentBuilder(resM, { name: 'proof.png' });
		embed.setImage('attachment://proof.png');
		const embed1 = (await reply.edit({ content: `**\`#${staffNumber + 1}\`**`, embeds: [embed], files: [file], components: [] })).embeds[0];
		await new Mutes({
			staff: interaction.user.id,
			member: mute.member,
			embed: embed1.data,
		}).save();
	};

	const reply = await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [new ActionRowBuilder().addComponents(button1)] });
	let resB = await require('../../../utils/getButton')(reply, interaction.user.id, 600000);
	if (resB == 'sub') {
		await reply.edit({ content: '**● Send the proof image file or url in this channel.**', components: [new ActionRowBuilder().addComponents(button1.setDisabled(true).setLabel('Submitting'))] });
		channel.permissionOverwrites.create(interaction.user.id, { SendMessages: true });

		const resM = await require('../../../utils/getMessage')(interaction, channel, 300000);
		if (resM == 'no-res') resB = 'no-res';
		else regSec(resM);

		channel.permissionOverwrites.delete(interaction.user.id);
	}
	if (resB == 'no-res') {
		interaction.guild.members.cache.get(mute.member).timeout(null);
		await reply.delete();
		interaction.client.channels.cache.get(proof.nomute).send({ content: `**● <@${interaction.user.id}> muted <@${mute.member}> (${mute.member}) without a proof.**`, embeds: [embed] });
	}

};