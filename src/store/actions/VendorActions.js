import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token");

export const setVendors = (vendors) => ({
  type: 'SET_VENDORS',
  payload: vendors,
});

export const fetchVendors = () => async (dispatch) => {
  try {
    const response = await fetch(`/getVendorMaster`, apiHeader("GET", token));
    const data = await response.json();

    dispatch(setVendors(data.responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateVendor = (vendorId, values) => async (dispatch) => {
  try {
    const updateResponse = await fetch(`/updateVendorMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        vendorId,
        ...values,
      }),
    });

    if (updateResponse.ok) {
      alert('Vendors updated successfully')
      dispatch(fetchVendors()); 
    } else {
      alert('Update Failed')
      console.error('Update failed:', updateResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveVendor = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`/saveVendorMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });

    if (createResponse.ok) {
      alert('Vendors Added Successfully')
      dispatch(fetchVendors());
    } else {
      alert('Vendors Added Failed')
      console.error('Create failed:', createResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteVendor = (vendorId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`/deleteVendorMaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: 'string',
        id: vendorId,
      }),
    });

    if (deleteResponse.ok) {
      alert('Vendors deleted successfully')
      dispatch(fetchVendors()); 
    } else {
      alert('failed to delete Vendors')
      console.error('Delete failed:', deleteResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
