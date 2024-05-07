import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DetailData from "./detailData/DetailData";
import { apiHeader } from "../../utils/Functions";
import AcceptanceNoteTable from "./detailData/AcceptanceNoteTable";

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { trnno: url } = useParams();
  const urlArr = url.split("_");
  const trnNo = urlArr[0];

  const arrayToConvert = urlArr.slice(1);
  const objectFromArr = arrayToConvert.reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

  const [acceptData, setAcceptData] = useState(null);
  const [returnData, setReturnData] = useState(null);
  const [igpData, setIgpData] = useState(null);
  const [inspectionReportData, setInspectionReportData] = useState(null);
  const [isnData, setIsnData] = useState(null);
  const [grnData, setGrnData] = useState(null);
  const [ogpData, setOgpData] = useState(null);
  const [rejectData, setRejectData] = useState(null);
  const token = localStorage.getItem("token");
  const populateData = async () => {
    const trnDetailUrl =
      "https://uat-sai-app.azurewebsites.net/sai-inv-mgmt/txns/getTxnDtls";
    const { data } = await axios.post(
      trnDetailUrl,
      { processId: trnNo },
      apiHeader("POST", token)
    );
    const { responseData } = data;
    const {
      acceptData,
      grndata,
      igpdata,
      inspectionRptData,
      isndata,
      ogpdata,
      rejectData,
      rndata,
    } = responseData;
    setAcceptData(acceptData);
    setReturnData(rndata);
    setIgpData(igpdata);
    setInspectionReportData(inspectionRptData);
    setIsnData(isndata);
    setOgpData(ogpdata);
    setGrnData(grndata);
    setRejectData(rejectData);
  };

  console.log("Accept data", acceptData?.data.type)
  useEffect(() => {
    populateData();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Button type="primary" onClick={() => navigate("/trnsummary")}>
            Back
          </Button>
        </div>
        <h1>Transaction Detail</h1>
        <h1>Transaction No: {trnNo}</h1>
      </div>

      {objectFromArr["ACT"] && (
        <div>
        <h2>Acceptance Note</h2>
        {
          acceptData ? 
          <AcceptanceNoteTable type = {acceptData?.data.type}  processType='act' data = {acceptData?.data} itemList = {acceptData?.itemList} />
          :
          "No data available."
        }
      </div>
      )}

      {objectFromArr["GRN"] && (
        <div>
        <h2>Goods Receive Note</h2>
        {
          grnData ? 
          <AcceptanceNoteTable type = {grnData?.data.type}  processType='grn' data = {grnData?.data} itemList = {grnData?.itemList} />
          :
          "No data available."
        }
      </div>
      )}

      {/* { objectFromArr["GRN"] && <div>
        <h2>Goods Receive Note</h2>
        {
          grnData ?
          <DetailData processType='grn' data = {grnData?.data} itemList = {grnData?.itemList} />
          :
          "No data available."
        }
      </div>}

      {objectFromArr["IGP"] && <div>
        <h2>Inward Gate Pass</h2>
        {
          igpData ?
          <DetailData processType={"igp"} data={igpData?.data} itemList={igpData?.itemList} /> 
          :
          "No data available."
        }
      </div>}

      {objectFromArr["IR"] && <div>
        <h2>Material Inward Slip</h2>
        {
          inspectionReportData ?
          <DetailData processType={"ir"} data={inspectionReportData?.data} itemList={inspectionReportData?.itemList} /> 
          :
          "No data available."
        }
      </div>}

      {objectFromArr["ISN"] && <div>
        <h2>Issue Note</h2>
        {
          isnData ?
          <DetailData processType={"isn"} data={isnData?.data} itemList={isnData?.itemList} /> 
          :
          "No data available."
        }
      </div>
}
      {objectFromArr["OGP"] && <div>
        <h2>Outward Gate Pass</h2>
        {
          ogpData ?
          <DetailData processType="ogp" data={ogpData?.data} itemList={ogpData?.itemList} /> 
          :
          "No data available."
        }
      </div>}

     { objectFromArr["REJ"] && <div>
        <h2>Rejection Note</h2>
        {
          rejectData ?
          <DetailData processType='rej' data={rejectData?.data} itemList={rejectData?.itemList} /> 
          :
          "No data available."
        }
      </div>}

      {objectFromArr["RN"] && (
        <div>
          <h2>Return Note</h2>
          {returnData ? (
            <DetailData
              processType="rn"
              data={returnData?.data}
              itemList={returnData?.itemList}
            />
          ) : (
            "No data available."
          )}
        </div>
      )} */}
    </div>
  );
};

export default TransactionDetail;
