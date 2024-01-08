const pb = {
	le: '<:LeftE:1193684847814770708>',
	me: '<:MiddleE:1193684846397108244>',
	re: '<:RightE:1193684843947634698>',
	lf: '<:LeftF:1193686847814115368>',
	mf: '<:MiddleF:1193686142839705660>',
	rf: '<:RightF:1193684838205636659>',
};

module.exports = (upvotes = 0, downvotes = 0, progressBarLength = 12) => {
	const totalVotes = upvotes + downvotes;
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