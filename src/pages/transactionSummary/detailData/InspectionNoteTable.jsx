import React, { useEffect, useState } from "react";
import {
  apiHeader,
  convertArrayToObject,
  convertEpochToDateString,
  generateCsvData,
} from "../../../utils/Functions";
import axios from "axios";
import DetailData from "./DetailData";
import { useSelector } from "react-redux";

const orgConsignorDetails = [
  {
    title: "Consignor Regional Center Code",
    dataIndex: "crRegionalCenterCd",
  },
  {
    title: "Consignor Regional Center Name",
    dataIndex: "crRegionalCenterName",
  },
  {
    title: "Consignor Address",
    dataIndex: "crAddress",
  },
  {
    title: "Consignor Zipcode",
    dataIndex: "crZipcode",
  },
];
const orgConsigneeDetails = [
  {
    title: "Consignee Regional Center Code",
    dataIndex: "ceRegionalCenterCd",
  },
  {
    title: "Consignee Regional Center Name",
    dataIndex: "ceRegionalCenterName",
  },
  {
    title: "Consignee Address",
    dataIndex: "ceAddress",
  },
  {
    title: "Consignee Zipcode",
    dataIndex: "ceZipcode",
  },
];

const consumerDetails = [
  {
    title: "Consumer Name",
    dataIndex: "consumerName",
  },
  {
    title: "Contact No",
    dataIndex: "contactNo",
  },
];

const itemDetails = [
  {
    title: "Item Code",
    dataIndex: "itemCode",
  },
  {
    title: "Item Description",
    dataIndex: "itemDesc",
  },
  {
    title: "Uom Description",
    dataIndex: "uomDesc",
  },
];

const supplierDetails = [
  {
    title: "Supplier Code",
    dataIndex: "supplierCd",
    render: (text, record) => record.supplierCd || record.supplierCode,
  },
  {
    title: "Supplier Name",
    dataIndex: "supplierName",
  },
  {
    title: "Supplier Address",
    dataIndex: "crAddress",
  },
];
const poExtraColumns = [
  ...supplierDetails,
  ...orgConsigneeDetails
];

const irpExtraColumn = [
  {
    title: "Outward Gate Pass No.",
    dataIndex: "processId",
  },
  ...orgConsignorDetails,
  ...consumerDetails,
];

const interOrgExtraColumn = [
  {
    title: "Rejection Note No.",
    dataIndex: "processId",
  },
  ...orgConsignorDetails,
  ...orgConsigneeDetails,
];
const dataColumn = [
  {
    title: "Mis Date",
    dataIndex: "inspectionRptDt",
  },
  {
    title: "Mis No.",
    dataIndex: "processId",
  },
  {
    title: "Process Type",
    dataIndex: "type",
  },
  // {
  //   title: "Inward Gate Pass No",
  //   dataIndex: "processId",
  // },
  {
    title: "Challan / Invoice No.",
    dataIndex: "challanNo",
  },
  {
    title: "Mode Of Delivery",
    dataIndex: "modeOfDelivery",
  },
  {
    title: "Date Of Delivery",
    dataIndex: "dateOfDelivery",
  },
  {
    title: "Generated By",
    dataIndex: "genName",
  },
  {
    title: "Generation Date",
    dataIndex: "genDate",
  },
  {
    title: "Approved By",
    dataIndex: "approvedName",
  },
  {
    title: "Approval Date",
    dataIndex: "approvedDate",
  },
  {
    title:  "Type of Inspection",
    dataIndex: "typeOfInspection"
  },
  {
    title:  "Date of Inspection",
    dataIndex: "inspectionRptDt"
  }
  // {
  //   title: "Condition Of Goods",
  //   dataIndex: "conditionOfGoods",
  // },
  // {
  //   title: "Note",
  //   dataIndex: "note",
  // },
];

const itemListColumn = [
  ...itemDetails,
  {
    title: "Inspected Quantity",
    dataIndex: "inspectedQuantity",
  },
  {
    title: "Accepted Quantity",
    dataIndex: "acceptedQuantity",
  },
  {
    title: "Rejected Quantity",
    dataIndex: "rejectedQuantity",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
  },
];

export const poInspDataColumns = [...dataColumn, ...poExtraColumns]
export const iopInspDataColumns = [...dataColumn, ...interOrgExtraColumn]
export const poIopInspItemListColumns = itemListColumn

const InspectionNoteTable = ({type, data, itemList, setCsv}) => {
  const {token} = useSelector(state => state.auth);
  const [uomObj, setUomObj] = useState({});
  const [locatorObj, setLocatorObj] = useState({});

  const fetchUom = async () => {
    const uomMasterUrl =
      "/master/getUOMMaster";
    const locatorMasterUrl =
      "/master/getLocatorMaster";

    try {
      const [uomMaster, locatorMaster] = await Promise.all([
        axios.get(uomMasterUrl, apiHeader("GET", token)),
        axios.get(locatorMasterUrl, apiHeader("GET", token)),
      ]);
      const { responseData: uomMasterData } = uomMaster.data;
      const { responseData: locatorMasterData } = locatorMaster.data;
      const uomMod = convertArrayToObject(uomMasterData, "id", "uomName");
      const locatorMod = convertArrayToObject(
        locatorMasterData,
        "id",
        "locatorDesc"
      );

      setUomObj({ ...uomMod });
      setLocatorObj({ ...locatorMod });
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchUom();
    const csvData = generateCsvData("Inspection Note", dataColumnsUpdated, data, itemListColumn, itemList)
    setCsv(csvData)
  }, []);
  

  const dataColumnsUpdated = type === "PO" ? [...dataColumn, ...poExtraColumns] :(type === "IRP" ? [...dataColumn, irpExtraColumn] : [...dataColumn, ...interOrgExtraColumn] )

  return(
    <DetailData dataColumn={dataColumnsUpdated} itemListColumn={itemListColumn} data={data} itemList={itemList}/>
  )
};

export default InspectionNoteTable;
