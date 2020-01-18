import React, { Component } from 'react'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/Button'
import DeleteImage from '../images/delete.png'

class Questions extends Component {

  constructor(props){
    super(props);

    this.createQuestion = this.createQuestion.bind(this);
    this.onChangeQuestionText = this.onChangeQuestionText.bind(this);
    this.onChangeCorrectCount = this.onChangeCorrectCount.bind(this);
    this.onChangeOptionText = this.onChangeOptionText.bind(this);
    this.onChangeIsAnswer = this.onChangeIsAnswer.bind(this);
    this.remove = this.remove.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.addOption = this.addOption.bind(this);
  }

  onChangeIsAnswer(e, id , optionid){
 
    this.props.onChangeIsAnswer(id,
    optionid, 
    e.target.checked);
  }

  onChangeOptionText(e, id , optionid){
    this.props.onChangeOptionText(id,
                                  optionid, 
                                  e.target.value);
  }

  onChangeQuestionText(e, id){
    this.props.onChangeQuestionText(id, e.target.value);
  }

  onChangeCorrectCount(e, id){
    this.props.onChangeCorrectCount(id, e.target.value);
  }

  remove(id){
    this.props.onRemoveQuestion(id);
  }

  removeOption(id, optionid){
    this.props.onRemoveOption(id, optionid)
  }

  addOption(id){
    this.props.onAddOption(id);
    
  }

  createQuestion(item) {

    return <div key={item.id} style={{border:'2px black solid', padding: '20px', marginBottom:'10px'}}>
                <ButtonToolbar>
                    <Button variant="primary" onClick={() => this.remove(item.id)}>移除</Button>
                    <Button style={{marginLeft:5}} variant="secondary" onClick={() => this.addOption(item.id)}>新增選項</Button>
                </ButtonToolbar>
                  <div className="form-group">
                       <label>問題:</label>
                       <input type="text"
                        className="form-control"
                        value={item.question}
                        onChange={(e) => this.onChangeQuestionText(e, item.id)}
                        ></input>
                        
                   </div>

                   {item.options.map(option => (
                      <div key={option.id} >
                        <img src={DeleteImage} 
                        style={{width:20, height:20, float: 'right'}} 
                        onClick={() => this.removeOption(item.id, option.id)} />
                        <div className="form-group">
                          <label>選項</label>
                          <input type="text"
                            className="form-control"
                            value={option.option}
                            onChange={(e) => this.onChangeOptionText(e, item.id, option.id)}
                          ></input>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input"     
                            checked={option.isAnswer}
                            onChange={(e) => this.onChangeIsAnswer(e, item.id, option.id)}
                             type="checkbox">
                             </input>
                            <label className="form-check-label">是否答案</label>
                          </div>
                        </div>
                      </div>
                  ))}

                   <div className="form-group">
                      <label>確認為完成的連續答對次數:</label>
                      <input type="number"
                      min="1"
                      max="5"
                      className="form-control"
                      value={item.correctCount}
                      onChange={(e) => this.onChangeCorrectCount(e, item.id)}
                      />
                   </div>
    </div>
  }

  render() {
    const questionEntries = this.props.entries
    const listItems = questionEntries.map(this.createQuestion)
    return <div className="theList">{listItems}</div>
  }
}
export default Questions