import React from "react";
import FormInputItem from "./FormInputItem";
import FormDatePickerItem from "./FormDatePickerItem";

const DesignationContainer = ({
  formType,
  genByVisible,
  genDateValue,
  handleChange,
  issueVisible,
  issueDateValue,
  approvedVisible,
  approvedDateValue,
  processType,
  readOnly

}) => 
  {
  return (
    <div className="designations-container">
      {genByVisible && (
        <div className="each-desg">
          <h4> Generated By </h4>
          <FormInputItem
            placeholder="Name and Designation"
            name="genName"
            readOnly
          />
          <FormDatePickerItem
            name="genDate"
            onChange={handleChange}
            defaultValue={genDateValue}
            readOnly={readOnly}
          />
        </div>
      )}

      {approvedVisible && (
        <div className="each-desg">
          <h4>

            {
              formType === "RN" ? "Returned / Submitted By" : "Approved By"
            }
          </h4>
          <FormInputItem
            placeholder="Name and Signature"
            name="approvedName"
            onChange={handleChange}
            readOnly={readOnly}
          />

          <FormDatePickerItem
            defaultValue={approvedDateValue}
            name="approvedDate"
            onChange={handleChange}
            readOnly={readOnly}
          />
        </div>
      )}

      {issueVisible && (
        <div className="each-desg">
          <h4>
            {processType === "IRP" ||
            processType === "NIRP" ||
            processType === "IOP"
              ? "Received By"
              : "Verified By"}{" "}
          </h4>
          <FormInputItem
            placeholder="Name and Signature"
            name="issueName"
            onChange={handleChange}
            readOnly={readOnly}
          />

          <FormDatePickerItem
            name="issueDate"
            onChange={handleChange}
            defaultValue={issueDateValue}
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );
};

export default DesignationContainer;
