// AcceptanceNote.js
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
  AutoComplete,
  message,
  Modal,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import FormInputItem from "../../../components/FormInputItem";
import { FormItemInputContext } from "antd/es/form/context";
import { convertArrayToObject } from "../../../utils/Functions";
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const { Title } = Typography;

const AcceptanceNote = () => {
  const [Type, setType] = useState("PO");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [itemData, setItemData] = useState([]);
  const [uomMaster, setUomMaster] = useState({});
  const [formData, setFormData] = useState({
    genDate: "",
    genName: "",
    issueDate: "",
    issueName: "",
    approvedDate: "",
    approvedName: "",
    processId: 0,
    type: "",
    inspectionRptNo: "",
    acptRejNoteNo: "",
    acptRejNodeDT: "",
    dateOfDelivery: "",
    ceRegionalCenterCd: "",
    ceRegionalCenterName: "",
    ceAddress: "",
    ceZipcode: "",
    crRegionalCenterCd: "",
    crRegionalCenterName: "",
    crAddress: "",
    crZipcode: "",
    consumerName: "",
    contactNo: "",
    note: "",
    conditionOfGoods: "",
    items: [
      {
        srNo: 0,
        itemCode: "",
        itemDesc: "",
        uom: "",
        quantity: 0,
        noOfDays: 0,
        remarks: "",
        conditionOfGoods: "",
        budgetHeadProcurement: "",
        locatorId: "",
      },
    ],
    userId: "",
    supplierName: "",
    supplierCd: "",
    address: "",
    noaDate: "",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChange = (fieldName, value) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [fieldName]: value === "" ? null : value,
    }));
  };

  const fetchUomLocatorMaster = async () => {
    try {
      const uomMasterUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getUOMMaster";
      const locatorMasterUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getLocatorMaster";
      const uomMaster = await axios.get(uomMasterUrl);
      const { responseData: uomMasterData } = uomMaster.data;
      // const { responseData: locatorMasterData } = locatorMaster.data;
      const uomObject = convertArrayToObject(uomMasterData, "id", "uomName");
      // const locatorObj = convertArrayToObject(locatorMasterData, "id", "locatorDesc")
      setUomMaster({ ...uomObject });
      // setLocatorMaster({...locatorObj})
    } catch (error) {
      console.log("Error fetching Uom master details.", error);
    }
  };

  const itemHandleChange = (fieldName, value, index) => {
    setFormData((prevValues) => {
      const updatedItems = [...(prevValues.items || [])];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value === "" ? null : value,
      };
      return {
        ...prevValues,
        items: updatedItems,
      };
    });
  };

  useEffect(() => {
    // fetchItemData();
    fetchUserDetails();
    fetchUomLocatorMaster();
  }, []);

  const fetchItemData = async () => {
    try {
      const apiUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getItemMaster";
      const response = await axios.get(apiUrl);
      const { responseData } = response.data;
      setItemData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchUserDetails = async () => {
    const userCd = localStorage.getItem('userCd');
    const password = localStorage.getItem('password');

    try {
      const apiUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/login/authenticate";
      const response = await axios.post(apiUrl, {
        userCd: userCd,
        password: password,
      });

      const { responseData } = response.data;
      const { organizationDetails } = responseData;
      const { userDetails, locationDetails } = responseData;
      const currentDate = dayjs();
      // Update form data with fetched values
      setFormData({
        ceRegionalCenterCd: organizationDetails.location,
        ceRegionalCenterName: organizationDetails.organizationName,
        ceAddress: organizationDetails.locationAddr,
        ceZipcode: locationDetails.zipcode,
        genName: userDetails.firstName,
        userId: "string",
        genDate: currentDate.format(dateFormat),
        issueDate: currentDate.format(dateFormat),
        approvedDate: currentDate.format(dateFormat),
        acptRejNodeDT: currentDate.format(dateFormat),
        acptRejNoteNo: "string",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInspectionNOChange = async (value) => {
    try {
      const apiUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/getSubProcessDtls";
      const response = await axios.post(apiUrl, {
        processId: value,
        processStage: "IRN",
      });
      const responseData = response.data.responseData;
      const { processData, itemList } = responseData;
      setFormData((prevFormData) => ({
        ...prevFormData,

        issueName: processData?.issueName,
        approvedName: processData?.approvedName,
        processId: processData?.processId,

        ceRegionalCenterCd: processData?.ceRegionalCenterCd,
        ceRegionalCenterName: processData?.ceRegionalCenterName,
        ceAddress: processData?.ceAddress,
        ceZipcode: processData?.ceZipcode,

        consumerName: processData?.consumerName,
        contactNo: processData?.contactNo,

        supplierCd: processData?.supplierCd,
        supplierName: processData?.supplierName,
        crAddress: processData?.crAddress,

        dateOfDelivery: processData?.dateOfDelivery,

        items: itemList.map((item) => ({
          srNo: item.sNo,
          itemCode: item.itemCode,
          itemDesc: item.itemDesc,
          uom: item?.uom,
          quantity: item.acceptedQuantity,
          noOfDays: item.requiredDays,
          remarks: item.remarks,
          conditionOfGoods: item.conditionOfGoods,
          budgetHeadProcurement: item.budgetHeadProcurement,
          locatorId: item.locatorId,
          acceptedQuantity: item.acceptedQuantity,
        })),
      }));
      // Handle response data as needed
    } catch (error) {
      console.error("Error fetching sub process details:", error);
      // Handle error
    }
  };

  const removeItem = (index) => {
    setFormData((prevValues) => {
      const updatedItems = prevValues.items;
      updatedItems.splice(index, 1);

      const updatedItems1 = updatedItems.map((item, key) => {
        return { ...item, srNo: key + 1 };
      });

      return {
        ...prevValues,
        items: updatedItems1,
      };
    });
  };

  const onFinish = async (values) => {
    try {
      const formDataCopy = { ...formData };

      const allFields = [
        "genDate",
        "genName",
        "issueDate",
        "issueName",
        "approvedDate",
        "approvedName",
        "processId",
        "type",
        "inspectionRptNo",
        "acptRejNoteNo",
        "acptRejNodeDT",
        "dateOfDelivery",
        "ceRegionalCenterCd",
        "ceRegionalCenterName",
        "ceAddress",
        "ceZipcode",
        "crRegionalCenterCd",
        "crRegionalCenterName",
        "crAddress",
        "crZipcode",
        "consumerName",
        "contactNo",
        "note",
        "conditionOfGoods",
        "userId",
        "supplierName",
        "supplierCd",
        "address",
        "noaDate",
      ];

      allFields.forEach((field) => {
        if (!(field in formDataCopy)) {
          formDataCopy[field] = "";
        }
      });

      const apiUrl =
        "https://sai-services.azurewebsites.net/sai-inv-mgmt/saveAcceptanceNote";
      const response = await axios.post(apiUrl, formDataCopy);
      if (
        response.status === 200 &&
        response.data &&
        response.data.responseStatus &&
        response.data.responseStatus.message === "Success"
      ) {
        // Access the specific success message data if available
        const { processId, processType, subProcessId } =
          response.data.responseData;
        setFormData((prev) => {
          return {
            ...prev,
            acptRejNoteNo: processId,
          };
        });
        setSuccessMessage(
          `Acceptance Note : ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
        showModal();
        message.success(
          `Acceptance Note  successfully! Process ID: ${processId}, Process Type: ${processType}, Sub Process ID: ${subProcessId}`
        );
      } else {
        // Display a generic success message if specific data is not available
        message.error("Failed to Acceptance Note . Please try again later.");
      }
    } catch (error) {
      console.error("Error saving Acceptance Note :", error);
      message.error("Failed to Acceptance Note . Please try again later.");

      // Handle error response here
    }
  };

  const handleValuesChange = (_, allValues) => {
    setType(allValues.type);
  };

  return (
    <div className="goods-receive-note-form-container">
      <h1>Sports Authority of India - Acceptance Note</h1>

      <Form
        onFinish={onFinish}
        className="goods-receive-note-form"
        onValuesChange={handleValuesChange}
        layout="vertical"
      >
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="acptRejNodeDT">
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "100%" }}
                name="acptRejNodeDT"
                onChange={(date, dateString) =>
                  handleChange("acptRejNodeDT", dateString)
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TYPE" name="type">
              <Select onChange={(value) => handleChange("type", value)}>
                <Option value="PO"> Purchase Order</Option>
                <Option value="IOP"> Inter-Org Transaction</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={12}>
            <FormInputItem label="ACCEPTANCE NOTE NO." value={formData.acptRejNoteNo === "string" ? "not defined" : formData.acptRejNoteNo} />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Title strong level={2} underline type="danger">
              {" "}
              CONSIGNEE DETAIL :-
            </Title>

            <Form.Item label="REGIONAL CENTER CODE" name="ceRegionalCenterCd">
              <Input value={formData.ceRegionalCenterCd} />
              <div style={{ display: "none" }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item
              label="REGIONAL CENTER NAME "
              name="ceRegionalCenterName"
            >
              <Input value={formData.ceRegionalCenterName} />
              <div style={{ display: "none" }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ADDRESS :" name="ceAddress">
              <Input value={formData.ceAddress} />
              <div style={{ display: "none" }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
            <Form.Item label="ZIP CODE :" name="ceZipcode">
              <Input value={formData.ceZipcode} />
              <div style={{ display: "none" }}>
                {formData.ceRegionalCenterCd}
              </div>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Title strong underline level={2} type="danger">
              CONSIGNOR DETAIL :-
            </Title>

            {Type === "PO" && (
              <>
                <FormInputItem
                  label="SUPPLIER CODE :"
                  value={formData.supplierCd}
                />
                <FormInputItem
                  label="SUPPLIER NAME :"
                  value={formData.supplierName}
                />
                <FormInputItem
                  label="ADDRESS :"
                  value={formData.crAddress || "Not defined"}
                />
              </>
            )}

            {Type === "IOP" && (
              <>
                <Form.Item
                  label="REGIONAL CENTER CODE"
                  name="crRegionalCenterCd"
                >
                  <Input
                    onChange={(e) =>
                      handleChange("crRegionalCenterCd", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="REGIONAL CENTER NAME "
                  name="crRegionalCenterName"
                >
                  <Input
                    onChange={(e) =>
                      handleChange("crRegionalCenterName", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="ADDRESS :" name="crAddress">
                  <Input
                    onChange={(e) => handleChange("crAddress", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="ZIP CODE :" name="crZipcode">
                  <Input
                    onChange={(e) => handleChange("crZipcode", e.target.value)}
                  />
                </Form.Item>
              </>
            )}
          </Col>

          <Col span={8}>
            <Form.Item></Form.Item>
            <Form.Item
              label={
                Type !== "PO" ? "INSPECTION REPORT NO.:" : "INSPECTION NOTE NO."
              }
              name="inspectionreportno"
            >
              <Input
                onChange={(e) => handleInspectionNOChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="NOA NO." name="noaNo">
              <Input onChange={(e) => handleChange("noaNo", e.target.value)} />
            </Form.Item>
            <Form.Item label="NOA DATE" name="noaDate">
              <DatePicker
                format={dateFormat}
                style={{ width: "100%" }}
                onChange={(date, dateString) =>
                  handleChange("noaDate", dateString)
                }
              />
            </Form.Item>
            {/* <Form.Item label="DATE OF DELIVERY" name="dateOfDelivery">
              <DatePicker
                format={dateFormat}
                style={{ width: "100%" }}
                onChange={(date, dateString) =>
                  handleChange("dateOfDelivery", dateString)
                }
              />
            </Form.Item> */}

            <FormInputItem label="DATE OF DELIVERY" value={formData.dateOfDelivery} />
          </Col>
        </Row>

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={formData.items || [{}]}>
          {(fields, { add, remove }) => (
            <>
              {/* <Form.Item style={{ textAlign: "right" }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ marginBottom: 8 }}
                  icon={<PlusOutlined />}
                >
                  ADD ITEM
                </Button>
              </Form.Item> */}
              {formData?.items?.length > 0 &&
                formData.items.map((item, key) => (
                  <div style={{
                    marginBottom: 16,
                    border: "1px solid #d9d9d9",
                    padding: 16,
                    borderRadius: 4,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                  }}>
                    <FormInputItem
                      label="Serial No. :"
                      key={key}
                      value={item.srNo}
                    />
                    <FormInputItem
                      label="Item Code :"
                      key={key}
                      value={item.itemCode}
                    />
                    <FormInputItem
                      label="Item Description :"
                      key={key}
                      value={item.itemDesc}
                    />
                    <FormInputItem
                      label="UOM :"
                      key={key}
                      value={uomMaster[item.uom]}
                    />

                    {Type !== "PO" && (
                      <>
                        <Form.Item label="INSPECTED QUANTITY">
                          <Input
                            value={item.inspectedQuantity}
                            onChange={(e) =>
                              itemHandleChange(
                                "inspectedQuantity",
                                e.target.value,
                                key
                              )
                            }
                          />
                        </Form.Item>
                      </>
                    )}

                    <Form.Item label="ACCEPTED QUANTITY">
                      <Input
                        value={item.acceptedQuantity}
                        onChange={(e) =>
                          itemHandleChange(
                            "acceptedQuantity",
                            e.target.value,
                            key
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item label="REMARK">
                      <Input
                        value={item.remarks}
                        onChange={(e) =>
                          itemHandleChange(
                            "remarks",
                            e.target.value,
                            key
                          )
                        }
                      />
                    </Form.Item>

                    <Col span={1}>
                        <MinusCircleOutlined
                          onClick={() => removeItem(key)}
                          style={{ marginTop: 8 }}
                        />
                      </Col>
                  </div>
                ))}
{/* 
              {fields.map(({ key, name, ...restField }, index) => (
                <div
                  key={key}
                  style={{
                    marginBottom: 16,
                    border: "1px solid #d9d9d9",
                    padding: 16,
                    borderRadius: 4,
                  }}
                >
                  <Row gutter={24}>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        label="S.NO."
                        name={[name, "srNo"]}
                      >
                        <Input
                          value={formData.items?.[index]?.srNo}
                          onChange={(e) =>
                            e.target &&
                            itemHandleChange(`srNo`, e.target.value, index)
                          }
                        />
                        <span style={{ display: "none" }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        label="ITEM CODE"
                        name={[name, "itemCode"]}
                        initialValue={formData.items?.[index]?.itemCode}
                      >
                        <AutoComplete
                          style={{ width: "100%" }}
                          options={itemData.map((item) => ({
                            value: item.itemMasterCd,
                          }))}
                          placeholder="Enter item code"
                          filterOption={(inputValue, option) =>
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                          value={formData.items?.[index]?.itemCode}
                          onChange={(value) =>
                            itemHandleChange(`itemCode`, value, index)
                          }
                        />
                        <span style={{ display: "none" }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        label="ITEM DESCRIPTION"
                        name={[name, "itemDesc"]}
                      >
                        <AutoComplete
                          style={{ width: "100%" }}
                          options={itemData.map((item) => ({
                            value: item.itemMasterDesc,
                          }))}
                          placeholder="Enter item description"
                          filterOption={(inputValue, option) =>
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                          onChange={(value) =>
                            itemHandleChange(`itemDesc`, value, index)
                          }
                          value={formData.items?.[index]?.itemDesc}
                        />
                        <span style={{ display: "none" }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        label="UOM"
                        name={[name, "uom"]}
                      >
                        <AutoComplete
                          style={{ width: "100%" }}
                          options={itemData.map((item) => ({
                            value: item.uom,
                          }))}
                          placeholder="Enter UOM"
                          filterOption={(inputValue, option) =>
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                          onChange={(value) =>
                            itemHandleChange(`uom`, value, index)
                          }
                        />
                      </Form.Item>
                    </Col>
                    {Type !== "PO" && (
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label="INSPECTED QUANTITY "
                          name={[name, "inspectionquantity"]}
                        >
                          <Input
                            value={formData.items?.[index]?.quantity}
                            onChange={(e) =>
                              itemHandleChange(
                                `inspectionquantity`,
                                e.target.value,
                                index
                              )
                            }
                          />
                          <span style={{ display: "none" }}>{index + 1}</span>
                        </Form.Item>
                      </Col>
                    )}
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        label="ACCEPTED QUANTITY"
                        name={[name, "quantity"]}
                      >
                        <Input
                          onChange={(e) =>
                            itemHandleChange(
                              `acceptedQuantity`,
                              e.target.value,
                              index
                            )
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        label="REMARK"
                        name={[name, "remarks"]}
                      >
                        <Input
                          onChange={(e) =>
                            itemHandleChange(`remarks`, e.target.value, index)
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ marginTop: 8 }}
                      />
                    </Col>
                  </Row>
                </div>
              ))} */}
            </>
          )}
        </Form.List>

        {/* Condition of Goods */}
        {Type !== "PO" && (
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="CONDITION OF GOODS" name="conditionOfGoods">
                <Input.TextArea
                  onChange={(e) =>
                    handleChange("conditionOfGoods", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="NOTE" name="note">
                <Input.TextArea
                  onChange={(e) => handleChange("note", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Note and Signature */}

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="goods-receive-note-signature">GENERATED BY</div>
            <div className="goods-receive-note-signature">
              NAME & SIGNATURE :
              <Form>
                <Input
                  value={formData.genName}
                  name="genName"
                  onChange={(e) => handleChange("genName", e.target.value)}
                />
              </Form>
            </div>
            <div className="goods-receive-note-signature">
              DATE & TIME :
              <DatePicker
                defaultValue={dayjs()}
                format={dateFormat}
                style={{ width: "58%" }}
                name="genDate"
                onChange={(date, dateString) =>
                  handleChange("genDate", dateString)
                }
              />
            </div>
          </div>
          {Type !== "PO" && (
            <div>
              <div className="goods-receive-note-signature">APPROVED BY</div>
              <div className="goods-receive-note-signature">
                NAME & SIGNATURE :
                <Form>
                  <Input
                    value={formData.approvedName}
                    name="approvedName"
                    onChange={(e) =>
                      handleChange("approvedName", e.target.value)
                    }
                  />
                </Form>
              </div>
              <div className="goods-receive-note-signature">
                DATE & TIME :
                <DatePicker
                  defaultValue={dayjs()}
                  format={dateFormat}
                  style={{ width: "58%" }}
                  name="approvedDate"
                  onChange={(date, dateString) =>
                    handleChange("approvedDate", dateString)
                  }
                />
              </div>
            </div>
          )}
          {Type !== "PO" && (
            <div>
              <div className="goods-receive-note-signature">RECEIVED BY</div>
              <div className="goods-receive-note-signature">
                NAME & SIGNATURE :
                <Form>
                  <Input
                    name="issueName"
                    onChange={(e) => handleChange("issueName", e.target.value)}
                  />
                </Form>
              </div>
              <div className="goods-receive-note-signature">
                DATE & TIME :
                <DatePicker
                  defaultValue={dayjs()}
                  format={dateFormat}
                  style={{ width: "58%" }}
                  name="issueDate"
                  onChange={(date, dateString) =>
                    handleChange("issueDate", dateString)
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="goods-receive-note-button-container">
          <Form.Item>
            <Button
              type="primary"
              htmlType="save"
              style={{ width: "200px", margin: 16 }}
            >
              SAVE
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
                width: "200px",
                margin: 16,
              }}
            >
              SUBMIT
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              danger
              htmlType="save"
              style={{ width: "200px", margin: 16 }}
            >
              PRINT
            </Button>
          </Form.Item>
        </div>
        <Modal
          title="Acceptance Note saved successfully"
          visible={isModalOpen}
          onOk={handleOk}
        >
          {successMessage && <p>{successMessage}</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </Modal>
      </Form>
    </div>
  );
};

export default AcceptanceNote;
