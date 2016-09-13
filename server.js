
//scraping tools
var cheerio = require('cheerio');
var request = require('request');


//dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
//var logger = require('morgan');
var mongoose = require('mongoose');


//make a ublic static directory 
app.use(express.static('public'));

//database configuration with mongoose
mongoose.connect('mongodb://localhost/');

var db = mongoose.connection;

//show any mongoose errors

db.on('error', function(err){
	console.log('Mongoose Error: ', err);
});

//once logged in to the db through mongoose, log a success message
db.once('open', function(){
	console.log('Mongoose connection successfull')
});

//require the other files
var Note = require('./models/Note.js');
var Article = require('./models/Article.js')

//ROUTES SET UP

app.get('/', function(req, res) {
  res.send(index.html);
});

app.get('/scape', function(req, res) {
	request('http://www.articlesfactory.com/', function(error, response, html){
		
		var $ = cheerio.load(html);
		
		//"h2-center" article title from website
		$('h2-center').each(function(i, element){


		//save an empty result object
			var result = {};
			//grab the text from the a tag 
			result.title = $(this).children('a').text();
			
			//console.log(result.title);

			//grab the link from the a tag and display as link.
			result.link = $(this).children('a').attr('href');
			//console.log(result.link);
			//creating a new entry
			//passes the result object to the entry
			var entry = new Article(result);

			//save entry to db
			//check for errors as well
			entry.save(function(err, doc){
				if (err){
					console.log(err)
				 } 
				else{
					res.json(doc);
				 }
				});
		});
	});

	res.send("Scrape Complete");

});

app.get('/articles', function(req, res){

	Article.find({}, function(err, doc){
		//log errors
		if(err){
			console.log(err);
		}
		else{
			res.json(doc);
		}
	});
});

app.get('/articles/:id', function(req,res){
	Article.findOne({'_id': req.params.id})
	.popuate('note')

	.exec(function(err, doc){
		if(err){
			console.log(err);
		}
		else{
			res.json(doc);
		}
	});
});

app.post('/articles/:id', function(req, res){
	// create a new note and pass the req.body to the entry.
	var newNote = new Note(req.body);

	// and save the new note the db
	newNote.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		} 
		// otherwise
		else {
			// using the Article id passed in the id parameter of our url, 
			// prepare a query that finds the matching Article in our db
			// and update it to make it's lone note the one we just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});



app.listen(3000, function(){
	console.log('App is listening on port 3000!')
});


// request('http://www.articlesfactory.com/', function(err, response, html){
// 	//catch err in the beginning
// 	if (err){
// 		throw err;
// 	} 

// 	var $ = cheerio.load(html)
// })