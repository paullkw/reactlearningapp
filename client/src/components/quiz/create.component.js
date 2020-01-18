import React, {Component} from 'react'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/Button'
import api from '../../api'

export default class Create extends Component{

    constructor(props){
        super(props)

        this.onChangeTitle = this.onChangeTitle.bind(this)
        this.onChangeSelectedQuestionSet = this.onChangeSelectedQuestionSet.bind(this)
        this.save = this.save.bind(this)

        this.state = {
            title: '',
            questionsets:[],
            selectedQuestionSets: []
        }
    }

    componentDidMount(){
        api.questionset.get()
            .then(response => {
                this.setState({questionsets: response.data});
            })
            .catch(function(error){
                console.log(error);
            })
    }

    save(){
        const obj = {
            title: this.state.title,
            questionSets: this.state.selectedQuestionSets,
        }

        api.quiz.add(obj)
        .then(res => console.log(res.data));

        this.props.history.push('/quiz/index');
    }

    onChangeSelectedQuestionSet(e, id){

        const selectedQuestionSets = this.state.selectedQuestionSets

        if (e.target.checked){
            selectedQuestionSets.push(id)
        }
        else{
            const index = selectedQuestionSets.indexOf(id);
            if (index > -1) {
                selectedQuestionSets.splice(index, 1);
            }
        }

        this.setState({
            selectedQuestionSets: selectedQuestionSets
        })
    }

    tabRow(){

        var that = this;

        return this.state.questionsets.map(function(object, i){

            return  (
                <tr key={i}>
                    <td>
                        <input type="checkbox" onChange={(e) => that.onChangeSelectedQuestionSet(e, object._id)} />
                    </td>
                    <td style={{width:'50%'}}>
                        {object.title}
                    </td>
                    <td>
                        {object.questions.length}
                    </td>
                </tr>
            )
        })
    }

    onChangeTitle(e){
        this.setState({
            title: e.target.value
        });
    }

    render(){
        return(
            <div style={{marginTop: 10}}>
                <h3 align="center">新增測驗</h3>
                <ButtonToolbar>
                    <Button variant="primary" onClick={this.save}>儲存</Button>
                </ButtonToolbar>
                <div className="form-group">
                       <label>標題:</label>
                       <input type="text"
                        className="form-control"
                        value={this.state.title}
                        onChange={this.onChangeTitle}
                        />
                   </div>
                <table className="table table-striped" style={{marginTop: 20}}>
                   <thead>
                       <tr>
                           <th></th>
                           <th>標題</th>
                           <th>問題數量</th>
                       </tr>
                   </thead>
                   <tbody>
                       {this.tabRow()}
                   </tbody>
               </table>
            </div>
        )
    }
}