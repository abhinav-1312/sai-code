import { Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import { handleSearch } from "../../utils/Functions";
import { useSelector } from "react-redux";
import { RightOutlined} from '@ant-design/icons'
import _ from 'lodash'
import OrgWiseCountBar from "./graphs/BarGraph";

const { Search } = Input;

const ItemSlab = ({allData, itemDescDropdownList, subCategoryDropdownList, countOrgWise, orgId}) => {
  const [filteredData, setFilteredData] = useState();
  const {orgMasterObj} = useSelector(state => state?.organizations || {})
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
 
  const columns = [
    {
      title: "Item Code",
      dataIndex: "itemCode",
    },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
      key: 'itemDescription',
      filters:itemDescDropdownList? itemDescDropdownList : [],
      onFilter: (value, record) => record?.itemDescription?.indexOf(value.split('-')[0]) === 0,
    },
    {
      title: "Subcategory",
      dataIndex: "subCategoryDesc",
      key: "subCategoryDesc",
        filters: subCategoryDropdownList || [],
        onFilter: (value, record) => record?.subCategoryDesc?.indexOf(_.trim(value)) === 0,
    },
    {
      title: "FNS Category",
      dataIndex: "fnsCategory",
      key: 'fnsCategory',
      filters: [
        {
          text: "Fast Moving",
          value: "Fast Moving"
        },
        {
          text: "Slow Moving",
          value: "Slow Moving"
        },
        {
        text: "No Moving",
          value: "No Moving"
        },
      ],
      onFilter: (value, record) => record?.fnsCategory?.indexOf(value) === 0,
    },
    {
      title: 'Organization Name',
      dataIndex: 'orgId',
      render: (value) => orgMasterObj ? orgMasterObj[value] : "---"
    }
  ];

   // Handle filters change
   const handleTableChange = (pagination, filters) => {
    setFilteredInfo(filters); // Update filteredInfo state with applied filters
  };

  useEffect(() =>{
    setFilteredData(allData || [])
  }, [allData])

  if(!allData 
    // || 
    // !orgMasterObj
  )
    {
    return (
      <h3>Loading</h3>
    )
  }

  

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
                <div>
                  <RightOutlined />
                  {column.title}:  <span style={{fontWeight: "normal"}}> {filterValues.join(', ')} </span>
                </div>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  };

 
  return (
    <div>
      {
        !orgId &&
        <OrgWiseCountBar labels = {Object.keys(countOrgWise)} values = {Object.values(countOrgWise)} legend="Unique Items" />
      }
      <div style={{ marginBottom: "1rem" }}>
        <Search
          placeholder="Search items"
          onChange={(e) =>
            handleSearch(
              e.target?.value || "",
              allData,
              setFilteredData,
              setSearchText
            )
          }
          value={searchText}
          style={{ width: 200 }}
        />
      </div>

      {Object.keys(filteredInfo).length > 0 && (
        <>
        <div className="sec-slab" style={{color: "white", backgroundColor: "#1ABC9C"}}>
          <div>No. of items for : </div>
          <div>{renderAppliedFilters()}</div>
          <div style={{fontSize: "2rem", fontWeight: "bold", textAlign: "center"}}>{modData.length}</div>
        </div>
        </>
      )}


      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 10 }}
        onChange={handleTableChange}
      />

    </div>
  );
};

export default ItemSlab;
