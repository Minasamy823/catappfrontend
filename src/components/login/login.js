import { Form, Input, Button, Checkbox } from 'antd';
import React, {Component} from 'react'
import 'antd/dist/antd.css';
import './login.css'
import axios from 'axios'


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

  onFinish = values => {
    this.setState({username: values.username});
    this.setState({password: values.password});

    axios.post('https://cattyapp.herokuapp.com/o/token/',{
        client_id: 'MHoBU1fCen6tANYE2qXustlVOl6YcXPYPn4zbyzp',
        client_secret:'rjYkq6w2otYS6AoRlPbp8iVNFW6V7CcHfppb943fLkhgqdlnPuD4bS5RCM3I67CL7jMKdfbir92vkSy2Vft2a0ehjerUD84DmbiNbkz5pNy2BbiEIwvMfsYOv0SAcwcv',
        grant_type: 'password',
        username : this.state.username,
        password : this.state.password,
            })

    .then((res)=>{
      const access_token = res.data.access_token // you should firstly fetch the token from the data to be known
      const refresh_token = res.data.refresh_token
      const expires_in = res.data.expires_in
      let created_at = new Date()
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('expires_in', expires_in)
      localStorage.setItem('created_at', created_at)
      return redirect('/')
    })

    .catch((err) => {
      console.log(err.response.data);
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

        }}> You are already logged in! </div>
         :
         <Form
           className='container'
           {...layout}
           name="basic"
           initialValues={{ remember: true }}
           onFinish={this.onFinish}
         >
           <Form.Item style={{marginLeft: "60%", fontSize:"30px"}}>
              <strong> Login </strong>
           </Form.Item>

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
                   Login
                 </Button>
                 <Button style={{float:' right'}} type="danger" href="register">
                   Register
                 </Button>
             </Form.Item>
           </div>
         </Form>
       }
    </div>

  );
}
};
