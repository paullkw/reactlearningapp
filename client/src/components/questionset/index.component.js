import React, {Component} from 'react'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import { Link } from 'react-router-dom'
import api from '../../api'

export default class Index extends Component{

    constructor(props){
        super(props)
        this.state = {questionsets:[]}
    }

    componentDidMount(){

        api.questionset.get()
        .then(response => { this.setState({questionsets: response.data})})
        .catch(err => console.log(err))
    }

    delete(id){

        const questionsets = this.state.questionsets.filter(function(item){ return item._id != id})
        
        api.questionset.delete(id)
                        .then( this.setState({questionsets: questionsets}))
                        .catch(err => console.log(err))
    }

    tabRow(){

        var that = this;

        return this.state.questionsets.map(function(object, i){

            return  (
                <tr key={i}>
                    <td style={{width:'50%'}}>
                        {object.title}
                    </td>
                    <td>
                        {object.questions.length}
                    </td>
                    <td>
                        <Link to={"/questionset/edit/" + object._id} className="btn btn-primary">修改</Link>
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
               <h3 align="center">問題集</h3>
               <ButtonToolbar>
                    <Link className="btn btn-primary" to={'/questionset/create'}>新增</Link>
                </ButtonToolbar>

                <table className="table table-striped" style={{marginTop: 20}}>
                   <thead>
                       <tr>
                           <th>標題</th>
                           <th>問題數量</th>
                           <th colSpan="2"></th>
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