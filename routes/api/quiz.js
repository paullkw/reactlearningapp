const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
let Quiz = require('./../../models/quiz')
let currentQuizAnsweredQuestions = require('./../../models/currentQuizAnsweredQuestions')
let quizQuestionStatus = require('./../../models/quizQuestionStatus')

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

router.route('/add').post(function (req, res) {

    var obj = {
        title: req.body.title,
        questionSets: req.body.questionSets.map(s => mongoose.Types.ObjectId(s))
    }

    let quiz = new Quiz(obj);

    quiz.save()
        .then(quiz => {
            res.status(200).json({ 'quiz': 'Quiz in added successfully' });
        })
        .catch(err => {
            res.status(400).send('unable to save to database');
        })
})

router.route('/update/:id').post(function (req, res) {
    Quiz.findById(req.params.id, function (err, quiz) {
        if (!quiz)
            res.status(404).send("data is not found");
        else {
            quiz.title = req.body.title;
            quiz.questionSets = req.body.questionSets.map(s => mongoose.Types.ObjectId(s));

            quiz.save().then(quiz => {
                res.json('Update complete');
            })
                .catch(err => {
                    res.status(400).send("unable to update the database")
                })
        }
    });
});

router.route('/answerQuestion/:id').post(function (req, res) {

    var obj = {
        quiz: req.params.id,
        question: req.body.questionid 
    }

    let currentQuizAnsweredQuestion = new currentQuizAnsweredQuestions(obj);

    currentQuizAnsweredQuestion.save()
        .then(currentQuizAnsweredQuestion => {
            quizQuestionStatus.findOne({quiz: req.params.id, question: req.body.questionid })
            .then(item =>{
                if (item == null)
                {
                    var obj = {
                        quiz: req.params.id,
                        question: req.body.questionid,
                    }

                    if (req.body.correct)
                    {
                        obj.consecutiveCorrectCount = 1
                    }
                    else
                    {
                        obj.consecutiveCorrectCount = 0
                    }

                    item = new quizQuestionStatus(obj)

                    item.save();
                }
                else
                {
                    if (req.body.correct)
                    {
                        item.consecutiveCorrectCount += 1
                    }
                    else
                    {
                        item.consecutiveCorrectCount = 0
                    }

                    item.save();
                }

            })

            res.status(200).json({ 'quiz': 'Quiz in added successfully' });

        })
        .catch(err => {
            res.status(400).send('unable to save to database');
        })
})


router.route('/edit/:id').get(function (req, res) {
    let id = req.params.id;
    Quiz.findById(id, function (err, quiz) {
        res.json(quiz);
    })
})

router.route('/getquestions/:id').get(function (req, res) {
    let id = req.params.id;

    let questions = []

    currentQuizAnsweredQuestions
    .find({quiz: req.params.id})
    .select('-_id question')
    .then(function(answeredQuestions){

        quizQuestionStatus
        .find({quiz: req.params.id})
        .select('-_id question consecutiveCorrectCount')
        .then(function(questionStatus){

            Quiz.findById(id).populate('questionSets').then(function (quiz) {

                for (i = 0; i < quiz.questionSets.length; i++) {
                    Array.prototype.push.apply(questions, quiz.questionSets[i].questions);
                }

                let list = []
                let questionWithoutCompleted = []


                for(var i = 0; i < questions.length; i++)
                {
                    let hasAnswer = false;
                    let hasCompleted = false;

                    for(var j = 0; j< answeredQuestions.length; j++)
                    {
                        if (questions[i]._id == answeredQuestions[j].question){
                            hasAnswer = true;
                        }
                    }

                    for(var k=0; k < questionStatus.length; k++)
                    {
                        if (questions[i]._id == questionStatus[k].question){
                         
                            if(questionStatus[k].consecutiveCorrectCount >= questions[i].correctCount){
                                hasCompleted = true
                            }
                            else
                            {
                                questionWithoutCompleted.push(questions[i])
                            }
                        }
                    }

                    if (!hasAnswer && !hasCompleted)
                    {
                        list.push(questions[i])
                    }
                }

                if (list.length == 0)
                {
                    list = questionWithoutCompleted

                    currentQuizAnsweredQuestions.deleteMany({quiz: req.params.id}, function(err, items){
                    })
                }

                if (list.length == 0)
                {
                    list = questions

                    quizQuestionStatus.deleteMany({quiz: req.params.id}, function(err, items){

                    })
                }

                for(var i = 0; i < list.length; i++)
                {
                    list[i].options = shuffle(list[i].options)
                }

                shuffle(list)

                res.json(list)
            })
        })
    })
})



