import { Card, Button, Form, Input, InputNumber } from 'antd';
import React, {Component} from 'react'
import 'antd/dist/antd.css';
import axios from 'axios'
import './catslist.css'
import {Link} from 'react-router-dom';


const moment = require('moment');
const { Meta } = Card;

export default class Register extends Component {

  state = {
    name: "",
    age : "",
    data: [],
    newName: '',
    newAge: '',
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
    let url= 'https://cattyapp.herokuapp.com'
    axios.get(url, config
      )
    .then((res)=>{
      this.setState({data: res.data});
      console.log(this.state.data);
    })
  }

  onFinish =(values)=>{
    this.setState({newName: values.name});
    this.setState({newAge: values.age});
    let token = this.getToken()
    let config = {
    headers: { Authorization: `Bearer ${token}` }
    };
    let url= 'https://cattyapp.herokuapp.com'
    let data = {
      name: this.state.newName,
      age: this.state.newAge
    }
    axios.post(url, data, config
      )
    .then((res)=>{
      data = this.state.data
      this.componentDidMount()
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
  return (
    <div>
      {token&&refresh_token ?
        <div className='cat_container'>
        <a href="/login">
          <Button style={{position:'relative', left:'40%'}} type="danger"
                onClick={this.logOut}> logout </Button>
        </a>

        {this.state.data.map((cat)=>{

          return(
            <div key={cat.id}>
              <Link to= {'' + `${cat.id}`}>
                <Card
                   key = {cat.id}
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src="https://i.pinimg.com/originals/fb/44/fd/fb44fd1503bed3fab7fcfe53613c6917.jpg" />}
                        >
                    <Meta style={{textAlign:"center"}} title={cat.name} description={cat.age} />
                </Card>
              </Link>

           </div>
                )}
              )}

            <div>
              <Form
                className='edit_container'
                {...layout}
                name="basic"
                onFinish={this.onFinish}
              >
              <Form.Item style={{marginLeft: "60%", fontSize:"30px"}}> <strong> Create </strong> </Form.Item>

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
                      <Button style={{position:'relative', left:'40%'}} type="primary" htmlType="submit">
                        Create
                      </Button>
                    </Form.Item>
                </div>
                </Form>
                </div>
        </div>


        :
      <div > <a className='login_first' href='/login'>Login Please! </a></div>
    }
    </div>

    )
  }
};
