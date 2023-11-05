const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { proof } = require('../../../../config.json');
const ms = require('ms');
const Mutes = require('../../../models/mutes');

/**
 * @param {import('discord.js').CommandInteraction} interaction
*/
module.exports = async (interaction) => {
	const mute = {
		member: null,
		reason: null,
		time: null,
	};
	await interaction.editReply({ content: '**● Send the muted member id:**', components: [] });
	while (!mute.member) {
		const mem = await require('../../../utils/getMessage')(interaction);
		if (mem == 'no-res-1') return interaction.editReply('**⌛ - Timeout.**');
		if (!await (interaction.client.users.fetch(mem).catch(() => null))) interaction.editReply('**❌ - Invalid id, try sending a valid id:**');
		else mute.member = mem;
	}

	await interaction.editReply({ content: '**● Send the reason for muting:**', components: [] });
	const reason = await require('../../../utils/getMessage')(interaction);
	if (reason == 'no-res-1') return interaction.editReply('**⌛ - Timeout.**');
	mute.reason = reason;

	const { default: pms } = await import('pretty-ms');
	await interaction.editReply({ content: '**● Send the time of muting (5m, 6h, 2d):**', components: [] });
	while (!mute.time) {
		const time = await require('../../../utils/getMessage')(interaction);
		if (time == 'no-res-1') return interaction.editReply('**⌛ - Timeout.**');
		if (!ms(time)) interaction.editReply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');
		else mute.time = pms(ms(time), { verbose: true });
	}
	await interaction.editReply({ content: '**● Send the proof image (upload/url):**', components: [] });
	const image = await require('../../../utils/getMessage')(interaction);
	if (image == 'no-res-1') return interaction.editReply('**⌛ - Timeout.**');

	const mutes = await Mutes.where('member').equals(mute.member);

	const file = new AttachmentBuilder(image, { name: 'proof.png' });
	const embed = new EmbedBuilder()
		.setTitle(`Mute Proof #${mutes.length + 1}`)
		.setImage('attachment://proof.png')
		.setColor('5865f2')
		.addFields(
			{ name: '● Member:', value: `<@${mute.member}> (${mute.member})` },
			{ name: '● Staff:', value: `<@${interaction.user.id}> (${interaction.user.id})` },
			{ name: '● Reason:', value: mute.reason },
			{ name: '● Duration', value: mute.time },
		)
		.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
		.setTimestamp(interaction.createdTimestamp);

	const button1 = new ButtonBuilder()
		.setCustomId('yes')
		.setLabel('Yes')
		.setStyle(ButtonStyle.Success);
	const button2 = new ButtonBuilder()
		.setCustomId('no')
		.setLabel('No')
		.setStyle(ButtonStyle.Secondary);
	const row = new ActionRowBuilder().addComponents(button1, button2);
	const reply = await interaction.editReply({ content: '**● Is this right?**', embeds: [embed], files: [file], components: [row] });
	const res = await require('../../../utils/getButton')(reply);
	if (res == 'no-res-3' || res == 'no') return interaction.editReply({ content: '**🗑️ - Canceled.**', components: [], embeds: [], files: [] });
	await interaction.deleteReply();
	await interaction.channel.send(`**✅ - ${interaction.user}, Mute proof has been registered successfully.**`);
	const e = (await interaction.client.channels.cache.get(proof.mute).send({ embeds: [embed], files: [file] })).embeds[0];
	await new Mutes({
		number: mutes.length + 1,
		member: mute.member,
		embed: e,
	}).save();
};