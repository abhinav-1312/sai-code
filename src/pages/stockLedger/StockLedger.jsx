import { Button, DatePicker, Form, message, Select, Table, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { apiHeader } from "../../utils/Functions";
import { ExportOutlined } from "@ant-design/icons";
import axios from "axios";
import { CSVLink } from 'react-csv';
import moment from "moment";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = "DD/MM/YYYY";

const StockLedger = ({orgId}) => {
  const {token} = useSelector(state => state.auth);

  const [filterOption, setFilterOption] = useState({
    fromDate: null,
    toDate: null,
    itemCode: null,
    subCategory: null,
  });

  const [filterType, setFilterType] = useState("item"); // "item" or "subcategory"
  const [itemData, setItemData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [ledger, setLedger] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [locator, setLocator] = useState({});
  const [location, setLocation] = useState({});
  const [csvLinkRef, setCsvLinkRef] = useState(null);

  const populateItemData = async () => {
    try{
      const { data } = await axios.get(
        "/master/getItemMaster",
        apiHeader("GET", token)
      );
      const { responseData } = data;
  
      const modData = responseData?.map((item) => {
        return {
          itemMasterCd: item.itemMasterCd,
          itemMasterDesc: item.itemMasterDesc,
          subCategory: item.subCategoryDesc,
        };
      });
  
      setItemData([...modData]);
      
      // Extract unique subcategories
      const uniqueSubCategories = [...new Set(responseData?.map(item => item.subCategoryDesc))];
      setSubCategoryData(uniqueSubCategories.filter(Boolean));
    }
    catch(error){
      message.error("Some error occurred. Please try again");
    }
  };

  const populateByOrgId = async () => {
    const url = "/master/getItemMasterByOrgId";

    try{
      const { data } = await axios.post(url, {orgId}, apiHeader("POST", token));
      const { responseData } = data;
      const modData = responseData?.map((item) => {
        return {
          itemMasterCd: item.itemMasterCd,
          itemMasterDesc: item.itemMasterDesc,
          subCategory: item.subCategoryDesc,
        };
      });

      setItemData([...modData]);
      
      // Extract unique subcategories
      const uniqueSubCategories = [...new Set(responseData?.map(item => item.subCategoryDesc))];
      setSubCategoryData(uniqueSubCategories.filter(Boolean));
    }
    catch(error){
      message.error("Some error occurred. Please try again");
    }
  };

  const fetchLocationLocatorByOrgId = async () => {
    const locatorUrl = "/master/getLocatorMasterByOrgId";
    const locationUrl = "/master/getLocationMasterByOrgId";
    try{
      const [locatorData, locationData] = await Promise.all([
        axios.post(locatorUrl, {orgId}, apiHeader("POST", token)),
        axios.post(locationUrl, {orgId}, apiHeader("POST", token)),
      ]);
    
      const locatorObj = locatorData?.data?.responseData?.reduce((acc, curr) => {
        acc[curr.id] = curr.locatorDesc;
        return acc;
      }, {});

      const locationObj = locationData?.data?.responseData?.reduce((acc, curr) => {
        acc[curr.id] = curr.locationName;
        return acc;
      }, {});
  
      setLocator({...locatorObj});
      setLocation({...locationObj});
    }
    catch(error){
      message.error("Error occurred. Please try again.");
    }
  };

  const fetchLocatorLocationDtls = async () => {
    const locatorUrl = "/master/getLocatorMaster";
    const locationUrl = "/master/getLocationMaster";
    try{
      const [locatorData, locationData] = await Promise.all([
        axios.get(locatorUrl, apiHeader("GET", token)),
        axios.get(locationUrl, apiHeader("GET", token)),
      ]);
    
      const locatorObj = locatorData?.data?.responseData?.reduce((acc, curr) => {
        acc[curr.id] = curr.locatorDesc;
        return acc;
      }, {});

      const locationObj = locationData?.data?.responseData?.reduce((acc, curr) => {
        acc[curr.id] = curr.locationName;
        return acc;
      }, {});
  
      setLocator({...locatorObj});
      setLocation({...locationObj});
    }
    catch(error){
      message.error("Error occurred. Please try again.");
    }
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "processId",
    },
    {
      title: "Transaction Date",
      dataIndex: "txnDate",
    },
    {
      title: "Item Code",
      dataIndex: "itemMasterCd",
    },
    {
      title: "Item Description",
      dataIndex: "itemMasterDesc",
    },
    {
      title: "Post Quantity",
      dataIndex: "postQuantity",
    },
    {
      title: "Previous Quantity",
      dataIndex: "preQuantity",
    },
    {
      title: "Process Stage",
      dataIndex: "processStage",
    },
    {
      title: "Location Description",
      dataIndex: "locationId",
      render: (id) => location[parseInt(id)]
    },
    {
      title: "Locator Description",
      dataIndex: "locatorId",
      render: (id) => locator[parseInt(id)]
    },
  ];

  useEffect(() => {
    if(orgId){
      populateByOrgId();
      fetchLocationLocatorByOrgId();
    }
    else{
      populateItemData();
      fetchLocatorLocationDtls();
    }
  }, [orgId]);

  const handleFormValueChange = (fieldName, value) => {
    setFilterOption((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleReset = () => {
    setFilterOption({
      fromDate: null,
      toDate: null,
      itemCode: null,
      subCategory: null,
    });
    setLedger(null);
    setCsvData(null);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilterOption({
      fromDate: filterOption.fromDate,
      toDate: filterOption.toDate,
      itemCode: null,
      subCategory: null,
    });
    setLedger(null);
    setCsvData(null);
  };

  const fetchStockLedgerBySubCategory = async (subCategory) => {
    const url = "/txns/getStockLedger";
    
    // Filter items based on subcategory
    const filteredItems = subCategory === "all" 
      ? itemData 
      : itemData.filter(item => item.subCategory === subCategory);
    
    if (filteredItems.length === 0) {
      message.warning("No items found for selected subcategory");
      return [];
    }

    try {
      // Fetch ledger for all items in the subcategory
      const ledgerPromises = filteredItems.map(item => {
        const payload = {
          fromDate: filterOption.fromDate,
          toDate: filterOption.toDate,
          itemCode: item.itemMasterCd,
        };
        
        if (orgId) {
          payload.orgId = orgId;
        }
        
        return axios.post(url, payload, apiHeader("POST", token))
          .then(response => ({
            itemCode: item.itemMasterCd,
            itemDesc: item.itemMasterDesc,
            subCategory: item.subCategory,
            data: response.data.responseData
          }))
          .catch(error => {
            console.error(`Error fetching ledger for ${item.itemMasterCd}:`, error);
            return null;
          });
      });

      const results = await Promise.all(ledgerPromises);
      return results.filter(result => result !== null && result.data && result.data.txns && result.data.txns.length > 0);
    } catch (error) {
      message.error("Error occurred while fetching stock ledger. Please try again.");
      return [];
    }
  };

  const handleExportClick = async () => {
    if (filterType === "item" && ledger) {
      // Existing item-wise export
      const csvContent = [
        ['Opening Stock', ledger.initQuantity],
        ['Closing Stock', ledger.finalQuantity],
        ['Transaction ID', "Transaction Date", 'Item Code', 'Item Description', "Previous Quantity", "Post Quantity", "Process Stage", "Location Description", "Locator Description"],
        ...ledger.txns.map(item => [
          item.processId, 
          item.txnDate, 
          item.itemMasterCd, 
          item.itemMasterDesc, 
          item.preQuantity, 
          item.postQuantity, 
          item.processStage, 
          location[item.locationId], 
          locator[item.locatorId]
        ])
      ];

      setCsvData(csvContent);
      setTimeout(() => {
        if (csvLinkRef) {
          csvLinkRef.link.click();
        }
      }, 100);
    } else if (filterType === "subcategory") {
      // Subcategory-wise export
      message.loading("Preparing export data...", 0);
      
      const ledgerData = await fetchStockLedgerBySubCategory(filterOption.subCategory);
      
      message.destroy();
      
      if (ledgerData.length === 0) {
        message.warning("No transactions found for the selected criteria");
        return;
      }

      // Prepare CSV data with all items grouped
      const csvContent = [];
      
      // Header
      csvContent.push(['Stock Ledger Report - Subcategory Wise']);
      csvContent.push(['Date Range:', `${filterOption.fromDate} to ${filterOption.toDate}`]);
      csvContent.push(['Subcategory:', filterOption.subCategory === "all" ? "All Categories" : filterOption.subCategory]);
      csvContent.push([]); // Empty row

      // Data for each item
      ledgerData.forEach((itemLedger, index) => {
        if (index > 0) {
          csvContent.push([]); // Empty row between items
        }
        
        csvContent.push([`Item ${index + 1}: ${itemLedger.itemDesc}`]);
        csvContent.push(['Item Code:', itemLedger.itemCode]);
        csvContent.push(['Sub Category:', itemLedger.subCategory]);
        csvContent.push(['Opening Stock:', itemLedger.data.initQuantity]);
        csvContent.push(['Closing Stock:', itemLedger.data.finalQuantity]);
        csvContent.push(['Item Created By:', itemLedger.data.createUser]);
        csvContent.push(['Item Creation Date:', itemLedger.data.createDate]);
        csvContent.push(['Initial Quantity:', itemLedger.data.firstQuantity || 'N/A']);
        csvContent.push([]); // Empty row
        
        // Transaction header
        csvContent.push(['Transaction ID', 'Transaction Date', 'Previous Quantity', 'Post Quantity', 'Process Stage', 'Location', 'Locator']);
        
        // Transactions
        itemLedger.data.txns.forEach(txn => {
          csvContent.push([
            txn.processId,
            txn.txnDate,
            txn.preQuantity,
            txn.postQuantity,
            txn.processStage,
            location[txn.locationId],
            locator[txn.locatorId]
          ]);
        });
      });

      setCsvData(csvContent);
      setTimeout(() => {
        if (csvLinkRef) {
          csvLinkRef.link.click();
        }
      }, 100);
    }
  };

  const handleSearch = async () => {
    if (filterOption.fromDate === null || filterOption.toDate === null) {
      message.error("Please enter date range.");
      return;
    }

    if (filterType === "item") {
      if (filterOption.itemCode === null) {
        message.error("Please select an item.");
        return;
      }

      const url = "/txns/getStockLedger";
      try {
        const payload = {
          fromDate: filterOption.fromDate,
          toDate: filterOption.toDate,
          itemCode: filterOption.itemCode,
        };
        
        if (orgId) {
          payload.orgId = orgId;
        }

        const { data } = await axios.post(url, payload, apiHeader("POST", token));
        const { responseData } = data;
        setLedger(responseData || null);
        
        if (!responseData || !responseData.txns || responseData.txns.length === 0) {
          message.warning("No transactions found for the selected criteria");
        }
      } catch (error) {
        message.error("Error occurred while fetching stock ledger. Please try again.");
      }
    } else if (filterType === "subcategory") {
      if (filterOption.subCategory === null) {
        message.error("Please select a subcategory.");
        return;
      }

      message.loading("Fetching stock ledger data...", 0);
      const ledgerData = await fetchStockLedgerBySubCategory(filterOption.subCategory);
      message.destroy();

      if (ledgerData.length === 0) {
        message.warning("No transactions found for the selected criteria");
        setLedger(null);
      } else {
        // Create a combined view for display
        const allTransactions = [];
        ledgerData.forEach(itemLedger => {
          allTransactions.push(...itemLedger.data.txns);
        });

        // Sort by date
        allTransactions.sort((a, b) => {
          const dateA = moment(a.txnDate, "DD/MM/YYYY HH:mm:ss");
          const dateB = moment(b.txnDate, "DD/MM/YYYY HH:mm:ss");
          return dateA - dateB;
        });

        setLedger({
          txns: allTransactions,
          itemCount: ledgerData.length,
          subCategoryData: ledgerData
        });
        
        message.success(`Found ${ledgerData.length} items with ${allTransactions.length} transactions`);
      }
    }
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  const handleRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const startDateStr = dates[0].format(dateFormat);
      const endDateStr = dates[1].format(dateFormat);

      setFilterOption(prev => {
        return {
          ...prev,
          fromDate: startDateStr,
          toDate: endDateStr
        };
      });
    }
  };

  const getFileName = () => {
    if (filterType === "item") {
      return `StockLedger_${filterOption.itemCode}_${moment().format('DDMMYYYY')}.csv`;
    } else {
      const subCatName = filterOption.subCategory === "all" ? "AllCategories" : filterOption.subCategory;
      return `StockLedger_${subCatName}_${moment().format('DDMMYYYY')}.csv`;
    }
  };

  return (
    <>
      <h1>Stock Ledger</h1>

      <div
        style={{
          border: "1px solid #003566",
          padding: "1rem",
          borderRadius: "1%",
          marginTop: "1rem",
        }}
      >
        <Form
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "1rem",
          }}
        >
          <Form.Item label="Filter Type" style={{ gridColumn: "span 6" }}>
            <Radio.Group value={filterType} onChange={handleFilterTypeChange}>
              <Radio value="item">Item Wise</Radio>
              <Radio value="subcategory">Subcategory Wise</Radio>
            </Radio.Group>
          </Form.Item>

          {filterType === "item" ? (
            <Form.Item 
              label="Item Description" 
              style={{ gridColumn: "span 2" }} 
              rules={[{ required: true, message: 'Please enter Item Code' }]}
            >
              <Select
                value={filterOption?.itemCode}
                onChange={(value) => handleFormValueChange("itemCode", value)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {itemData.map((item) => {
                  return (
                    <Option key={item.itemMasterCd} value={item.itemMasterCd}>
                      {item.itemMasterDesc}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item 
              label="Sub Category" 
              style={{ gridColumn: "span 2" }}
              rules={[{ required: true, message: 'Please select Sub Category' }]}
            >
              <Select
                value={filterOption?.subCategory}
                onChange={(value) => handleFormValueChange("subCategory", value)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="all">All Subcategories</Option>
                {subCategoryData.map((subCat) => {
                  return (
                    <Option key={subCat} value={subCat}>
                      {subCat}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}

          <Form.Item style={{ gridColumn: "span 2" }}> 
            <RangePicker
              value={[
                filterOption.fromDate ? moment(filterOption.fromDate, 'DD/MM/YYYY') : null, 
                filterOption.toDate ? moment(filterOption.toDate, 'DD/MM/YYYY') : null
              ]}
              style={{width: "100%"}}
              format={dateFormat}
              onChange={handleRangeChange}
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Button type="primary" onClick={() => handleSearch()}>
            Search
          </Button>
          <Button onClick={() => handleReset()}>Reset</Button>
        </Form>
      </div>

      {ledger && ledger.txns && ledger.txns.length > 0 && (
        <div
          style={{
            border: "2px solid #003566",
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {filterType === "item" ? (
              <div
                style={{
                  margin: "1rem 0",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  border: "1px solid #003566",
                }}
              >
                <div style={{ padding: ".5rem", backgroundColor: "#003566" }}>
                  <h3 style={{ color: "white" }}>Opening Stock</h3>
                </div>
                <h3 style={{ padding: ".5rem", textAlign: "center", borderBottom: "1px solid #003566", lineHeight: "2" }}>
                  {ledger.initQuantity}
                </h3>
                <div style={{ padding: ".5rem", backgroundColor: "#003566" }}>
                  <h3 style={{ color: "white" }}>Closing Stock</h3>
                </div>
                <h3 style={{ padding: ".5rem", textAlign: "center", borderBottom: "1px solid #003566", lineHeight: "2" }}>
                  {ledger.finalQuantity}
                </h3>
                <div style={{ padding: ".5rem", backgroundColor: "#003566" }}>
                  <h3 style={{ color: "white" }}>Item Created By</h3>
                </div>
                <h3 style={{ padding: ".5rem", textAlign: "center", borderBottom: "1px solid #003566", lineHeight: "2" }}>
                  {ledger.createUser}
                </h3>
                <div style={{ padding: ".5rem", backgroundColor: "#003566" }}>
                  <h3 style={{ color: "white" }}>Item Creation Date</h3>
                </div>
                <h3 style={{ padding: ".5rem", textAlign: "center", borderBottom: "1px solid #003566", lineHeight: "2" }}>
                  {ledger.createDate}
                </h3>
                <div style={{ padding: ".5rem", backgroundColor: "#003566" }}>
                  <h3 style={{ color: "white" }}>Initial Quantity On Item Creation</h3>
                </div>
                <h3 style={{ padding: ".5rem", textAlign: "center", borderBottom: "1px solid #003566", lineHeight: "2" }}>
                  {ledger.firstQuantity || "N/A"}
                </h3>
              </div>
            ) : (
              <div style={{ margin: "1rem 0" }}>
                <h3>Total Items: {ledger.itemCount}</h3>
                <h3>Total Transactions: {ledger.txns.length}</h3>
              </div>
            )}

            <div>
              <Button
                type="primary"
                style={{
                  padding: "1rem 2rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                }}
                onClick={handleExportClick}
              >
                <span>Export to CSV </span>
                <span>
                  <ExportOutlined />
                </span>
              </Button>
              {csvData && (
                <CSVLink 
                  data={csvData} 
                  filename={getFileName()}
                  ref={(ref) => setCsvLinkRef(ref)}
                  style={{ display: 'none' }}
                >
                  Download CSV
                </CSVLink>
              )}
            </div>
          </div>

          <div>
            <Table 
              dataSource={ledger?.txns} 
              columns={columns}
              pagination={{ pageSize: 50 }}
              scroll={{ x: 1200 }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StockLedger;