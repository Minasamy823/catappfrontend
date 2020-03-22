import { Card, Button, Form, Input, InputNumber} from 'antd';
import React, {Component} from 'react'
import 'antd/dist/antd.css';
import axios from 'axios'
import './catslist.css'
import '../login/login.css'
import {Switch, Link, Route} from 'react-router-dom';
import Cats from './catslist'


const moment = require('moment');
const { Meta } = Card;

export default class Register extends Component {

  state = {
    name: "",
    age : "",
    data: [],
    token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token')
  }

  refreshToken = ()=> {
    let refresh_token = localStorage.getItem('refresh_token')
    let created_at = new Date()
    axios.post('https://cattyapp.herokuapp.com/o/token/',{
        client_id: 'MHoBU1fCen6tANYE2qXustlVOl6YcXPYPn4zbyzp',
        client_secret:'rjYkq6w2otYS6AoRlPbp8iVNFW6V7CcHfppb943fLkhgqdlnPuD4bS5RCM3I67CL7jMKdfbir92vkSy2Vft2a0ehjerUD84DmbiNbkz5pNy2BbiEIwvMfsYOv0SAcwcv',
        grant_type: 'refresh_token',
        refresh_token : refresh_token,
        })

    .then((res)=>{
      const access_token = res.data.access_token // you should firstly fetch the token from the data to be known
      const refresh_token = res.data.refresh_token
      const expires_in = res.data.expires_in
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('expires_in', expires_in)
      localStorage.setItem('created_at', created_at)
      return access_token
    })
    .catch((err) => {
      console.log(err.response.data);
    })
  }

  getToken =() => {
    let datenow = new Date()
    let accessToken = localStorage.getItem('access_token')
    let refreshToken = localStorage.getItem('refresh_token')
    let expiresIn = localStorage.getItem('expires_in')
    let created_at = localStorage.getItem('created_at')
    let dateAfterExpiration = new Date( new Date(created_at).getTime() + 1000 * 34000)
    // if token still not expired don't refresh otherwise call refreshToken
    if (accessToken && (dateAfterExpiration > datenow)) {
        return accessToken;
    }
    else {
      return this.refreshToken()
    }
  }

  componentDidMount (){
    let token = this.getToken()
    let config = {
    headers: { Authorization: `Bearer ${token}` }
    };
    let id = this.props.id
    let url= `https://cattyapp.herokuapp.com/details/${id}`
    axios.get(url, config
      )
    .then((res)=>{
      this.setState({data: res.data});
      console.log(this.state.data);
    })
  }

  deleteOnChange = () => {
      let token = this.getToken()
      let config = {
      headers: { Authorization: `Bearer ${token}` }
      };
      let id = this.props.id
      let url= `https://cattyapp.herokuapp.com/details/${id}`
      axios.delete(url, config)
    }

  onUpdate = values => {
      this.setState({name: values.name});
      this.setState({age: values.age});
      let token = this.getToken()
      let config = {
      headers: { Authorization: `Bearer ${token}` }
      };
      let id = this.props.id
      let url= `https://cattyapp.herokuapp.com/details/${id}`
      let data = {
        name: this.state.name,
        age: this.state.age
      }
      axios.put(url, data, config)
      .then((res)=>{
        console.log(res);
        window.location.reload()
      })
      .catch((err)=>{
        console.log(err.request.data)
      })
    }

    logOut = () =>{
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }

  render(){
    const {token, refresh_token} = this.state;
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    const data =

            <div className='cat_container'>
             <a href='/'> <Button style={{position:'relative', right:'30%'}} type="danger">
              list </Button> </a>
              <a href='/login'> <Button style={{position:'relative', left:'40%'}} type="danger"
                    onClick={this.logOut}> logout </Button> </a>
                <div key={this.state.data.id}>
                    <Card
                       key = {this.state.data.id}
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src="https://i.pinimg.com/originals/fb/44/fd/fb44fd1503bed3fab7fcfe53613c6917.jpg" />}
                            >
                        <Meta style={{textAlign:"center"}} title={this.state.data.name} description={this.state.data.age} />
                    </Card>
                </div>
                <div>
                <Form
                  className='edit_container'
                  {...layout}
                  name="basic"
                  onFinish={this.onUpdate}
                >
                <Form.Item style={{marginLeft: "60%", fontSize:"30px"}}> <strong> Edit </strong> </Form.Item>

                  <Form.Item
                    label="name"
                    name="name"
                    rules={[{ required: true, message: "Please input your cat's name!" }]}
                  >
                    <Input placeholder={this.state.data.name} />
                  </Form.Item>

                  <Form.Item
                    label="age"
                    name="age"
                    rules={[{ required: true, message: "Please input your cat's age!" }]}
                  >
                    <InputNumber min={1} max={20} style={{width: '100%'}} placeholder={this.state.data.age}/>
                  </Form.Item>

                  <div style={{display: 'inlineblock'}}>
                  <Form.Item {...tailLayout}>

                      <Button type="primary" htmlType="submit">
                        Update
                      </Button>

                      <a href='/'>
                          <Button style={{float:' right'}} type="danger"  onClick={this.deleteOnChange} >
                            Delete
                          </Button>
                      </a>

                  </Form.Item>
                  </div>
                </Form>
                </div>
              </div>

    return (
      <div>
      { token && refresh_token ?
        data

      :
    <div > <a className='login_first' href='/login'>Login Please! </a></div>
  }
  </div>

      )
     }
    };
