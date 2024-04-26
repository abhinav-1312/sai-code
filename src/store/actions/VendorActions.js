import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token");

export const setVendors = (vendors) => ({
  type: 'SET_VENDORS',
  payload: vendors,
});

export const fetchVendors = () => async (dispatch) => {
  try {
    const {data} = await axios.get('/master/getVendorMaster', apiHeader("GET", token))
    dispatch(setVendors(data.responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateVendor = (vendorId, values) => async (dispatch) => {
  try {
    const {data} = await axios.post('/master/updateVendorMaster', {vendorId, ...values}, apiHeader("POST", token))
    alert('Vendors updated successfully')
    dispatch(fetchVendors()); 
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveVendor = (values) => async (dispatch) => {
  try {
    const {data} = await axios.post('/master/saveVendorMaster', values, apiHeader("POST", token))
    alert('Vendors Added Successfully')
    dispatch(fetchVendors());
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteVendor = (vendorId) => async (dispatch) => {
  const userCd = localStorage.getItem("userCd")
  try {
    const {data} = await axios.post("/master/deleteVendorMaster", {userId: userCd, id: vendorId}, apiHeader("POST", token))
    alert('Vendors deleted successfully')
    dispatch(fetchVendors()); 
  } catch (error) {
    console.error('Error:', error);
  }
};
