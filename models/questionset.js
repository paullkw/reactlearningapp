const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSetSchema = new Schema({
    title:{
        type:String,
        required: '{PATH} is required'
    },
    questions: [{ 
        id: 'string',
        question : 'string', 
        options: [{
            id: 'string',
            option: 'string',
            isAnswer: 'boolean',
        }],
        correctCount: 'number' }]
},{
    timestamps: true
})

module.exports = mongoose.model('QuestionSet',QuestionSetSchema)