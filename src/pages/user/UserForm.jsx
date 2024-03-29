// UserForm.js
import React from "react";
import { Form, Input, Button, Select, Row, Col, DatePicker } from "antd";
import moment from "moment";

const { Option } = Select;

const UserForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    values.endDate = moment(values.endDate).format("YYYY/MM/DD");
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
      layout="vertical"
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="employeeId"
            label="EMPLOYEE ID"
            rules={[{ required: true, message: "Please enter EMPLOYEE ID" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="userCd"
            label="User Code"
            rules={[{ required: true, message: "Please enter User ID" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="firstName"
            label="User First Name"
            rules={[
              { required: true, message: "Please enter User First Name" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="lastName"
            label="User Last Name"
            rules={[{ required: true, message: "Please enter User Last Name" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="organizationId"
            label="Organization"
            rules={[
              { required: true, message: "Please enter Organization ID" },
            ]}
          >
            <Select>
              <Option value="5">SAI SONEPAT</Option>
              <Option value="6">SAI BHOPAL</Option>
              <Option value="9">SAI GANDHINAGAR</Option>
              <Option value="10">SAI BANGALORE</Option>
              <Option value="26">SAI ZIRAKPUR</Option>
              <Option value="27">SAI GUWAHATI</Option>
              <Option value="28">SAI IMPHAL</Option>
              <Option value="29">SAI KOLKATA</Option>
              <Option value="30">SAI LUCKNOW</Option>
              <Option value="31">SAI TRIVANDRUM</Option>
              <Option value="32">SAI MUMBAI</Option>
              <Option value="33">SAI PATIALA</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter Password" }]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please enter Department" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="email"
            label="Email ID"
            rules={[{ required: true, message: "Please enter Email ID" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="contactNo"
            label="Contact No."
            rules={[{ required: true, message: "Please enter Contact No." }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="userType"
            label="User Role"
            rules={[{ required: true, message: "Please enter User Type" }]}
          >
            <Select>
              <Option value="11">Admin</Option>
              <Option value="12">Inventory Manager</Option>
              <Option value="13">Quality Manager</Option>
              <Option value="14">Item Admin</Option>
              <Option value="15">Vendor Admin</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select End date" }]}
          >
            <DatePicker format="YYYY/MM/DD" showTime={false} />
          </Form.Item>
        </Col>
        {/* <Col span={8}>
          <Form.Item
            name="userStatus"
            label="User Status"
            rules={[{ required: false, message: "Please enter User Status" }]}
          >
            <Input />
          </Form.Item>
        </Col> */}
        {/* <Col span={8}>
          <Form.Item
            name="privileges"
            label="Privileges"
            rules={[{ required: false, message: "Please enter Privileges" }]}
          >
            <Input />
          </Form.Item>
        </Col> */}
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
