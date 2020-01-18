import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
})

const quiz = {
    get : () => API.get('/quiz'),
    delete : id => API.get('/quiz/delete/' + id ),
    edit : id => API.get('/quiz/edit/' + id),
    add : data => API.post('/quiz/add', data),
    update : (id, data) => API.post('/quiz/update/' + id, data),
    getQuestions : (id) => API.get('/quiz/getquestions/' + id),
    answerQuestion : (id, data) => API.post('/quiz/answerQuestion/' + id, data)
    
}

const questionset = {
    get : () => API.get('/questionset'),
    delete : id => API.get('/questionset/delete/'+ id),
    edit : id => API.get('/questionset/edit/' + id),
    add : data => API.post('/questionset/add', data),
    update: (id, data) => API.post('/questionset/update/' + id, data)
}

export default{
    quiz,
    questionset
}