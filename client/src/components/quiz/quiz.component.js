import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'
import api from '../../api'

export default class Quiz extends Component{

    constructor(props){
        super(props)

        this.state = {
            questions: []
        }

        this.createQuestion = this.createQuestion.bind(this)
        this.onRadioButtonChange = this.onRadioButtonChange.bind(this)
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this)
    }

    componentDidMount(){

        api.quiz.getQuestions(this.props.match.params.id)
            .then(response => {
                this.setState({questions: response.data});
            })
            .catch(function(error){
                console.log(error);
            })

    }

    checkAnswer(questionid){
        let correct = false;
        let Answers = []
        let selectedAnswer
        let message = ''
        let AnswersText = []

        const questions =  this.state.questions;

        for(let i= 0; i < questions.length; i++)
        {
            if (questions[i]._id == questionid){

                selectedAnswer = questions[i].selectedAnswer;

                for(var j = 0; j < questions[i].options.length; j++)
                {
                    if (questions[i].options[j].isAnswer == true){
                        Answers.push(questions[i].options[j]._id)
                        AnswersText.push(questions[i].options[j].option)
                    }
                }
            }
        }

        if (selectedAnswer)
        {
            correct = selectedAnswer.length === Answers.length && selectedAnswer.sort().every(function(value, index) { return value === Answers.sort()[index]});
        }

        if (correct)
        {
            message = '正確'
        }
        else
        {
            message = '不正確，正確答案是 ︰' +"<br />" + AnswersText.map(function(item){ return item + "<br />"}).join(' ')
        }

        for(let i= 0; i < questions.length; i++)
        {
            if (questions[i]._id == questionid){
                questions[i].message = message
                questions[i].isAnswered = true
            }
        }

        const obj = {

            quiz: this.props.match.params.id,
            questionid: questionid,
            correct: correct
        }

        api.quiz.answerQuestion(this.props.match.params.id, obj)
        .then(res => console.log(res.data))
        .catch(function(error){
            console.log(error);
        })

        this.setState({
            question: questions
        })
    }
    
    onRadioButtonChange(e){
        const list = this.state.questions.map((item) => {
            if (item._id == e.target.name) {
                item.selectedAnswer = [e.target.value];
                return item;
            } else {
                return item;
            }
            });
    
          this.setState({
              questions:list
          })
    }

    onCheckBoxChange(e, questionid){

        const list = this.state.questions.map((item) => {
            if (item._id == questionid) {

              let selectedAnswer = item.selectedAnswer;

              if (!selectedAnswer)
              {
                  selectedAnswer = []
              }

              if (e.target.checked)
              {
                  selectedAnswer.push(e.target.id)
              }
              else
              {
                  const index = selectedAnswer.indexOf(e.target.id);
                    if (index > -1) {
                        selectedAnswer.splice(index, 1);
                    }

              }

              item.selectedAnswer = selectedAnswer

              return item;
            } else {
              return item;
            }
          });

      this.setState({
          questions:list
      })  
    }

    createOptionRadioButton(item, questionid, isAnswered){
        return <div key={item._id} style={{  marginBottom:'10px',  marginTop:'10px'}}>
                    
                    <div className="form-check form-check-inline">
                            <input  className="form-check-input" 
                            disabled={isAnswered}
                            name={questionid}   
                            value={item._id}
                            onChange={this.onRadioButtonChange}
                             type="radio">
                             </input>
                            <label className="form-check-label">{item.option}</label>
                          </div>
                </div>
                         
    }

    createOptionCheckbox(item, questionid, isAnswered){
        return <div key={item._id} style={{  marginBottom:'10px',  marginTop:'10px'}}>
                    
                    <div className="form-check form-check-inline">
                            <input className="form-check-input"     
                             disabled={isAnswered}
                             id={item._id}
                             onChange={(e) => this.onCheckBoxChange(e, questionid)}
                             type="checkbox">
                             </input>
                            <label className="form-check-label">{item.option}</label>
                          </div>
                </div>
    }

    createQuestion(item) {

        var that = this;
        var IsAnswerCount = 0;

        for(var i = 0; i <item.options.length; i++)
        {
            if (item.options[i].isAnswer == true)
            {
                IsAnswerCount++;
            }
        }

        let options = []

        if (IsAnswerCount > 1)
        {
            options = item.options.map(function(x){return that.createOptionCheckbox(x, item._id, item.isAnswered)})
        }
        else 
        {
            options = item.options.map(function(x){return that.createOptionRadioButton(x, item._id, item.isAnswered)})
        }

        return <div key={item._id} style={{border:'2px black solid', padding: '20px', marginBottom:'10px'}}>
                   {item.question}
                <div>
                       {options}
                </div>
                <div>
                    <Button variant="primary"  
                    disabled={item.selectedAnswer === undefined || (item.selectedAnswer !== undefined && item.selectedAnswer.length == 0) || item.isAnswered } 
                    onClick={() => that.checkAnswer(item._id)} >檢查答案</Button>
                </div>
                <div/>
                <div style={{marginTop: '10px'}}  dangerouslySetInnerHTML={{__html: item.message}} >

                </div>
          
        </div>
      }

    render(){
        const questions = this.state.questions.map(this.createQuestion);

        return(
            <div style={{marginTop: 10}}>
                <h3 align="center">測驗</h3>
                <div>
                    {questions}
                </div>
            </div>
        )
    }
}