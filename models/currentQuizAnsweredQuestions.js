const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CurrentQuizAnsweredQuestionSchema = new Schema({
    quiz:{
        type: mongoose.Schema.Types.ObjectId, ref:'Quiz'
    },
    question:{
        type: String
    }
    
})

module.exports = mongoose.model('CurrentQuizAnsweredQuestion',CurrentQuizAnsweredQuestionSchema)