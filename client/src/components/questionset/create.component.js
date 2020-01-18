import React, {Component} from 'react'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/Button'
import Question from '../questions'
import uuid from 'uuid/v4'
import api from '../../api'

export default class Create extends Component{

    constructor(props){
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.save = this.save.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.onChangeQuestionText = this.onChangeQuestionText.bind(this);
        this.onChangeCorrectCount = this.onChangeCorrectCount.bind(this);
        this.onRemoveQuestion = this.onRemoveQuestion.bind(this);
        this.onChangeOptionText = this.onChangeOptionText.bind(this);
        this.onChangeIsAnswer = this.onChangeIsAnswer.bind(this);
        this.onRemoveOption = this.onRemoveOption.bind(this);
        this.onAddOption = this.onAddOption.bind(this);

        this.state = {
            title: '',
            questions: []
        }
    }

    onChangeTitle(e){
        this.setState({
            title: e.target.value
        });
    }

    onAddOption(id){
        const list = this.state.questions.map((item) => {
            if (item.id == id) {
                const options = item.options.concat(
                    {id: uuid(), option: '',isAnswer: false}
                )

              item.options=  options

              return item;
            } else {
              return item;
            }
          });

      this.setState({
          questions:list
      })
    }

    onRemoveOption(id, optionid){
        const list = this.state.questions.map((item) => {
            if (item.id == id) {
              const options = item.options.filter((option) => option.id !== optionid )

              item.options=  options

              return item;
            } else {
              return item;
            }
          });

      this.setState({
          questions:list
      })
    }

    onChangeIsAnswer(id, optionid, value){
        const list = this.state.questions.map((item) => {
            if (item.id == id) {
              const options = item.options.map((option) => {
                if (option.id == optionid)
                {
                    option.isAnswer = value;
                    
                    return option;
                }
                else
                {
                    return option;
                }
              })

              item.options=  options

              return item;
            } else {
              return item;
            }
          });

      this.setState({
          questions:list
      })  
    }

    onChangeOptionText(id, optionid, value){
        const list = this.state.questions.map((item) => {
            if (item.id == id) {
              const options = item.options.map((option) => {
                if (option.id == optionid)
                {
                    option.option = value;
                    
                    return option;
                }
                else
                {
                    return option;
                }
              })

              item.options=  options

              return item;
            } else {
              return item;
            }
          });

      this.setState({
          questions:list
      })
    }

    onChangeQuestionText(id, value){
         const list = this.state.questions.map((item) => {
              if (item.id == id) {
                item.question = value;
                return item;
              } else {
                return item;
              }
            });

        this.setState({
            questions:list
        })
    }

    onChangeCorrectCount(id, value){

        const list = this.state.questions.map((item) => {
        if (item.id == id) {
            item.correctCount = value;
            return item;
        } else {
            return item;
        }
        });

      this.setState({
          questions:list
      })
    }

    onRemoveQuestion(id){
        this.setState(state => {
            const questions = state.questions.filter((item) => item.id !== id);
            return {
                questions,
            };
          });
    }

    save(e){

        api.questionset.add(this.state)
        .then(res => console.log(res.data));


        this.props.history.push('/questionset/index');
    }   

    addQuestion(e){
        this.setState({
            questions: this.state.questions.concat({ id: uuid(), 
                question: '',
                 options:[
                     { id: uuid(), option: '', isAnswer: false }, 
                     { id: uuid(), option: '', isAnswer: false}],
                  correctCount: 3})
          })
    }


    render(){
        return(
            <div style={{marginTop: 10}}>
                <h3 align="center">新增問題集</h3>
                <ButtonToolbar>
                    <Button variant="primary" onClick={this.save}>儲存</Button>
                    <Button style={{marginLeft:5}} variant="secondary" onClick={this.addQuestion}>新增問題</Button>
                </ButtonToolbar>
                <form> 
                   <div className="form-group">
                       <label>標題:</label>
                       <input type="text"
                        className="form-control"
                        value={this.state.title}
                        onChange={this.onChangeTitle}
                        />
                   </div>
                   <Question entries={this.state.questions}
                     onChangeCorrectCount={this.onChangeCorrectCount}
                     onChangeQuestionText={this.onChangeQuestionText}
                     onRemoveQuestion={this.onRemoveQuestion}
                     onChangeOptionText = {this.onChangeOptionText}
                     onRemoveOption = {this.onRemoveOption}
                     onAddOption = {this.onAddOption}
                     onChangeIsAnswer = {this.onChangeIsAnswer}
                    >

                   </Question>
               </form>
            </div>
        )
    }
}