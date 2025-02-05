import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import {BrowserRouter} from 'react-router-dom'
import './index.css'

axios.interceptors.request.use((request)=>{
  let authToken = JSON.parse(localStorage.getItem('token'))
    if (authToken){
    request.headers.Authorization = `Bearer ${authToken}`
  }
return request;
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    </BrowserRouter>

);