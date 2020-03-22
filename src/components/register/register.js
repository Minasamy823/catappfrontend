import { Form, Input, Button, Checkbox } from 'antd';
import React, {Component} from 'react'
import 'antd/dist/antd.css';
import './register.css'
import axios from 'axios'
import { createBrowserHistory } from 'history';


const redirect = redirectUrl => {
  window.location = redirectUrl;
};

export default class Register extends Component {

  state = {
    username: "",
    password : "",
    token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token')
  }

  onFinish = (values, history) => {
    this.setState({username: values.username});
    this.setState({password: values.password});

    axios.post('https://cattyapp.herokuapp.com/register/',{
            	username : this.state.username,
            	password : this.state.password
            })
    .then((res)=>{
      if ( res['status'] == '200') {
         return redirect('/login')
       }
     }
    )
    .catch((err) => {
      console.log(err);
    })
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

    { token && refresh_token ?
      <div style={{
          textAlign:'center',
          marginTop: '60px',
          fontSize: '60px'
            }}>
            You are already logged in! </div>
            :
            <Form
              className='container'
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
            >
            <Form.Item style={{marginLeft: "60%", fontSize:"30px"}}> <strong> Register </strong> </Form.Item>

              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <div style={{display: 'inlineblock'}}>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
                <Button style={{float:' right'}} type="danger" href="login">
                  Login
                </Button>
              </Form.Item>

              </div>
            </Form>

     }
  </div>


  )
}
};
