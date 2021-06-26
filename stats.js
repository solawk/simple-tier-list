let prepods = null;

function setupTierlist()
{
	const contentDiv = document.getElementById("content");
	const tierlistTable = document.createElement("table");
	tierlistTable.style.width = "100%";
	tierlistTable.style.height = "40em";
	tierlistTable.className = "table";
	contentDiv.appendChild(tierlistTable);

	for (const rating of ratings)
	{
		if (rating === "Без оценки")
		{
			continue;
		}

		const tierRow = document.createElement("tr");
		tierlistTable.appendChild(tierRow);

		tierRow.style.height = "14%";
		tierRow.style.border = "0.3em solid #ffffff";

		const tierRating = document.createElement("td");
		const tierPrepods = document.createElement("td");
		tierRow.appendChild(tierRating);
		tierRow.appendChild(tierPrepods);

		tierRating.innerHTML = rating;
		tierRating.style.width = "auto";
		tierRating.style.padding = "0.3em";
		tierRating.style.color = "#eeeeee";
		tierRating.style.textAlign = "center";
		tierRating.style.backgroundColor = ratingColors[ratings.indexOf(rating)];
		tierRating.style.fontSize = "3em";
		tierRating.style.fontWeight = "bold";
		tierRating.style.textShadow = "black 0px 0px 4px";

		tierPrepods.style.backgroundColor = "#333333";
		tierPrepods.style.color = "#eeeeee";
		tierPrepods.style.padding = "2em";
		tierPrepods.id = rating;
	}
}

function processAllPrepods()
{
	for (const prepod of prepods)
	{
		processPrepod(prepod);
	}
}

function processPrepod(prepod)
{
	const rating = evaluatePrepod(prepod, average);

	if (rating == null) return; // No ratings

	if (document.getElementById(rating).innerHTML !== "")
	{
		document.getElementById(rating).innerHTML += "&#160;&#160;&#160;&#160;";
	}

	let tooltip = generateTooltip(prepod);

	const prepodHTML = '<div class="mytooltip">' + prepod.name + '<span class="mytooltiptext">&nbsp;' + tooltip + '&nbsp;</span></div>';
	document.getElementById(rating).innerHTML += prepodHTML;
}

function generateTooltip(prepod)
{
	const tooltipRatingStructs = {};

	for (const r of ratings)
	{
		if (r === "Без оценки") continue;

		tooltipRatingStructs[r] = 0;
	}

	for (const ratingStruct of prepod.ratings)
	{
		tooltipRatingStructs[ratingStruct.rating]++;
	}

	let tooltip = "";

	for (const r of ratings)
	{
		if (r === "Без оценки") continue;

		tooltip += "<b>" + r + "</b>:&nbsp;" + tooltipRatingStructs[r] + (r !== ratings[ratings.length - 2] ? ",&nbsp;" : "");
	}

	return tooltip;
}

function evaluatePrepod(prepod, evalFunc)
{
	const ratingsInts = [];

	for (const ratingStruct of prepod.ratings)
	{
		const ratingInt = ratings.indexOf(ratingStruct.rating);
		ratingsInts.push(ratingInt);
	}

	const bias = 0.001;
	const finalRatingFloat = evalFunc(ratingsInts) - bias;
	const finalRatingInt = Math.round(finalRatingFloat);

	return ratings[finalRatingInt];
}

function average(input)
{
	let sum = 0;

	for (const num of input)
	{
		sum += num;
	}

	return sum / input.length;
}

async function init()
{
	prepods = await getPrepods(null);
	document.body.removeChild(document.getElementById("pending"));
	setupTierlist();
	processAllPrepods();
}

init();