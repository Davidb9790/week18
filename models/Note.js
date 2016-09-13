//require mongoose

var mongoose = require('mongoose');

//create schema class
var Schema = mongoose.Schema;

// create the Note schema

var NoteSchema = new Schema({
//just a string
	title:{
		type:String
	},
	//just a string
	body:{
		type:String
	}
});

var Note = mongoose.model('Note', NoteSchema);

//export the Note model
module.exports = Note;