// UOMForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import InputDatePickerCombo from '../../components/InputDatePickerCombo';
import FormDatePickerItem from '../../components/FormDatePickerItem';
import { useSelector } from 'react-redux';
import { convertEpochToDateString } from '../../utils/Functions';

const UOMForm = ({ onSubmit, initialValues }) => {

  
  const [form] = Form.useForm();

  const {userCd} = useSelector((state) => state.auth);

  const [endDate, setEndDate] = useState(null);

  const handleChange = (field, dateString) => {
    setEndDate(dateString);
  }
  
  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      userId: userCd,
      endDate: endDate
    };
    onSubmit(formattedValues);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues} layout="vertical">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="uomCode" label="UOM Code" rules={[{ required: true, message: 'Please enter UOM Code' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="uomName" label="UOM Name" rules={[{ required: true, message: 'Please enter UOM Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="uomDesc" label="UOM Description" rules={[{ required: true, message: 'Please enter UOM Description' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="className" label="Class Name" rules={[{ required: true, message: 'Please enter Class Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="baseUom" label="Base UOM Name" rules={[{ required: true, message: 'Please enter Base UOM Name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          {/* <Form.Item name="endDate" label="End Date">
            <DatePicker />
          </Form.Item> */}
          <FormDatePickerItem label="End Date" name="endDate" onChange={handleChange} defaultValue={convertEpochToDateString(initialValues?.endDate || null)}/>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UOMForm;
