const pb = {
	le: '<:5499lb2g:1174776037410885662>',
	me: '<:2827l2g:1174776040330104852>',
	re: '<:2881lb3g2:1174776041965899816>',
	lf: '<:5988lbg:1174776051247894630>',
	mf: '<:3451lg:1174776048852946944>',
	rf: '<:3166lb4g:1174776063373627422>',
};

module.exports = (upvotes = 0, downvotes = 0) => {
	const totalVotes = upvotes + downvotes;
	const progressBarLength = 12;
	const filledSquares = Math.round((upvotes / totalVotes) * progressBarLength) || 0;
	let emptySquares = progressBarLength - filledSquares || 0;

	if (!filledSquares && !emptySquares) {
		emptySquares = progressBarLength;
	}

	const upPercentage = Math.round((upvotes / totalVotes) * 100) || 0;
	const downPercentage = Math.round((downvotes / totalVotes) * 100) || 0;

	const progressBar =
		(filledSquares ? pb.lf : pb.le) +
		(pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
		(filledSquares === progressBarLength ? pb.rf : pb.re);

	return { pb: progressBar, uPer: upPercentage, dPer: downPercentage };
};