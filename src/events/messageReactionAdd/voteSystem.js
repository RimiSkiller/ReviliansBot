/**
* @param {import('discord.js').Client} client
* @param {import('discord.js').MessageReaction} reaction
* @param {import('discord.js').User} user
*/
module.exports = async (client, reaction, user) => {
	if (user.id == client.user.id) return;
	if (reaction.message.author.id != client.user.id) return;
	if (!reaction.message.reactions.cache.has('1173758586816561235') && !reaction.message.reactions.cache.has('1173758537227309067')) return;
	if (reaction.emoji != '1173758537227309067' && reaction.emoji != '1173758586816561235') return reaction.remove();
	if (reaction.emoji == '1173758537227309067') {
		const rec2 = reaction.message.reactions.cache.get('1173758586816561235');
		if (rec2) rec2.users.remove(user.id);
	}
	else if (reaction.emoji == '1173758586816561235') {
		const rec2 = reaction.message.reactions.cache.get('1173758537227309067');
		if (rec2) rec2.users.remove(user.id);
	}
};