import React from "react";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./styles/signin.css";
import borigam_profile from "../assets/borigam_profile.png";

const { Title } = Typography;

const Loginform = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    console.log("Success:", values);
  };

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="leftpanel">
        <img src={borigam_profile} alt="Profile" className="logo-img" />
      </div>

      {/* Right Panel */}
      <div className="rightpanel">
        <Title level={3} className="login-title">LOGIN</Title>
        <hr className="title-underline" />

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {/* Username Input */}
          <Form.Item 
            name="username" 
            rules={[{ required: true, message: "Please enter your mobile number or email!" }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter your Mobile number or email id" 
              size="large" 
            />
          </Form.Item>

          {/* Password Input */}
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Enter your Password" 
              size="large" 
            />
          </Form.Item>

          {/* Sign In Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* Footer Links */}
        <Row justify="space-between" className="signin-footer">
          <Col>
            <Typography.Text className="forgot">Forgot Password</Typography.Text>
          </Col>
          <Col>
            <Typography.Text className="signup_text">Signup</Typography.Text>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Loginform;
