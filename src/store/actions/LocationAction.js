// LocationActions.js
import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token");

export const setLocations = (locations) => ({
  type: 'SET_LOCATIONS',
  payload: locations,
});

export const fetchLocations = () => async (dispatch) => {
  try {
    const {data} = await axios.get("/master/getLocationMaster", apiHeader("GET", token) );
    const {responseData} = data;

    dispatch(setLocations(responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateLocation = (locationId, values) => async (dispatch) => {
  try {
    const updateResponse = await axios.post("/master/updateLocationMaster", {locationId, ...values}, apiHeader("POST", token)) 

    // if (updateResponse.ok) {
    //   alert('Location updated successfully')
    //   dispatch(fetchLocations()); 
    // } else {
    //   alert('Update Failed')
    //   console.error('Update failed:', updateResponse.statusText);
    // }
  } catch (error) {
    alert('Update Failed')
    console.error('Error:', error);
  }
};

export const saveLocation = (values) => async (dispatch) => {
  try {
    const createResponse = await axios.post(`/master/saveLocationMaster`, {...values}, apiHeader("POST", token))
  } catch (error) {
    alert('Location Added Failed')
    console.error('Error:', error);
  }
};

const userCd = localStorage.getItem("userCd")
export const deleteLocation = (locationId) => async (dispatch) => {
  try {
    const deleteResponse = await axios.post(`/master/deleteLocationMaster`, {userId: userCd, locationId}, apiHeader("POST", token))
  } catch (error) {
    alert('failed to delete Location')
    console.error('Error:', error);
  }
};
