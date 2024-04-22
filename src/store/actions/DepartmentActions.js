// DepartmentActions.js
import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";


const token = localStorage.getItem("token");

export const setDepartments = (departments) => ({
  type: 'SET_DEPARTMENTS',
  payload: departments,
});

export const fetchDepartments = () => async (dispatch) => {
  try {
    const {data} = await axios.get(`/master/getDeptMaster`, apiHeader("GET", token));
    const {responseData} = data;

    dispatch(setDepartments(responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


export const updateDepartment = (departmentId, values) => async (dispatch) => {
  try {
    const {data} = await axios.post("/master/updateDeptMaster", {departmentId, ...values}, apiHeader("POST", token))
    // console.log("UPDATE RESPONSE: ", updateResponse)
    const {responseStatus} = data
    if (responseStatus.statusCode === 200 && responseStatus.message === "Success") {
      alert('Department updated successfully')
      dispatch(fetchDepartments()); 
    } else {
      alert('Update Failed')
      console.error('Update failed:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveDepartment = (values) => async (dispatch) => {
  try {
    const {data} = await axios.post("/master/saveDeptMaster", {...values}, apiHeader("POST", token))
    const {responseStatus} = data
    if (responseStatus.statusCode === 200 && responseStatus.message === "Success") {
      alert('Department added successfully')
      dispatch(fetchDepartments()); 
    } else {
      alert('Update Failed')
      console.error('Deparment addition failed:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const userCd = localStorage.getItem("userCd")

export const deleteDepartment = (departmentId) => async (dispatch) => {
  try {
    const {data} = await axios.post("/master/deleteDeptMaster", {userId: userCd, departmentId}, apiHeader("POST", token))
    const {responseStatus} = data
    if (responseStatus.statusCode === 200 && responseStatus.message === "Success") {
      alert('Department deleted successfully')
      dispatch(fetchDepartments()); 
    } else {
      alert('Deletion Failed')
      console.error('Deparment deletion failed:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
