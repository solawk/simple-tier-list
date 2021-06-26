const ratings = ["S", "A", "B", "C", "D", "E", "F", "Без оценки"];
const ratingColors =
	[
		"rgb(240, 50, 50)",
		"rgb(240, 160, 50)",
		"rgb(240, 240, 50)",
		"rgb(160, 240, 50)",
		"rgb(50, 240, 240)",
		"rgb(50, 130, 240)",
		"rgb(80, 0, 240)",
	];

async function getPrepods(ip)
{
	const url = ip ? "/api/prepods?ip=" + ip : "/api/prepods";

	const res = await fetch(url,
		{
			method: "GET",
			headers: { "Accept": "application/json" }
		});

	if (res.ok)
	{
		const receivedPrepods = await res.json();
		receivedPrepods.sort((a, b) => { return a.name.localeCompare(b.name) });
		return receivedPrepods;
	}
	else
	{
		console.log("Couldn't fetch :(");
		return null;
	}
}