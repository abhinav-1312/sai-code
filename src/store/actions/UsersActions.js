import { BASE_URL } from "../../utils/BaseUrl";
import axios from "axios"

const token = localStorage.getItem("token");
export const setUsers = (users) => ({
  type: "SET_USERS",
  payload: users,
});

export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/getUserMaster`, {headers: {Authorization : token}});
    const data = await response.json();

    dispatch(setUsers(data.responseData));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateUser = (userId, values) => async (dispatch) => {
  console.log("Update user called: ", userId, values)
  try {
    const updateResponse = await fetch(`https://sai-services.azurewebsites.net/sai-inv-mgmt/updateUserMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization' : token
      },
      body: JSON.stringify({
        userId,
        ...values,
      }),
    })
    if (updateResponse.ok) {
      alert("Users updated successfully");
      dispatch(fetchUsers());
    } else {
      alert("Update Failed");
      console.error("Update failed:", updateResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// export const saveUser = (values) => async (dispatch) => {
//   try {
//     const createResponse = await fetch(`${BASE_URL}/saveUserMaster`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         'Authorization' : token
//       },
//       body: JSON.stringify(values),
//     });

//     if (createResponse.ok) {
//       alert("Users Added Successfully");
//       dispatch(fetchUsers());
//     } else {
//       alert("User Added Failed");
//       console.error("Create failed:", createResponse.statusText);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

export const saveUser = (values) => async (dispatch) => {
  try {
    const createResponse = await fetch(`${BASE_URL}/saveUserMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(values),
    });

    const responseData = await createResponse.json();

    if (responseData && responseData.responseStatus && responseData.responseStatus.statusCode === 200) {
      alert("Users Added Successfully");
      dispatch(fetchUsers());
    } else {
      // Handle error based on response body
      if (responseData && responseData.responseStatus) {
        alert(responseData.responseStatus.message);
      } else {
        alert("User Added Failed");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing your request");
  }
};



export const deleteUser = (userId) => async (dispatch) => {
  try {
    const deleteResponse = await fetch(`${BASE_URL}/deleteUserMaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization' : token
      },
      body: JSON.stringify({
        userId: "string",
        id: userId,
      }),
    });

    if (deleteResponse.ok) {
      alert("Users deleted successfully");
      dispatch(fetchUsers());
    } else {
      alert("failed to delete Users");
      console.error("Delete failed:", deleteResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
