const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const port = process.env.PORT || 3000;
const app = express();

const rawPrepods = fs.readFileSync("prepodsList.json");
const Prepods = JSON.parse(rawPrepods);

app.listen(port, () =>
{
	console.log("Server up!");
	mongoConnect();
});

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/prepods", (req, res) =>
{
	let clientIP = null;

	if (req.hasOwnProperty("query"))
	{
		clientIP = req.query.ip;
	}

	if (!PrepodModel)
	{
		res.send([]);
		return;
	}

	PrepodModel.find({}, (err, prepods) =>
	{
		if (err)
		{
			console.log(err);
			return;
		}

		const responsePrepods = [];

		for (const prepod of prepods)
		{
			let responsePrepod = null;

			if (clientIP == null) // Wants all ratings
			{
				responsePrepod =
					{
						name: prepod.name,
						desc: prepod.desc,
						ratings: prepod.ratings
					};
			}
			else
			{
				responsePrepod =
					{
						name: prepod.name,
						desc: prepod.desc,
						myRating: null
					};

				let rated = false;

				for (const r of prepod.ratings)
				{
					if (r.ip === clientIP)
					{
						responsePrepod.myRating = r.rating;
						rated = true;
					}
				}

				if (!rated)
				{
					responsePrepod.myRating = "Без оценки";
				}
			}

			responsePrepods.push(responsePrepod);
		}

		res.send(responsePrepods);
	});
});

app.put("/api/prepods", (req, res) =>
{
	const clientIP = req.query.ip;
	const prepodName = req.query.prepod;
	const rating = req.query.rating;

	if (!PrepodModel)
	{
		return;
	}

	PrepodModel.findOne({ name: prepodName }, (err, prepod) =>
	{
		if (err)
		{
			console.log(err);
			return;
		}

		for (const rating of prepod.ratings)
		{
			if (rating.ip === clientIP)
			{
				prepod.ratings.splice(prepod.ratings.indexOf(rating), 1);
			}
		}

		if (rating !== "Без оценки")
		{
			prepod.ratings.push({ rating: rating, ip: clientIP });
		}

		prepod.save();
	});
});

app.get("/", (req, res) =>
{
	res.sendFile(__dirname + "/rating.html");
});

app.get("/stats", (req, res) =>
{
	res.sendFile(__dirname + "/stats.html");
});

const Schema = mongoose.Schema;
const PrepodSchema = new Schema
({
	name: String,
	desc: String,
	ratings: [{ rating: String, ip: String }]
});
let PrepodModel = null;

async function mongoConnect()
{
	try
	{
		const connection = await mongoose.connect("mongodb+srv://Server:" + process.env.PASSWORD + "@simpletierlistdb.df96m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
		PrepodModel = connection.model("Prepods", PrepodSchema);
	}
	catch (e)
	{
		console.log(e);
	}

	AddPrepods();
}

function AddPrepods()
{
	for (const prepod of Prepods)
	{
		PrepodModel.find({name: prepod.name}, (err, existingPrepods) =>
		{
			if (err)
			{
				console.log(err);
				return;
			}

			if (existingPrepods.length === 0)
			{
				PrepodModel.create(Object.assign({ratings: []}, prepod), (err, createdPrepod) =>
				{
					if (err)
					{
						console.log(err);
						return;
					}

					console.log("Added " + createdPrepod.name + " to the DB");
				});
			}
		});
	}
}