//require mongoose
var mongoose = require('mongoose');

//create schema class
var Schema = mongoose.Schema;

//create Article Schema
var ArticleSchema = new Schema({
	//title is required
	//grab title from site, declaring
	title: {
		type:String,
		required:true
	},

	link:{
		type:String,
		required:true
	},
	//this only saves one note's ObjectID. ref refers to the Note model.
	note:{
		type: Schema.Types.ObjectId,
		ref:'Note'
	}
});
//create the article model with ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);



//put this at the end
module.exports = Article;