import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '../../utils/BaseUrl';
import { apiCall } from '../../utils/Functions';

const uomSlice = createSlice({
    name: "uoms",
    initialState: {
        data: null
    },
    reducers: {

    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchUoms.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchUoms.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
          })
          .addCase(fetchUoms.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})


export const fetchUoms = createAsyncThunk(
    'uoms/fetchUoms',
    async (_, {getState}) => {
        try{
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `${BASE_URL}/master/getUOMMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching UOM details.", error)
            alert("Error occured while fetching UOM details.")
        }
    }
)

export const updateUom = createAsyncThunk(
    'uoms/updateUom',
    async ({uomId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/updateUOMMaster`, token, {uomId, ...values})
            
        }
        catch(error){
            console.log("Error occured while updating UOM.", error)
            alert("Error occured while updating UOM.")
        }
    }
)
export const saveUom = createAsyncThunk(
    'uoms/saveUom',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/saveUOMMaster`, token, {...values})
            
        }
        catch(error){
            console.log("Error occured while adding UOM.", error)
            alert("Error occured while adding UOM.")
        }
    }
)
export const deleteUom = createAsyncThunk(
    'uoms/deleteUom',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `${BASE_URL}/master/deleteUOMMaster`, token, {...formData})
            
        }
        catch(error){
            console.log("Error occured while deleting UOM.", error)
            alert("Error occured while deleting UOM.")
        }
    }
)

export default uomSlice.reducer