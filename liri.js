//	LIRI.JS

require("dotenv").config();
var fs = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require('./keys.js');

  var spotify = new Spotify(keys.spotify);
  var client = new Twitter(keys.twitter);

var cmd = process.argv[2];
var query = process.argv.slice(3).join(" ");

	if (!query) {
		if (cmd == "spotify-this-song") {
			query = "The Sign Ace of Base";

		} else if (cmd == "movie-this") {
			query = "Mr. Nobody";
		}
	}

execute();

function execute() {

	console.log("QUERY " + query);

	if (cmd == "my-tweets") {

		var params = {screen_name: 'MrMens3'};

		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				for (var i = 0; i < tweets.length; i++) {
					console.log("\n" + tweets[i].text);
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
			var obj = JSON.parse(body);
			console.log('\nTitle:', obj.Title);
			console.log('\nYear:', obj.Year);
			console.log('\nRating: ' + obj.Ratings[0].Source + "-" + obj.Ratings[0].Value);
			console.log('\nRating: ' + obj.Ratings[1].Source + "-" + obj.Ratings[1].Value);
			console.log('\nCountry: ' + obj.Country);
			console.log('\nLanguage: ' + obj.Language);
			console.log('\nPlot: ' + obj.Plot);
			console.log('\nActors: ' + obj.Actors);
		});

	} else if (cmd == "do-what-it-says") {

		fs.readFile("random.txt", "utf8", (err, data) => {
			if (err) {console.log(err);}
			var array = data.split(",");
			cmd = array[0];
			query = array[1];
			execute();
		});

	} else {

		console.log("INVALID COMMAND!");

	}
}