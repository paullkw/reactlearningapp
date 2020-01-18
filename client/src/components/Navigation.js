import React from 'react'
import {Link } from 'react-router-dom'

class Navigation extends React.Component{
    render(){
        return(
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/">學習應用程式</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={'/quiz/index'} className="nav-link">測驗</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/questionset/index'} className="nav-link">問題集</Link>
                        </li>
                    </ul>
                    </div>
                </nav>
        )
    }
}

export default Navigation