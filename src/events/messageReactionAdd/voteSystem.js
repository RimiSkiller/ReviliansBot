/**
* @param {import('discord.js').Client} client
* @param {import('discord.js').MessageReaction} reaction
* @param {import('discord.js').User} user
*/
module.exports = async (client, reaction, user) => {
	if (user.id == client.user.id) return;
	if (reaction.message.author.id != client.user.id) return;
	if (!reaction.message.reactions.cache.has('1193689536191012967') && !reaction.message.reactions.cache.has('1193689532764270623')) return;
	if (reaction.emoji != '1193689532764270623' && reaction.emoji != '1193689536191012967') return reaction.remove();
	if (reaction.emoji == '1193689532764270623') {
		const rec2 = reaction.message.reactions.cache.get('1193689536191012967');
		if (rec2) rec2.users.remove(user.id);
	}
	else if (reaction.emoji == '1193689536191012967') {
		const rec2 = reaction.message.reactions.cache.get('1193689532764270623');
		if (rec2) rec2.users.remove(user.id);
	}
};