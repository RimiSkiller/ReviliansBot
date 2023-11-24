const { ApplicationCommandOptionType } = require('discord.js');
const { dev, goods, mainlog } = require('../../../config.json');
const ms = require('ms');
const TRoles = require('../../models/temproles');

module.exports = {
	name: 'buy',
	description: 'Buying one of the services available in the server.',
	options: [
		{
			name: 'service',
			description: 'The service you want to buy.',
			required: true,
			type: ApplicationCommandOptionType.String,
			choices: goods.map(m => m = { name: `${m.name}: $${m.price} credites.`, value: m.value }),
		},
	],

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const { default: pms } = await import('pretty-ms');
		const logger = (m) => client.channels.cache.get(mainlog).send(m);
		const choise = interaction.options.get('service').value;
		const role = goods[Number(choise)];

		await interaction.reply(`**🛒 - You ordered: \`${role.name}\`, Price: \`$${role.price}\` credits.**\n**💵 - Please transfer the amount to <@${dev}> .**`);
		const price = parseInt(role.price);
		let credits = parseInt('0');
		while (credits < price) {
			const filter = { time: 300_000, max: 1, errors: ['time'], filter: m => m.author.id == '282859044593598464' && m.content.startsWith('**:moneybag: | ') && m.mentions.has(dev) && m.content.includes(interaction.user.username) };
			// const filter = { time: 300_000, max: 1, filter: m => m.author.id == interaction.user.id };
			const messages = await interaction.channel.awaitMessages(filter).catch(() => {
				interaction.editReply('**⌛ - Credits transation was not done in 5 minutes.**');
				return null;
			});
			if (!messages) return;
			const creditsS = parseInt(messages.first().content.split('`')[1].slice(1));
			// const creditsS = parseInt(messages.first().content);

			await messages.first().delete();
			credits += Math.round(parseInt(creditsS / 0.95));
			interaction.editReply(`**:moneybag: - You transferred \`$${credits}\`.**\n**➕ - Remaining: \`$${price - credits}\`.**`);
		}
		const data = await TRoles.findOne({ role: role.id, member: interaction.user.id });
		if (data) {
			data.time = Number(data.time) + ms(role.time);
			interaction.editReply(`**💵 - Purchase was done successfully, added \`${pms(ms(role.time), { verbose: true })}\`. Time remaining: \`${ms(data.time - Date.now(), { long: true })} \`**`);
			logger(`**● Automatic (buy):**\`\`\`diff\n+ Added ${ms(role.time, { long: true })} to:\n+ [user: ${interaction.user.username} (${interaction.user.id}), temprole: ${role.name} (${role.id})]\`\`\``);
			await data.save();
		}
		else {
			interaction.member.roles.add(role.id);
			await new TRoles({
				role: role.id,
				member: interaction.user.id,
				time: Date.now() + ms(role.time),
			}).save();
			interaction.editReply('**💵 - Purchase was done successfully.**');
			logger(`**● Automatic (buy):**\`\`\`diff\n+ Added temprole: ${role.name} (${role.id}) to:\n+ user: ${interaction.user.username} (${interaction.id}) for ${ms(role.time, { long: true })}\`\`\``);

		}
	},
};
