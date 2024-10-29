import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiHeader, convertArrayToObject, convertEpochToDateString, fetchUomLocatorMaster, generateCsvData } from '../../../utils/Functions'
import DetailData from './DetailData'

export const poOgpDataColumns = [
    {
        title: "Outward Gate Pass No.",
        dataIndex: "processId"
    },
    {
        title: "Outward Gate Pass Date",
        dataIndex: "gatePassDate"
    },
    {
        title: "Process Type",
        dataIndex: "type"
    },
    {
        title: "Generated By",
        dataIndex: "genName"
    },
    {
        title: "Generation Date",
        dataIndex: "genDate"
    },
    {
        title: "Received By",
        dataIndex: "issueName"
    },
    {
        title: "Receiving Date",
        dataIndex: "issueDate"
    },
    {
        title: "Rejection Note no.",
        dataIndex: "processId"
    },
    {
        title: "Noa no.",
        dataIndex: "noaNo"
    },
    {
        title: "Noa Date",
        dataIndex: "noaDate",
        render: (date) => convertEpochToDateString(date)
    },
    {
        title: "Mode Of Delivery",
        dataIndex: "modeOfDelivery"
    },
    {
        title: "Date Of Delivery",
        dataIndex: "dateOfDelivery"
    },
    {
        title: "Challan/Invoice No.",
        dataIndex: "challanNo"
    },
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
    }, 
    {
        title: "Supplier Code",
        dataIndex: "supplierCd" || "supplierCode"
    },
    {
        title: "Supplier Name",
        dataIndex: "supplierName"
    },
    {
        title: "Supplier Address",
        dataIndex: "crAddress"
    }
]

export const irpOgpDataColumns = [
    {
        title: "Outward Gate Pass No.",
        dataIndex: "processId"
    },
    {
        title: "Outward Gate Pass Date",
        dataIndex: "gatePassDate"
    },
    {
        title: "Process Type",
        dataIndex: "type"
    },
    {
        title: "Generated By",
        dataIndex: "genName"
    },
    {
        title: "Generation Date",
        dataIndex: "genDate"
    },
    {
        title: "Received By",
        dataIndex: "issueName"
    },
    {
        title: "Receiving Date",
        dataIndex: "issueDate"
    },
    {
        title: "Issue Note No.",
        dataIndex: "processId"
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
    },
    {
        title: "Supplier Code",
        dataIndex: "supplierCd" || "supplierCode"
    },
    {
        title: "Supplier Name",
        dataIndex: "supplierName"
    },
    {
        title: "Supplier Address",
        dataIndex: "crAddress"
    }
]

export const iopOgpDataColumns = [
    {
        title: "Outward Gate Pass No.",
        dataIndex: "processId"
    },
    {
        title: "Outward Gate Pass Date",
        dataIndex: "gatePassDate"
    },
    {
        title: "Process Type",
        dataIndex: "type"
    },
    {
        title: "Generated By",
        dataIndex: "genName"
    },
    {
        title: "Generation Date",
        dataIndex: "genDate"
    },
    {
        title: "Received By",
        dataIndex: "issueName"
    },
    {
        title: "Receiving Date",
        dataIndex: "issueDate"
    },
    {
        title: "Rejection / Issue Note no.",
        dataIndex: "processId"
    },
    {
        title: "Noa no.",
        dataIndex: "noa"
    },
    {
        title: "Noa Date",
        dataIndex: "noaDate",
        render: (date) => convertEpochToDateString(date)
    },
    {
        title: "Mode Of Delivery",
        dataIndex: "modeOfDelivery"
    },
    {
        title: "Date Of Delivery",
        dataIndex: "dateOfDelivery"
    },
    {
        title: "Challan/Invoice No.",
        dataIndex: "challanNo"
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
    },
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

export const irpPoIopOgpItemListColumns = [
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
        dataIndex: "uomDesc",
    },
    {
        title: "Quantity",
        dataIndex: "quantity"
    },
    {
        title: "Remarks",
        dataIndex: "remarks"
    },
    {
        title: "Locator Description",
        dataIndex: "locatorDesc",
    },
    {
        title: "Required For No Of Days",
        dataIndex: "requiredDays",
    }
]


