// LocatorActions.js
import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";
const token = localStorage.getItem("token");

export const setLocators = (locators) => ({
  type: 'SET_LOCATORS',
  payload: locators,
});

export const fetchLocators = () => async (dispatch) => {
  try {
    const {data} = await axios.get(`/master/getLocatorMaster`, apiHeader("GET", token));
    const {responseData} = data

    dispatch(setLocators(responseData));
  } catch (error) {
    console.error('Error fetching locator data:', error);
  }
};

export const updateLocator = (locatorId, values) => async (dispatch) => {
  try {
    const {data} = await axios.post('/master/updateLocatorMaster', {...values, locatorMasterId: locatorId}, apiHeader("POST", token))
    alert('Locator updated successfully')
    dispatch(fetchLocators());
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveLocator = (values) => async (dispatch) => {
  try {
    const {data} = await axios.post('/master/saveLocatorMaster', values, apiHeader("POST", token))
    alert('Locator Added Successfully')
    dispatch(fetchLocators()); 
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteLocator = (locatorId) => async (dispatch) => {
  const userCd = localStorage.getItem("userCd")
  try {
    const {data} = await axios.post('/master/deleteLocatorMaster', {userId: userCd, id: locatorId})
    alert('Locator deleted successfully')
      dispatch(fetchLocators()); 
  } catch (error) {
    console.error('Error:', error);
  }
};
