import React from "react";
import { Form, Input, Button, DatePicker, Select, Row, Col, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined } from "@ant-design/icons";
import "./styles/signup.css";
import borigam_profile from "../assets/borigam_profile.png";

const { Option } = Select;
const { Title, Text } = Typography;

const SignUpForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form Submitted:", values);
  };

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="leftpanel">
        <img src={borigam_profile} alt="Profile" className="logo-img" />
      </div>

      {/* Right Panel - Form */}
      <div className="rightpanel">
        <Title level={3} className="signup-title">Create New Account</Title>
        <hr className="title-underline" />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="firstName" rules={[{ required: true, message: "Enter first name!" }]}>
                <Input prefix={<UserOutlined />} placeholder="First name" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastName" rules={[{ required: true, message: "Enter last name!" }]}>
                <Input prefix={<UserOutlined />} placeholder="Last name" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dob" rules={[{ required: true, message: "Enter date of birth!" }]}>
                <DatePicker style={{ width: "100%" }} placeholder="Date of birth" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" rules={[{ required: true, message: "Select gender!" }]}>
                <Select placeholder="Gender" size="large">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="institute" rules={[{ required: true, message: "Enter institute name!" }]}>
            <Input prefix={<HomeOutlined />} placeholder="Institute name" size="large" />
          </Form.Item>

          <Form.Item name="contact" rules={[{ required: true, message: "Enter contact info!" }]}>
            <Input prefix={<MailOutlined />} placeholder="Mobile number or email id" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Enter password!" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Create Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Text strong className="login-text">Already have an account?</Text>
      </div>
    </div>
  );
};

export default SignUpForm;