const OgpTable = ({type, data, itemList, setCsv}) => {
    const [uomObj, setUomObj] = useState({})
    const [locatorObj, setLocatorObj] = useState({})

    useEffect(()=>{
        fetchUomLocatorMaster(setUomObj, setLocatorObj)
        const csvData = generateCsvData("Outward Gate Pass", dataColumnsUpdated, data, itemListColumns, itemList);
        setCsv(csvData)
    }, [])

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
    
    const supplierDetails = [
        {
            title: "Supplier Code",
            dataIndex: "supplierCd" || "supplierCode"
        },
        {
            title: "Supplier Name",
            dataIndex: "supplierName"
        },
        {
            title: "Supplier Address",
            dataIndex: "crAddress"
        }
    ]

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

    const irpItemListExtra = [
        {
            title: "Locator Description",
            dataIndex: "locatorId",
            render: (id) => locatorObj[parseInt(id)]
        },
        {
            title: "Required For No Of Days",
            dataIndex: "requiredDays",

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

    let dataColumns = [
        {
            title: "Outward Gate Pass No.",
            dataIndex: "processId"
        },
        {
            title: "Outward Gate Pass Date",
            dataIndex: "gatePassDate"
        },
        {
            title: "Process Type",
            dataIndex: "type"
        },
        {
            title: "Generated By",
            dataIndex: "genName"
        },
        {
            title: "Generation Date",
            dataIndex: "genDate"
        },
        {
            title: "Received By",
            dataIndex: "issueName"
        },
        {
            title: "Receiving Date",
            dataIndex: "issueDate"
        },
    ]

    const irpExtraColumns = [
        {
            title: "Issue Note No.",
            dataIndex: "processId"
        },
        {
            title: "Terms And Condition",
            dataIndex: "termsCondition"
        },
        {
            title: "Note",
            dataIndex: "note"
        },
        ...orgConsignorDetails, 
        ...consumerDetails
        
    ]

    const poExtraColumns = [
        {
            title: "Rejection Note no.",
            dataIndex: "processId"
        },
        {
            title: "Noa no.",
            dataIndex: "noaNo"
        },
        {
            title: "Noa Date",
            dataIndex: "noaDate",
            render: (date) => convertEpochToDateString(date)
        },
        {
            title: "Mode Of Delivery",
            dataIndex: "modeOfDelivery"
        },
        {
            title: "Date Of Delivery",
            dataIndex: "dateOfDelivery"
        },
        {
            title: "Challan/Invoice No.",
            dataIndex: "challanNo"
        },
        ...orgConsignorDetails,
        ...supplierDetails
    ]

    const interOrgExtraColumns = [
        {
            title: "Rejection / Issue Note no.",
            dataIndex: "processId"
        },
        {
            title: "Noa no.",
            dataIndex: "noa"
        },
        {
            title: "Noa Date",
            dataIndex: "noaDate",
            render: (date) => convertEpochToDateString(date)
        },
        {
            title: "Mode Of Delivery",
            dataIndex: "modeOfDelivery"
        },
        {
            title: "Date Of Delivery",
            dataIndex: "dateOfDelivery"
        },
        {
            title: "Challan/Invoice No.",
            dataIndex: "challanNo"
        },
        {
            title: "Terms And Condition",
            dataIndex: "termsCondition"
        },
        {
            title: "Note",
            dataIndex: "note"
        },
        ...orgConsigneeDetails,
        ...orgConsignorDetails
    ]

    const itemListColumns = [
        ...itemDetails,
        {
            title: "Quantity",
            dataIndex: "quantity"
        },
        {
            title: "Remarks",
            dataIndex: "remarks"
        },
        ...irpItemListExtra
    ]

    const dataColumnsUpdated = type === "PO" ? [...dataColumns, ...poExtraColumns] : (type === "IOP" ? [...dataColumns, interOrgExtraColumns] : [...dataColumns, ...irpExtraColumns])

  return (
    <DetailData dataColumn={dataColumnsUpdated} itemListColumn={itemListColumns} data={data} itemList={itemList}/>
  )
}

export default OgpTable
