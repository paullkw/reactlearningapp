const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    title:{
        type:String,
        required: '{PATH} is required'
    },
    questionSets:[
        {type: mongoose.Schema.Types.ObjectId, ref:'QuestionSet'}
    ],
})

module.exports = mongoose.model('Quiz',QuizSchema)