import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token");
export const setOrganizations = (organizations) => ({
  type: 'SET_ORGANIZATIONS',
  payload: organizations,
});

export const fetchOrganizations = () => async (dispatch) => {
  try {
    const {data} = await axios.get(`/master/getOrgMaster`, apiHeader("GET", token));
    dispatch(setOrganizations(data.responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateOrganization = (organizationId, values) => async (dispatch) => {
  try {
    const {data} = await axios.post('/master/updateOrgMaster', {organizationId, ...values}, apiHeader("POST", token))
    alert('Organizations updated successfully')
    dispatch(fetchOrganizations()); 
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveOrganization = (values) => async (dispatch) => {
  try {
    const {data} = await axios.post('/master/saveOrgMaster', values, apiHeader("POST", token))
    alert('Organizations Added Successfully')
    dispatch(fetchOrganizations()); 
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteOrganization = (organizationId) => async (dispatch) => {
  try {
    const userCd = localStorage.getItem("userCd")
    const {data} = await axios.post('/master/deleteOrgMaster', {userId: userCd, id: organizationId})
    alert('Organizations deleted successfully')
    dispatch(fetchOrganizations()); // Refresh the organization list after deletion
  } catch (error) {
    console.error('Error:', error);
  }
};
