let clientIP = null; // I don't use it for evil purposes, pinky promise
let prepods = null;

async function getIP()
{
	const ip = await fetch("http://api.ipify.org",
		{
			method: "GET",
			headers: { "Accept": "application/text" }
		});

	if (ip.ok)
	{
		clientIP = await ip.text();
	}
}

async function putRating(prepodName, rating)
{
	await fetch("/api/prepods?ip=" + clientIP + "&prepod=" + prepodName + "&rating=" + rating,
		{
			method: "PUT",
			headers: { "Accept": "application/json" }
		});
}

function appendPrepod(prepod, listElement)
{
	const prepodRow = document.createElement("tr");
	listElement.appendChild(prepodRow);

	const prepodRowInfo = document.createElement("td");
	prepodRowInfo.innerHTML = "<b>" + prepod.name + "</b> – " + prepod.desc;
	prepodRow.appendChild(prepodRowInfo);

	const prepodRowRating = document.createElement("td");
	prepodRow.appendChild(prepodRowRating);
	appendRatingStuff(prepod, prepodRowRating);
}

function appendRatingStuff(prepod, ratingDiv)
{
	for (const rating of ratings)
	{
		const thisSelected = prepod.myRating === rating;

		const ratingButton = document.createElement("input");
		ratingButton.type = "radio";
		ratingButton.name = prepod.name + "Rating Group";
		ratingButton.id = prepod.name + " Rating " + rating;
		ratingButton.value = rating;
		if (thisSelected)
		{
			ratingButton.checked = true;
		}
		const ratingButtonLabel = document.createElement("label");
		ratingButtonLabel.for = prepod.name + " Rating " + rating;
		ratingButtonLabel.innerHTML = rating;
		const separatorSpan = document.createElement("span");
		separatorSpan.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";

		ratingDiv.appendChild(ratingButton);
		ratingDiv.appendChild(ratingButtonLabel);
		ratingDiv.appendChild(separatorSpan);

		ratingButton.onchange = () =>
		{
			putRating(prepod.name, rating);
		}
	}
}

async function init()
{
	await getIP();
	prepods = await getPrepods(clientIP);
	document.body.removeChild(document.getElementById("pending"));
	displayPrepodsRatingTable();
}

function displayPrepodsRatingTable()
{
	const contentDiv = document.getElementById("content");
	const table = document.createElement("table");
	table.className = "table";
	table.id = "prepodList";
	contentDiv.appendChild(table);
	const tableHead = document.createElement("thead");
	table.appendChild(tableHead);
	const tableHeadRow = document.createElement("tr");
	tableHead.appendChild(tableHeadRow);
	const tableHeaderPrepod = document.createElement("th");
	tableHeaderPrepod.scope = "col";
	tableHeaderPrepod.innerHTML = "Преподаватель";
	const tableHeaderRating = document.createElement("th");
	tableHeaderRating.scope = "col";
	tableHeaderRating.innerHTML = "Оценка";
	tableHeadRow.appendChild(tableHeaderPrepod);
	tableHeadRow.appendChild(tableHeaderRating);
	const tableBody = document.createElement("tbody");
	table.appendChild(tableBody);

	prepods.sort((a, b) => { return a.name.localeCompare(b.name) });

	prepods.forEach(prepod =>
	{
		appendPrepod(prepod, tableBody);
	});
}

init();