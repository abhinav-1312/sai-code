import { message } from "antd";
import {apiHeader} from "../../utils/Functions"
import axios from "axios"

export const setUsers = (users) => ({
  type: "SET_USERS",
  payload: users,
});

const token = localStorage.getItem("token");
export const fetchUsers = () => async (dispatch) => {
  try {
    const {data} = await axios.get("/master/getUserMaster", apiHeader("GET", token));
    const {responseData} = data

    dispatch(setUsers(responseData));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateUser = (userId, values) => async (dispatch) => {
  try {
    const updateResponse = await axios.post("/master/updateUserMaster", {userId, ...values}, apiHeader("POST", token))
    alert("Users updated successfully");
    dispatch(fetchUsers());
  } catch (error) {
    alert("Update Failed");
    console.error("Error:", error);
  }
};

// export const saveUser = (values) => async (dispatch) => {
//   try {
//     const createResponse = await fetch(`/saveUserMaster`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         'Authorization' : token
//       },
//       body: JSON.stringify(values),
//     });

//     if (createResponse.ok) {
//       message.error("Users Added Successfully");
//       dispatch(fetchUsers());
//     } else {
//       message.error("User Added Failed");
//       console.error("Create failed:", createResponse.statusText);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

export const saveUser = (values) => async (dispatch) => {
  try {
    const {data} = await axios.post("/master/saveUserMaster", {...values}, apiHeader("POST", token))

    const {responseData} = data;

    if (responseData && responseData.responseStatus && responseData.responseStatus.statusCode === 200) {
      message.error("Users Added Successfully");
      dispatch(fetchUsers());
    } else {
      // Handle error based on response body
      if (responseData && responseData.responseStatus) {
        message.error(responseData.responseStatus.message);
      } else {
        message.error("User Added Failed");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    message.error("An error occurred while processing your request");
  }
};


const userCd = localStorage.getItem("userCd")
export const deleteUser = (userId) => async (dispatch) => {
  try {
    const deleteResponse = await axios.post("/master/deleteUserMaster", {userId: userCd, id: userId}, apiHeader("POST", token))
    alert("Users deleted successfully");
    dispatch(fetchUsers());
  } catch (error) {
    alert("failed to delete Users");
    console.error("Error:", error);
  }
};
