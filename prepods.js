const ratings = ["S", "A", "B", "C", "D", "E", "F", "Без оценки"];
const ratingColors =
	[
		"rgb(200, 50, 50)",
		"rgb(200, 130, 50)",
		"rgb(200, 200, 50)",
		"rgb(130, 200, 50)",
		"rgb(50, 200, 200)",
		"rgb(80, 130, 200)",
		"rgb(80, 80, 200)",
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
		return await res.json();
	}
	else
	{
		console.log("Couldn't fetch :(");
		return null;
	}
}