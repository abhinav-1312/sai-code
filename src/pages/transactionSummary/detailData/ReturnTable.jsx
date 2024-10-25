import React, { useEffect, useState } from 'react'
import DetailData from './DetailData'
import axios from 'axios'
import { apiHeader, convertArrayToObject, daysDifference, generateCsvData } from '../../../utils/Functions'
import { useSelector } from 'react-redux'

const ReturnTable = ({data, itemList, setCsv}) => {

    const {token} = useSelector(state => state.auth);
    const [uomObj, setUomObj] = useState({})
    const [locatorObj, setLocatorObj] = useState({})

const fetchUomLocatorMaster = async (setUomHook, setLocatorHook) => {
    try {
      const uomMasterUrl =
        "/master/getUOMMaster";
      const locatorMasterUrl =
        "/master/getLocatorMaster";
      const [uomMaster, locatorMaster] = await Promise.all([axios.get(uomMasterUrl, apiHeader("GET", token)), axios.get(locatorMasterUrl, apiHeader("GET", token))]);
      const { responseData: uomMasterData } = uomMaster.data;
      const { responseData: locatorMasterData } = locatorMaster.data;
      const uomMod = convertArrayToObject(uomMasterData, "id", "uomName");
      const locatorMod = convertArrayToObject(locatorMasterData, "id", "locatorDesc")
      setUomObj({ ...uomMod });
      setLocatorObj({...locatorMod})
    } catch (error) {
      console.log("Error fetching Uom master details.", error);
    }
  };

// const uomObj = fetchUom()
console.log("UOM OBJ: ",uomObj)

useEffect(()=>{
    fetchUomLocatorMaster()
    const csvData = generateCsvData("Return Note", dataColumns, data, itemListColumns, itemList)
    setCsv(csvData)
}, [])

 const orgConsignorDetails = [
    {
        title: "Consignor Regional Center Code",
        dataIndex: "crRegionalCenterCd"
    },
    {
        title: "Consignor Regional Center Name",
        dataIndex: "crRegionalCenterName"
    },
    {
        title: "Consignor Address",
        dataIndex: "crAddress"
    },
    {
        title: "Consignor Zipcode",
        dataIndex: "crZipcode"
    }
]
 const orgConsigneeDetails = [
    {
        title: "Consignee Regional Center Code",
        dataIndex: "ceRegionalCenterCd"
    },
    {
        title: "Consignee Regional Center Name",
        dataIndex: "ceRegionalCenterName"
    },
    {
        title: "Consignee Address",
        dataIndex: "ceAddress"
    },
    {
        title: "Consignee Zipcode",
        dataIndex: "ceZipcode"
    }
]

 const consumerDetails = [
    {
        title: "Consumer Name",
        dataIndex: "consumerName"
    },
    {
        title: "Contact No",
        dataIndex: "contactNo"
    }
]

const itemDetails = [
    {
        title: "Item Code",
        dataIndex: "itemCode"
    },
    {
        title: "Item Description",
        dataIndex: "itemDesc"
    },
    {
        title: "Uom Description",
        dataIndex: "uom",
        render: (uom) => uomObj[parseInt(uom)]
    },
]  

    const dataColumns = [
        {
            title: "Return Note No.",
            dataIndex: "processId"
        },
        {
            title: "Return Note Date",
            dataIndex: "returnNoteDt"
        },
        {
            title: "Issue Note No.",
            dataIndex: "processId"
        },
        {
            title: "Issue Note Date",
            dataIndex: "issueNoteDt"
        },
        {
            title: "Terms And Condition",
            dataIndex: "termsCondition"
        },
        {
            title: "Note",
            dataIndex: "note"
        },
        {
            title: "Generated by",
            dataIndex: "genName"
        },
        {
            title: "Generation Date",
            dataIndex: "genDate"
        },
        {
            title: "Returned / Submitted by",
            dataIndex: "approvedName"
        },
        {
            title: "Return / Submission Date",
            dataIndex: "approvedDate"
        },
        {
            title: "Consignor Regional Center Code",
            dataIndex: "regionalCenterCd"
        },
        {
            title: "Consignor Regional Center Name",
            dataIndex: "regionalCenterName"
        },
        {
            title: "Consignor Address",
            dataIndex: "address"
        },
        {
            title: "Consignor Zipcode",
            dataIndex: "zipcode"
        },
        ...consumerDetails

    ]

    const itemListColumns = [
        ...itemDetails,
        {
            title: "Return Quantity",
            dataIndex: "quantity"
        },
        {
            title: "Returned After No. Of Days",
            dataIndex: "requiredDays",
            render: (_, record) => daysDifference(data.issueNoteDt, data.genDate)
        },
        {
            title: "Condition Of Goods",
            dataIndex: "conditionOfGoods"
        },
        {
            title: "Remarks",
            dataIndex: "remarks"
        },
    ]
  return (
    <DetailData dataColumn={dataColumns}  itemListColumn={itemListColumns} data={data} itemList={itemList}/>
  )
}

export default ReturnTable
