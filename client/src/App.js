import React from 'react';
import Navigation from './components/Navigation'
import { BrowserRouter as Router , Switch, Route } from 'react-router-dom'
import Quiz from './components/quiz/quiz.component'
import QuizIndex from './components/quiz/index.component'
import QuizCreate from './components/quiz/create.component'
import QuizEdit from './components/quiz/edit.component'
import QuestionSetIndex from './components/questionset/index.component'
import QuestionSetCreate from './components/questionset/create.component'
import QuestionSetEdit from './components/questionset/edit.component'

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Navigation/>
        <div className="container">
          <Switch>
            <Route exact path='/quiz/create' component={QuizCreate} />
            <Route path='/quiz/edit/:id' component={QuizEdit} />
            <Route path='/quiz/quiz/:id' component={Quiz} />
            <Route path='/quiz/index' component={QuizIndex} />
            <Route exact path='/' component={QuizIndex} />
            <Route exact path='/questionset/create' component={QuestionSetCreate} />
            <Route path='/questionset/edit/:id' component={QuestionSetEdit} />
            <Route path='/questionset/index' component={QuestionSetIndex} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
