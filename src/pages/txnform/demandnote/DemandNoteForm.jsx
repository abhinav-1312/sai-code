// DemandNoteForm.js
import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, Button, Row, Col, DatePicker, AutoComplete, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import moment from 'moment';
const { TextArea } = Input;
const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;

const DemandNoteForm = () => {
  const formRef = useRef(null)
  const [itemData, setItemData] = useState([]);
  const [formData, setFormData] = useState({
    regionalCenterCode: '',
    regionalCenterName: '',
    consignorAddress: '',
    consignorZipCode: ''
  });
  useEffect(() => {
    // Fetch data from API to prefill form fields
    fetchItemData()
    fetchData();
  }, []);


  const printOrSaveAsPDF = () => {
    const formElement = document.getElementById("formContainer")

    if(formElement){
      html2canvas(formElement
      ).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        
        // Check if user wants to print or save
        const printOrSave = window.confirm('Do you want to print the component? If not, the component will be saved as a PDF.');
        
        if (printOrSave) {
          // Print the document if user chooses to print
          window.print();
        } else {
          // Save the PDF with a name
          pdf.save('component.pdf');
        }
      });
    }
  };




  const fetchItemData = async () => {
    try {
      const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/master/getItemMaster';
      const response = await axios.get(apiUrl);
      const { responseData } = response.data;
      setItemData(responseData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/login/authenticate';
      const response = await axios.post(apiUrl, {
        userCd: "dkg",
        password: "string"
      });

      const { responseData } = response.data;
      const { organizationDetails } = responseData;
      const { userDetails } = responseData;
      const {locationDetails} = responseData
      // Update form data with fetched values
      setFormData({
        regionalCenterCode: organizationDetails.id,
        regionalCenterName: organizationDetails.organizationName,
        consignorAddress: organizationDetails.locationAddr,
        consignorZipCode: locationDetails.zipcode,
        // firstName: userDetails.firstName,
        // lastName: userDetails.lastName

      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const onFinish = async (values) => {
    const apiUrl = 'https://sai-services.azurewebsites.net/sai-inv-mgmt/saveDemand';

    try {
      // Transforming form data to match API payload
      const date = values.date ? moment(values.date).format('DD/MM/YYYY') : '';

      const payload = {
        date: date,
        demandNoteNo: values.grnNo,
        regionalCenterCd: values.regionalCenterCodeConsignor,
        regionalCenterName: values.regionalCenterNameConsignor,
        consumerName: values.consumerName,
        contactNo: values.contactNo,
        address: values.consignorAddress,
        zipcode: values.consignorZipCode,
        termsAndConditions: values.termsAndCondition,
        userId: "1", // You may need to replace this with the actual user ID
        processType: "Issue-Return", // You may need to replace this with the actual process type
        items: values.itemDetails.map(item => ({
          srNo: item.sNo,
          itemCode: item.itemCode,
          itemDesc: item.itemDescription,
          uom: item.uom,
          quantity: item.receivedQuantity,
          noOfDays: item.budgetHeadProcurement,
          remarks: item.remark
        }))
      };

      // Making a POST request to the API endpoint using Axios
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Handle successful response here, if needed
    } catch (error) {
      console.error('There was a problem with the API call:', error);
      // Handle error here, if needed
    }
  };

  const printQRCode = () => {
    const doc = new jsPDF();
    const qrCodeImgData = document
      .getElementById('form')
      .toDataURL('image/png');
    doc.addImage(qrCodeImgData, 'PNG', 10, 10, 50, 50); // add the image to the PDF
    doc.output('dataurlnewwindow');
    doc.autoPrint();
  };

  const printForm = () => {
    const formElement = document.querySelector('.goods-receive-note-form');

    if (formElement) {
      html2canvas(formElement)
        .then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          pdf.addImage(imgData, 'PNG', 0, 0);
          pdf.save('form.pdf');
        });
    }

  };

  return (
    <div className="goods-receive-note-form-container" id="formContainer" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <h1>Sports Authority of India - Demand Note</h1>

      <Form ref={formRef} onFinish={onFinish} className="goods-receive-note-form" layout="vertical">
        <Row>
          <Col span={6} offset={18}>
            <Form.Item label="DATE" name="date">
              <DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6} >

          </Col>
          <Col span={6} offset={12}>
            <Form.Item label="DEMAND NOTE NO. :" name="grnNo">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="REGIONAL CENTER CODE" name="regionalCenterCode">
              <Input value={formData.regionalCenterCode} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCode}
              </div>
            </Form.Item>
            <Form.Item label="REGIONAL CENTER NAME " name="regionalCenterNameConsignor">
              <Input value={formData.regionalCenterName} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCode}
              </div>
            </Form.Item>
            <Form.Item label="ADDRESS :" name="consignorAddress">
              <Input value={formData.consignorAddress} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCode}
              </div>

            </Form.Item>
            <Form.Item label="ZIP CODE :" name="consignorZipCode">
              <Input value={formData.consignorZipCode} />
              <div style={{ display: 'none' }}>
                {formData.regionalCenterCode}
              </div>
            </Form.Item>
          </Col>

          <Col span={8}>

          </Col>

          <Col span={8}>
            <Form.Item label="CONSUMER NAME :" name="consumerName">
              <Input />
            </Form.Item>
            <Form.Item label="CONTACT NO. :" name="contactNo">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Item Details */}
        <h2>ITEM DETAILS</h2>

        <Form.List name="itemDetails" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              <Form.Item style={{ textAlign: 'right' }}>
                <Button type="dashed" onClick={() => add()} style={{ marginBottom: 8 }} icon={<PlusOutlined />}>
                  ADD ITEM
                </Button>
              </Form.Item>
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: 16, borderRadius: 4 }}>
                  <Row gutter={24}>
                    <Col span={6}>

                      <Form.Item {...restField} label="S.NO." name={[name, 'sNo']} >
                        <Input value={index + 1} />
                        <span style={{ display: 'none' }}>{index + 1}</span>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="ITEM CODE" name={[name, 'itemCode']}>
                        <AutoComplete
                          style={{ width: '100%' }}
                          options={itemData.map(item => ({ value: item.itemMasterCd }))}
                          placeholder="Enter item code"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="ITEM DESCRIPTION" name={[name, 'itemDescription']}>
                        <AutoComplete
                          style={{ width: '100%' }}
                          options={itemData.map(item => ({ value: item.itemMasterDesc }))}
                          placeholder="Enter item description"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item {...restField} label="UOM" name={[name, 'uom']}>
                        <AutoComplete
                          style={{ width: '100%' }}
                          options={itemData.map(item => ({ value: item.uom }))}
                          placeholder="Enter UOM"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item {...restField} label="REQUIRED QUANTITY" name={[name, 'requiredQuantity']}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} label="REQUIRED FOR NO. OF DAYS" name={[name, 'budgetHeadProcurement']}>
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={5}>
                      <Form.Item {...restField} label="REMARK" name={[name, 'remark']}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: 8 }} />
                    </Col>
                  </Row>
                </div>
              ))}
            </>
          )}
        </Form.List>

        {/* Terms and Condition */}
        <h2>Terms and Condition</h2>
        <Form.Item name="termsAndCondition">
          <TextArea rows={4} />
        </Form.Item>


        {/* Note and Signature */}

        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <div  >
            <div className='goods-receive-note-signature'>
              DEMANDED  BY :
            </div>
            <div className='goods-receive-note-signature'>
              NAME & SIGNATURE :<Form><Input /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} />
            </div>
          </div>
          <div >
            <div className='goods-receive-note-signature'>
              APPROVED BY :
            </div>
            <div className='goods-receive-note-signature'>
              NAME & SIGNATURE :<Form><Input /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '58%' }} />
            </div>


          </div>
          <div >
            <div className='goods-receive-note-signature'>
              RECEIVED BY :
            </div>
            <div className='goods-receive-note-signature'>
              NAME & SIGNATURE :<Form><Input /></Form>
            </div>
            <div className='goods-receive-note-signature'>
              DATE & TIME :<DatePicker defaultValue={dayjs()} format={dateFormat} style={{ width: '58%' }} />
            </div>


          </div>
        </div>


        <div className='goods-receive-note-button-container'>

          {/* <Form.Item >
            <Button type="primary" htmlType="save" style={{ width: '200px', margin: 16 }}>
              SAVE
            </Button>
          </Form.Item> */}

          {/* <Form.Item > */}
            {/* <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', width: '200px', margin: 16 }}>
              SUBMIT
            </Button> */}
          {/* </Form.Item> */}
          <Form.Item>
            <Button type="primary" danger htmlType="save" style={{ width: '200px', margin: 16, alignContent: 'end' }}>
              PRINT
            </Button>
          </Form.Item>

        </div>
      </Form>
    </div>
  );
};

export default DemandNoteForm;
