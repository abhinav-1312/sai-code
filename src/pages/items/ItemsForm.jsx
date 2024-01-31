// ItemsForm.js
import React from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  InputNumber,
} from "antd";

const { Option } = Select;

const ItemsForm = ({
  onSubmit,
  initialValues,
  uoms,
  locations,
  locators,
  vendors,
  brands,
  colors,
}) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
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
            name="itemMasterCd"
            label="Item Code"
            rules={[{ required: true, message: "Please enter Item Code" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="itemMasterDesc"
            label="Item Description"
            rules={[
              { required: true, message: "Please enter Item Description" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="uomId"
            label="UOM"
            rules={[{ required: true, message: "Please enter UOM" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="quantity"
            label="Quantity on Hand"
            rules={[
              { required: true, message: "Please enter Quantity on Hand" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="locationId"
            label="Location"
            rules={[{ required: true, message: "Please enter Location" }]}
          >
            <Select>
              {locations.map((location, index) => {
                return (
                  <Option key={index} value={location.id}>
                    {location.locationName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="locatorId"
            label="Locator Code"
            rules={[{ required: true, message: "Please enter Locator Code" }]}
          >
            <Select>
              {locators.map((locator, index) => {
                return (
                  <Option key={index} value={locator.id}>
                    {locator.locatorCd}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="vendorId"
            label="Supplier Detail"
            rules={[
              { required: true, message: "Please enter Supplier Detail" },
            ]}
          >
            <Select>
              {vendors.map((vendor, index) => {
                return (
                  <Option key={index} value={vendor.id}>
                    {vendor.vendorName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter Category" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="subCategory"
            label="SUB-CATEGORY"
            rules={[{ required: true, message: "Please enter SUB-CATEGORY" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="type"
            label=" Type"
            rules={[{ required: true, message: "Please enter Item Type" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="disciplines"
            label="Disciplines"
            rules={[{ required: true, message: "Please enter Disciplines" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="brandId"
            label="Brand"
            rules={[{ required: true, message: "Please enter Brand " }]}
          >
            <Select>
              {brands.map((brand, index) => {
                return (
                  <Option key={index} value={brand.id}>
                    {brand.value}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="size"
            label="Size "
            rules={[{ required: true, message: "Please enter Size" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="colorId"
            label="Colour"
            rules={[{ required: true, message: "Please enter Colour" }]}
          >
            <Select>
              {colors.map((color, index) => {
                return (
                  <Option key={index} value={color.id}>
                    {color.value}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="minStockLevel"
            label="Minimum Stock Level"
            rules={[
              { required: true, message: "Please enter Minimum Stock Level" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="maxStockLevel"
            label="Maximum Stock Level"
            rules={[
              { required: true, message: "Please enter Maximum Stock Level" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="reOrderPoint"
            label="Reorder Point"
            rules={[{ required: true, message: "Please enter Reorder Point" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="usageCategory"
            label="Usage Category"
            rules={[{ required: true, message: "Please enter Category" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select Status" }]}
          >
            <Select>
              <Option value="A">Active</Option>
              <Option value="IA">Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="endDate" label="End Date">
            <DatePicker />
          </Form.Item>
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

export default ItemsForm;
