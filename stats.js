let prepods = null;

function setupTierlist()
{
	const contentDiv = document.getElementById("content");
	const tierlistTable = document.createElement("table");
	tierlistTable.style.width = "100%";
	tierlistTable.style.height = "40em";
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
		tierRating.style.width = "10%";
		tierRating.style.color = "#eeeeee";
		tierRating.style.textAlign = "center";
		tierRating.style.backgroundColor = ratingColors[ratings.indexOf(rating)];
		tierRating.style.fontSize = "2em";

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

	document.getElementById(rating).innerHTML += "&nbsp;&nbsp;" + prepod.name;
}

function evaluatePrepod(prepod, evalFunc)
{
	const ratingsStructs = prepod.ratings;
	const ratingsInts = [];

	for (const ratingStruct of ratingsStructs)
	{
		const ratingInt = ratings.indexOf(ratingStruct.rating);
		ratingsInts.push(ratingInt);
	}

	const finalRatingFloat = evalFunc(ratingsInts);
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