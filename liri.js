require("dotenv").config();
var fs = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require('./keys.js');

  var spotify = new Spotify(keys.spotify);
  var client = new Twitter(keys.twitter);


var cmd = process.argv[2];
var query = [];

//	Building our query
for (var i = 3; i < process.argv.length; i++) {
	query[i-3] = process.argv[i];
}

console.log("QUERY " + query);

if (!query[0]) {

	if (cmd == "spotify-this-song") {
		query = "The Sign Ace of Base";
	} else if (cmd == "movie-this") {
		query = "Mr. Nobody";
	}

}


if (cmd == "my-tweets") {

	var params = {screen_name: 'MrMens3'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
			}
		} else {
			console.log(error);
		}
	});

} else if (cmd == "spotify-this-song") {

	spotify
		.search({type: 'track', query: query})
		.then(function(response) {

					var obj = response.tracks.items[0];

					var arr = [];

					for (var i = 0; i < obj.artists.length; i++) {
						arr.push(obj.artists[i].name);
					}

					console.log("\nArtist(s): " + arr);
					console.log("\nName: " + obj.name);
					console.log("\nLink: " + obj.external_urls.spotify);
					console.log("\nAlbum: " + obj.album.name);
					console.log("\nPopularity: " + obj.popularity);

		})
		.catch(function(err) {
			console.log(err);
		});

} else if (cmd == "movie-this") {

	var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + query + "&type=movie&r=json";
	
	request(queryURL, function (error, response, body) {
		console.log('Title:', JSON.parse(body).Title);
		console.log('Year:', JSON.parse(body).Year);
		console.log('Rating: ' + JSON.parse(body).Ratings[0].Source + "-" + JSON.parse(body).Ratings[0].Value);
		console.log('Rating: ' + JSON.parse(body).Ratings[1].Source + "-" + JSON.parse(body).Ratings[1].Value);
		console.log('Country: ' + JSON.parse(body).Country);
		console.log('Language: ' + JSON.parse(body).Language);
		console.log('Plot: ' + JSON.parse(body).Plot);
		console.log('Actors: ' + JSON.parse(body).Actors);
	})

} else if (cmd == "do-what-it-says") {

	fs.readFile("random.txt", "utf8", (err, data) => {
		if (err) {
			console.log(err);
		}
		cmd = data;
		eval("node " + cmd);
	});

} else {

		console.log("YOU GOTTA ENTER A VALID COMMAND!");

}