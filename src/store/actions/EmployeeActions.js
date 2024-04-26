import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token")

export const setEmployees = (employees) => ({
  type: 'SET_EMPLOYEES',
  payload: employees,
});

export const fetchEmployees = () => async (dispatch) => {
  try {
    const {data} = await axios.get("/master/getEmpMaster", apiHeader("GET", token));
    const {responseData} = data
    dispatch(setEmployees(responseData));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateEmployee = (employeeId, values) => async (dispatch) => {
  try {
    const {data} = await axios.post("/master/updateEmpMaster", {...values, employeeId}, apiHeader("POST", token))
    const {responseStatus} = data
    if (responseStatus.statusCode === 200 && responseStatus.message === "Success") {
      alert('Employee updated successfully')
      dispatch(fetchEmployees()); 
    } else {
      alert('Update Failed')
      console.error('Update failed:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveEmployee = (values) => async (dispatch) => {
  try {
    const {data} = await axios.post("/master/saveEmpMaster", {...values}, apiHeader("POST", token))

    const {responseStatus} = data
    if (responseStatus.statusCode === 200 && responseStatus.message === "Success") {
      alert("Employee Added successfully")
      dispatch(fetchEmployees()); 
    } else {
      alert("something went wrong")
      console.error('Create failed:', data);
    }
  } catch (error) {
    alert("something went wrong. Please try again.")
    console.error('Error:', error);
  }
};

const userCd = localStorage.getItem("userCd")

export const deleteEmployee = (employeeId) => async (dispatch) => {
  try {
    const {data} = await axios.post("/master/deleteEmpMaster", {usrId: userCd, employeeId},  apiHeader("POST", token))

    const {responseStatus} = data
    if (responseStatus.statusCode === 200 && responseStatus.message === "Success") {
      alert("Employee deleted successfully")
      dispatch(fetchEmployees());
    } else {
      alert("Failed to delete employee")
      console.error('Delete failed:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
