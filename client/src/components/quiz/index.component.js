import React, {Component} from 'react'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import { Link } from 'react-router-dom'
import api from '../../api'

export default class Index extends Component{

    constructor(props){
        super(props)
        this.state = {quizzes:[]}
    }

    componentDidMount(){
        api.quiz.get()
            .then(response => {
                this.setState({quizzes: response.data});
            })
            .catch(function(error){
                console.log(error);
            })
    }

    delete(id){

        const quizzes = this.state.quizzes.filter(function(item){ return item._id != id})
        
        api.quiz.delete(id)
            .then(this.setState({quizzes: quizzes}))
            .catch(err => console.log(err))
    }

    tabRow(){

        var that = this;

        return this.state.quizzes.map(function(object, i){

            return  (
                <tr key={i}>
                    <td style={{width:'40%'}}>
                        {object.title}
                    </td>
                    <td> {object.currentQuizCompletedPercentage} % </td>
                    <td>  {object.completedPercentage} %</td>
                    <td>
                        <Link to={"/quiz/quiz/" + object._id} className="btn btn-primary">開始測驗</Link>
                    </td>
                    <td>
                        <Link to={"/quiz/edit/" + object._id} className="btn btn-primary">修改</Link>
                    </td>
                    <td>
                        <button onClick={() => that.delete(object._id)} className="btn btn-danger">刪除</button>
                    </td>
                </tr>
            )
        })
    }

    render(){
        return(
           <div style={{marginTop: 10}}>
                <h3 align="center">測驗</h3>
                <ButtonToolbar>
                    <Link className="btn btn-primary" to={'/quiz/create'}>新增</Link>
                </ButtonToolbar>

                <table className="table table-striped" style={{marginTop: 20}}>
                   <thead>
                       <tr>
                           <th>標題</th>
                           <th>現在進行中的測驗完成度</th>
                           <th>總完成度</th>
                           <th colSpan="3"></th>
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