import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  AutoComplete,
  Select,
  Table,
  Popover,
  message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios, { Axios } from "axios";
import moment from "moment";
import { apiHeader } from "../utils/Functions";
const { TextArea } = Input;
const { Search } = Input;

const ItemDemandSearch = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // State to hold selected item data
  const token = localStorage.getItem("token");

  const populateItemData = async () => {
    try{
      const {data} = await axios.get("/master/getItemMaster", apiHeader("GET", token))
      const {responseData} = data
      setFilteredData(responseData)
      setData(responseData)
    }
    catch(error){
      console.log("Error fetching data.", error)
      message.error("Error fetching data. Please try again.")
    }
  }

  useEffect(() => {
    // Fetch data from the API
    populateItemData()
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value);
    // Filter data based on any field
    const filtered = data.filter((item) => {
      // Check if any field includes the search value
      return Object.values(item).some((field) => {
        if (typeof field === "string") {
          return field.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      });
    });
    setFilteredData(filtered);
  };

  const handleSelectItem = (record) => {
    // Check if the item is already selected
    const index = selectedItems.findIndex((item) => item.id === record.id);
    if (index === -1) {
      setSelectedItems((prevItems) => [...prevItems, record]); // Update selected items state
    } else {
      // If item is already selected, deselect it
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  const columns = [
    { title: "S NO.", dataIndex: "id", key: "id", fixed: "left", width: 80 },
    {
      title: "ITEM CODE",
      dataIndex: "itemMasterCd",
      key: "itemCode",
    },
    {
      title: "ITEM DESCRIPTION",
      dataIndex: "itemMasterDesc",
      key: "itemMasterDesc",
    },
    { title: "UOM", dataIndex: "uom", key: "uom" },
    {
      title: "QUANTITY ON HAND",
      dataIndex: "quantity",
      key: "quantity",
    },
    { title: "LOCATION", dataIndex: "locationId", key: "location" },
    {
      title: "LOCATOR CODE",
      dataIndex: "locatorId",
      key: "locatorCode",
    },
    { title: "PRICE", dataIndex: "price", key: "price" },
    { title: "VENDOR DETAIL", dataIndex: "vendorId", key: "vendorDetail" },
    { title: "CATEGORY", dataIndex: "category", key: "category" },
    { title: "SUB-CATEGORY", dataIndex: "subCategory", key: "subCategory" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Disciplines", dataIndex: "disciplines", key: "disciplines" },
    { title: "Brand", dataIndex: "brandId", key: "brand" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Colour", dataIndex: "colorId", key: "colour" },
    {
      title: "Usage Category",
      dataIndex: "usageCategory",
      key: "usageCategory",
    },
    {
      title: "MINIMUM STOCK LEVEL",
      dataIndex: "minStockLevel",
      key: "minStockLevel",
    },
    {
      title: "MAXIMUM STOCK LEVEL",
      dataIndex: "maxStockLevel",
      key: "maxStockLevel",
    },
    { title: "RE ORDER POINT", dataIndex: "reOrderPoint", key: "reOrderPoint" },
    { title: "STATUS", dataIndex: "status", key: "status" },
    { title: "END DATE", dataIndex: "endDate", key: "endDate" },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (text, record) => (
        <Button
          type={
            selectedItems.some((item) => item.id === record.id)
              ? "warning"
              : "primary"
          }
          onClick={() => handleSelectItem(record)}
        >
          {selectedItems.some((item) => item.id === record.id)
            ? "Deselect"
            : "Select"}
        </Button>
      ),
    },
  ];

  return (
    <div className="goods-receive-note-form-container">
      <div style={{ width: "300px" }}>
        <Popover
          content={
            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={false}
              scroll={{ x: "max-content" }}
              style={{ width: "1000px" }}
            />
          }
          title="Filtered Item Data"
          trigger="click"
          visible={searchValue !== "" && filteredData.length > 0}
          style={{ width: "200px" }}
          placement="right"
        >
          <Search
            placeholder="Search Item Data"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={handleSearch}
          />
        </Popover>
      </div>
    </div>
  );
};

export default ItemDemandSearch;