router.route('/delete/:id').get(function (req, res) {
    Quiz.findByIdAndRemove({ _id: req.params.id }, function (err, quiz) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    })
})

router.route('/').get(function (req, res) {
    Quiz.find().populate('questionSets').lean().exec(function (err, quizzes) {
        
        if (err){
            console.log(err)
            return;
            
        }

        var QuizIDs;

        QuizIDs = quizzes.map(function (quiz) { return quiz._id; });
 
        currentQuizAnsweredQuestions.find({quiz: {$in: QuizIDs}},function(err, answeredQuestions ){
            if (err){
                return;
            }

            for(var i= 0; i < quizzes.length; i++)
            {
                  let list = answeredQuestions.filter(function (item) {
                    return quizzes[i]._id.equals(item.quiz);
                  });

                  quizzes[i].answeredQuestions =list
            }

            quizQuestionStatus.find({quiz: {$in: QuizIDs}}, function(err, questionStatus){
                if (err){
                    return;
                }
    
                quizzes.forEach(function (quiz) {
                    quiz.questionStatus = questionStatus.filter(function (item) {
                      return quiz._id.equals(item.quiz);
                    });
                  });

                  var allQuestions = []
                  var completedQuestions = []
                  var notCompletedQuestions = []
                  var notCompletedQuestionsAnsweredQuestions = []

                  for(var i = 0; i < quizzes.length; i++){

                    allQuestions = []
                    completedQuestions = []
                    notCompletedQuestions = []
                    notCompletedQuestionsAnsweredQuestions = []

                    for(var j = 0; j < quizzes[i].questionSets.length; j++)
                    {
                        var questions = quizzes[i].questionSets[j].questions.map(function (item) { return { id: item._id , correctCount: item.correctCount }; });
                        Array.prototype.push.apply(allQuestions, questions);
                    }

                    for(var j = 0 ; j < allQuestions.length; j++)
                    {
                        for(var k = 0; k < quizzes[i].questionStatus.length; k++){
                            if (allQuestions[j].id.equals(quizzes[i].questionStatus[k].question))
                            {
                                if (quizzes[i].questionStatus[k].consecutiveCorrectCount >= allQuestions[j].correctCount)
                                {
                                    completedQuestions.push(quizzes[i].questionStatus[k].question)
                                }
                            }
                        }
                    }

                    for(var j = 0 ; j < allQuestions.length; j++)
                    {
                        var exist = false

                        for(var k = 0; k < completedQuestions.length; k++)
                        {
                            if (allQuestions[j].id.equals(completedQuestions[k]))
                            {
                                exist = true
                            }
                        }

                        if (!exist)
                        {
                            notCompletedQuestions.push(allQuestions[j].id)
                        }
                    }

                    for(var j = 0; j < notCompletedQuestions.length; j++)
                    {
                        var answered = false

                        for(var k = 0; k < quizzes[i].answeredQuestions.length; k++)
                        {
                            if (notCompletedQuestions[j].equals( quizzes[i].answeredQuestions[k].question))
                            {
                                answered = true
                            }
                        }

                        if (answered)
                        {
                            notCompletedQuestionsAnsweredQuestions.push(notCompletedQuestions[j])
                        }
                    }

                    quizzes[i].completedPercentage = (completedQuestions.length/ allQuestions.length * 100).toFixed(2)
                    quizzes[i].currentQuizCompletedPercentage = (notCompletedQuestionsAnsweredQuestions.length / notCompletedQuestions.length * 100).toFixed(2)

                    if (notCompletedQuestionsAnsweredQuestions.length == 0 &&
                        notCompletedQuestions.length == 0)
                        {
                            quizzes[i].currentQuizCompletedPercentage = (0).toFixed(2)
                        }
                  }

                  res.json(quizzes)
            })
        })
    })
})

module.exports = router