# simple-tier-list
Simple tier list application to rate my university professors for fun. Made with Node.js + Express + Mongoose.

Generates a MongoDB collection, model Prepod stores information about the professors and their ratings, supplied with the ip-addresses of the voters.
Professors are stored in the **prepodsList.json** file, adding a person there makes the server add them to the database, info editing or removal is done manually.

Page **rating** displays a table of the professors and allows to assign them tiers from S to F, also allows not to rate one.
Rating instantly sends a POST request to update the database, so no submit button is needed.

Page **stats** displays the tier list and puts the professors' names in it, depending on their average rating.
