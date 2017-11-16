var keys = require("./keys");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var imdb = require('imdb-api');
var inquirer = require('inquirer');

var twitterKeys = new Twitter(keys.twitterKeys);
var spotifyKeys = new Spotify(keys.spotifyKeys);
var imdbkey = keys.imdbKeys.apiKey
var choice;

function askQuestion() {
  
	inquirer.prompt([
	  {
	    name: "choice",
	    message: "What do you want to do?",
	    type: 'list',
	    choices: [
	    	"Twitter",
	    	"Spotify",
	    	"IMDB"
	    ]
	  }
	]).then(function(answers) {
		choice = answers.choice;
		if(choice === 'Twitter'){
			inquirer.prompt([
				{
					name: "choice2",
					message: "What is your screen name?",
					default: 'Twitter'
				},
				{
					name: "choice3",
					message: "What subject do want to look for?"
				}
			]).then(function(answers){
				choice2 = answers.choice2;
				choice3 = answers.choice3;
				var params = {screen_name: choice2};
				twitterKeys.get('search/tweets', {q: choice3}, function(error, tweets, response) {
					for(i=0;i<21;i++){
						if(tweets.statuses[i] != undefined)
						{
							console.log(JSON.stringify(tweets.statuses[i].text) + "\n");
						}else{
							console.log("No avalible tweets")
							break;
						}
			
					}
				});
			})

		}else if(choice === 'Spotify'){
			inquirer.prompt([
				{
					name: 'choice2',
					message: "What song do you want to look for?",
					default: "I want it that way"
				}

			]).then(function(answers){
				choice2 = answers.choice2

				spotifyKeys.search({ type: 'track', query: choice2}, function(err, data) {
					var spotifyArr = data.tracks.items[0].album.artists[0];
					if (err) {
						return console.log('Error occurred: ' + err);
					}
					console.log("Artist: " + spotifyArr.name); 
					console.log("Song: " + data.tracks.items[0].name)
					console.log("Album: " + data.tracks.items[0].album.name)
					console.log("Link: " + data.tracks.items[0].album.external_urls.spotify)
				});

			})
			
		}else if(choice === "IMDB"){
			inquirer.prompt([
				{
					name: 'choice2',
					message: "What moive do you want to look for?",
					default : 'Mr.Nobody'
				}

			]).then(function(answers){
				choice2 = answers.choice2;

				imdb.get(choice2, {apiKey: imdbkey}, function(error,data,response) {
					console.log(data.title);
					console.log(data.year);
					if(data.ratings[1] != undefined){
						console.log(data.ratings[1].Value)
					}else{
						console.log(data.ratings[0].Value)
					}
					console.log(data.country)
					console.log(data.languages)
					console.log(JSON.stringify(data.plot))
					console.log(data.actors)

				});
			});
		}



	});
};

askQuestion();


	



