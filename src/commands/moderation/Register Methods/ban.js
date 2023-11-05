const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { proof } = require('../../../../config.json');
const ms = require('ms');
const Bans = require('../../../models/bans');

/**
 * @param {import('discord.js').CommandInteraction} interaction
*/
module.exports = async (interaction) => {
	const ban = {
		member: null,
		reason: null,
		time: null,
	};
	await interaction.editReply({ content: '**● Send the banned member id:**', components: [] });
	while (!ban.member) {
		const mem = await require('../../../utils/getMessage')(interaction);
		if (mem == 'no-res-1') return interaction.editReply('**⌛ - Timeout.**');
		if (!await (interaction.client.users.fetch(mem).catch(() => null))) interaction.editReply('**❌ - Invalid id, try sending a valid id:**');
		else ban.member = mem;
	}

	await interaction.editReply({ content: '**● Send the reason for banning:**', components: [] });
	const reason = await require('../../../utils/getMessage')(interaction);
	if (reason == 'no-res-1') return interaction.editReply('**⌛ - Timeout.**');
	ban.reason = reason;

	const { default: pms } = await import('pretty-ms');
	await interaction.editReply({ content: '**● Send the time of banning (5m, 6h, 2d) or "skip":**', components: [] });
	while (!ban.time) {
		const time = await require('../../../utils/getMessage')(interaction);
		if (time.toLowerCase() == 'skip') {
			ban.time = null;
			break;
		}
		if (time == 'no-res-1') return interaction.editReply('**⌛ - Timeout.**');
		if (!ms(time)) interaction.editReply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');
		else ban.time = pms(ms(time), { verbose: true });
	}

	await interaction.editReply({ content: '**● Send the proof image (upload/url):**', components: [] });
	const image = await require('../../../utils/getMessage')(interaction);
	if (image == 'no-res-1') return interaction.editReply('**⌛ - Timeout.**');

	const bans = await Bans.where('member').equals(ban.member);

	const file = new AttachmentBuilder(image, { name: 'proof.png' });
	const embed = new EmbedBuilder()
		.setTitle(`Ban Proof #${bans.length + 1}`)
		.setImage('attachment://proof.png')
		.addFields(
			{ name: '● Member:', value: `<@${ban.member}> (${ban.member})` },
			{ name: '● Staff:', value: `<@${interaction.user.id}> (${interaction.user.id})` },
			{ name: '● Reason:', value: ban.reason },
		)
		.setFooter({ text: interaction.guild.name, iconURL: interaction.client.guilds.cache.get('1167142414893469827').iconURL() })
		.setTimestamp(interaction.createdTimestamp);
	if (ban.time) embed.addFields({ name: '● Duration:', value: ban.time });
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
	await interaction.channel.send(`**✅ - ${interaction.user}, Ban proof has been registered successfully.**`);
	const e = (await interaction.client.channels.cache.get(proof.ban).send({ embeds: [embed], files: [file] })).embeds[0];
	await new Bans({
		number: bans.length + 1,
		member: ban.member,
		embed: e,
	}).save();
};