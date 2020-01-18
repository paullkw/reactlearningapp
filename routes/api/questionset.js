const express = require("express")
const router = express.Router()

let QuestionSet = require('./../../models/questionset')


router.route('/add').post(function(req, res){

    let questionset = new QuestionSet(req.body);
    questionset.save()
        .then(questionset => {
            res.status(200).json({'questionset': 'QuestionSet in added successfully'});
        })
        .catch(err => {
            res.status(400).send('unable to save to database');
        })
})

router.route('/update/:id').post(function(req, res){
    QuestionSet.findById(req.params.id, function(err, questionset){
        if (!questionset)
            res.status(404).send("data is not found");
        else{
            questionset.title = req.body.title;
            questionset.questions = req.body.questions;

            questionset.save().then(questionset => {
                res.json('Update complete');
            })
            .catch(err => {
                res.status(400).send("unable to update the database")
            })
        }
    });
});


router.route('/edit/:id').get(function(req, res){
    let id = req.params.id;
    QuestionSet.findById(id, function(err, questionset){
        res.json(questionset);
    })
})

router.route('/delete/:id').get(function(req, res){
    QuestionSet.findByIdAndRemove({_id: req.params.id}, function(err, questionset){
        if (err)res.json(err);
        else res.json('Successfully removed');
    })
})

router.route('/').get(function(req, res){
    QuestionSet.find(function(err, questionsets){
        if (err){
            console.log(err)
        }
        else{
            res.json(questionsets)
        }
    })
})

module.exports = router