import { Button, Form, Input, message, Select, Space, Table } from "antd";
import React, { useRef, useState } from "react";
import FormDatePickerItem from "../../components/FormDatePickerItem";
import { apiCall } from "../../utils/Functions";
import Highlighter from 'react-highlight-words';
import { useSelector } from "react-redux";
import {SearchOutlined, RightOutlined} from '@ant-design/icons'
import _ from 'lodash'

const { Option } = Select;

const txnType = {
null: "All",
  RN: "Return Note",
  ISN: "Issue Note",
  OGP: "Outward Gate Pass",
  IGP: "Inward Gate Pass",
  GRN: "Goods Receieved Note",
  IR: "Inspection Report",
  IRN: "Inspection Report New",
  REJ: "Rejection Note",
  ACT: "Acceptance Note",
};
const txnName = [

{
  text: "RN",
  value: "RN"
},
{
  text: "ISN",
  value: "ISN"
},
{
  text: "OGP",
  value: "OGP"
},
{
  text: "IGP",
  value: "IGP"
},
{
  text: "IR",
  value: "IR"
},
{
  text: "IRN",
  value: "IRN"
},
{
  text: "REJ",
  value: "REJ"
},
{
  text: "ACT",
  value: "ACT"
},
  {
    text: "GRN",
    value: "GRN"
  },
]


