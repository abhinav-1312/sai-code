import React from 'react'
import {Form, Input} from "antd"

const FormInputItem = ({label, name, value, onChange, readOnly, disabled, className, placeholder, rules }) => {
  const handleChange = (e) => {
    if(onChange)
      onChange(name, e.target.value)
  }
  return (
    <Form.Item label={label} className="font-medium"
      rules = {rules}
    >
      <Input value={value} onChange={handleChange} readOnly={readOnly} disabled={disabled} placeholder={placeholder} className='font-medium banner'/>
    </Form.Item>
  )
}

export default FormInputItem
