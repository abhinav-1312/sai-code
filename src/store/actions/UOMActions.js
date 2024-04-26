import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";
import { apiHeader } from "../../utils/Functions";

const token = localStorage.getItem("token")

export const setUOM = (UOMs) => ({
  type: "SET_UOM",
  payload: UOMs,
});

export const fetchUOM = () => async (dispatch) => {
  try {
    const {data} = await axios.get(`/master/getUOMMaster`, apiHeader("GET", token));
    const {responseData} = data;

    dispatch(setUOM(responseData));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateUOM = (uomId, values) => async (dispatch) => {
  try {
    const {data} = await axios.post('/master/updateUOMMaster', {uomId, ...values}, apiHeader("POST", token))
    alert("UOM updated successfully");
    dispatch(fetchUOM());
  } catch (error) {
    console.error("Error:", error);
  }
};

export const saveUOM = (values) => async (dispatch) => {
  try {
    const {data} = await axios.post('/master/saveUOMMaster', values, apiHeader("POST", token))
    alert("UOM Added Successfully");
      dispatch(fetchUOM());
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteUOM = (uomId) => async (dispatch) => {
  const userCd = localStorage.getItem("userCd")
  try {
    const {data} = await axios.post('/master/deleteUOMMaster', {userId: userCd, id: uomId})
    alert("UOM deleted successfully");
    dispatch(fetchUOM());
  } catch (error) {
    console.error("Error:", error);
  }
};
