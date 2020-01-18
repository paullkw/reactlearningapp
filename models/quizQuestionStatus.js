const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizQuestionStatusSchema = new Schema({
    quiz:{
        type: mongoose.Schema.Types.ObjectId, ref:'Quiz'
    },
    question:{
        type: String
    },
    consecutiveCorrectCount:{
        type: Number
    }
})

module.exports = mongoose.model('QuizQuestionStatus',QuizQuestionStatusSchema)