const TransactionSlab = ({allData, txnFilters, setTxnFilters, populateTxnData, setTxnSlabData, orgId}) => {
  // const [txnFilters, setTxnFilters] = useState({
  //   txnType: null,
  //   startDate: null,
  //   endDate: null,
  //   issueNoteType: null,
  // });

  console.log("TXN FILTERS: ", txnFilters)

  const handleFilterChange = (fieldName, value) => {
    setTxnFilters(prev => {
        return {
            ...prev,
            [fieldName]: value
        }
    })
  }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
        title: "Transaction Date",
        dataIndex: "txnDate"
    },
    {
        title: "Transaction No.",
        dataIndex: "id",
        ...getColumnSearchProps('id'),
        sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
      ellipsis: true,

    },
    {
        title: "Process Type",
        dataIndex: "processType",
        key: "processType",
        filters: [
          {
            text: "IRP",
            value: "IRP"
          },          
          {
            text: "NIRP",
            value: "NIRP"
          },          
          {
            text: "PO",
            value: "PO"
          },
          {
            text: "IOP",
            value: "IOP"
          },
        ],
        onFilter: (value, record) => record.processType.indexOf(value) === 0,
    },
    {
        title: "Transaction Name",
        dataIndex: "processStage",
        key: "processStage",
        filters: [...txnName],
        onFilter: (value, record) => record.processStage === value,
    },
    {
        title: "Generated By",
        dataIndex: "generatedBy"
    },
]


  const {token} = useSelector(state => state.auth)




  const handleTxnReset = () => {
    setTxnFilters({
      startDate: null,
      endDate: null,
      txnType: null,
      issueNoteType: null
    })

    populateTxnData()
  }

  const handleTxnSearch = async () => {

    if(txnFilters.txnType === "ISN"){
      if(!txnFilters.startDate || !txnFilters.endDate){
        message.error("Please enter from date and to date.")
        return
      }
      if(txnFilters.issueNoteType === "IRP" || txnFilters.issueNoteType === "NIRP"){
        try{
          const {responseData} = await apiCall("POST", "/getDashboardIssueNoteData", token, {startDate: txnFilters.startDate, endDate: txnFilters.endDate, type: txnFilters.issueNoteType, orgId: orgId ? orgId : null})
          const modData = responseData?.map(data=> {
            return {
              txnDate: data?.processData?.genDate,
              id: data.processId,
              processType: data?.processData?.type,
              processStage: data.processStage,
              generatedBy: data?.processData?.genName
            }
          })
          setTxnSlabData(prev => {
            return {
              ...prev,
              allData: modData ? [...modData].reverse() : []
            }
          })
        }catch(error){
          message.error("Some error occured fetching the data.")
          console.log("Error: ", error)
        }
      }
      else{
        try{
          const {responseData} = await apiCall("POST", "/getDashboardIssueNoteData", token, {startDate: txnFilters.startDate, endDate: txnFilters.endDate, type: "IRP", orgId: orgId ? orgId : null, pendingReturn: true})
          const modData = responseData?.map(data=> {
            return {
              txnDate: data?.processData?.genDate,
              id: data.processId,
              processType: data?.processData?.type,
              processStage: data.processStage,
              generatedBy: data?.processData?.genName
            }
          })
          setTxnSlabData(prev => {
            return {
              ...prev,
              allData: modData ? [...modData].reverse() : []
            }
          })
        }catch(error){
          message.error("Some error occured fetching the data.")
          console.log("Error: ", error)
        }
      }
    }
    else{
      try {
        const {responseData} = await apiCall("POST", "/txns/getTxnSummary", token, { startDate: txnFilters.startDate, endDate: txnFilters.endDate, txnType: txnFilters.txnType === "null" ? null : txnFilters.txnType, orgId: orgId ? orgId : null})
        setTxnSlabData(prev => {
          return {
            ...prev,
            allData: responseData ? [...responseData].reverse() : []
          }
        })
      } catch (error) {
        message.error("Error occured while fetching data. Please try again.");
        console.log("Populate data error.", error);
      }
    }
  }
  const [filteredInfo, setFilteredInfo] = useState({})
  // Calculate number of rows matching filters
  const modData = allData?.filter(record => {
    return Object.keys(filteredInfo).every(key => {
      const filterValues = filteredInfo[key];
      if (filterValues && filterValues.length > 0) {
        return filterValues.includes(_.trim(record[key]));
      }
      return true; // If no filter applied for this column, return true
    });
  });

  const renderAppliedFilters = () => {
    return (
      <div>
        <ul>
          {Object.keys(filteredInfo).map(key => {
            const filterValues = filteredInfo[key];
            if (filterValues && filterValues.length > 0) {
              const column = columns.find(col => col.dataIndex === key);
              return (
                // <li key={key}>
                <div>
                  <RightOutlined />
                  {column.title}:  <span style={{fontWeight: "normal"}}> {filterValues.join(', ')} </span>
                </div>
                // </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  };

  const handleTableChange = (pagination, filters) => {
    console.log('Filters changed txn slab:', filters);
    setFilteredInfo(filters); // Update filteredInfo state with applied filters
  };

  console.log("BOOLLL: ", filteredInfo)


  return (
    <div className="slab-content">
      <div className="filter-container">
          <Form.Item label="Transaction Type">
            <Select
              value={txnFilters.txnType}
              onChange={(value) => handleFilterChange("txnType", value)}
            >
              {Object.entries(txnType).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {
        txnFilters.txnType === "ISN" && (
                 <Form.Item label="Process Type">
            <Select
              value={txnFilters.issueNoteType}
              onChange={(value) => handleFilterChange("issueNoteType", value)}
            >
                <Option key={'IRP'} value={"IRP"}>
                  {"Returnable"}
                </Option>
                <Option key={'NIRP'} value={"NIRP"}>
                  {"Non Returnable"}
                </Option>
                <Option key={'pendingReturnable'} value={"pendingReturnable"}>
                  {"Pending Returnable"}
                </Option>
            </Select>
          </Form.Item>
          )
          }

          <FormDatePickerItem label="From Date" name="startDate" value={txnFilters.startDate} onChange={handleFilterChange} />
          <FormDatePickerItem label="To Date" name="endDate" value={txnFilters.endDate} onChange={handleFilterChange} />
          <Button primary style={{backgroundColor: "#ff8a00", fontWeight: "bold"}} onClick={handleTxnSearch}> Search </Button>
          <Button primary style={{fontWeight: "bold"}} onClick={handleTxnReset}> Reset </Button>
      </div>
      { filteredInfo && (filteredInfo.id || filteredInfo.processStage || filteredInfo.processType)  && (
         <div className="sec-slab" style={{color: "white", backgroundColor: "#2ECC71"}}>
         <div>No. of transactions for : </div>
         <div>{renderAppliedFilters()}</div>
         <div style={{fontSize: "2rem", fontWeight: "bold", textAlign: "center"}}>{modData.length}</div>
       </div>
      )}

      {
        allData &&
        <Table dataSource={allData} onChange={handleTableChange} columns={columns} pagination={{pageSize: 10}} />
      }
    </div>
  );
};

export default TransactionSlab;