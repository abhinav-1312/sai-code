import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { apiCall } from '../../utils/Functions';

const vendorSlice = createSlice({
    name: "vendors",
    initialState: {
        data: null
    },
    reducers: {
        clearVendor(state, action){
            state.data = null
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchVendors.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchVendors.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
          })
          .addCase(fetchVendors.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
})


export const fetchVendors = createAsyncThunk(
    'vendors/fetchVendors',
    async (_, {getState}) => {
        try{
            const {token} = getState().auth
            const {responseData} = await apiCall("GET", `/master/getVendorMaster`, token)
            return responseData
        }
        catch(error){
            console.log("Error occured while fetching vendor details.", error)
            alert("Error occured while fetching vendor details.")
        }
    }
)

export const updateVendor = createAsyncThunk(
    'vendors/updateVendor',
    async ({vendorId, values}, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/updateVendorMaster`, token, {vendorId, ...values})
            
        }
        catch(error){
            console.log("Error occured while updating vendor.", error)
            alert("Error occured while updating vendor.")
        }
    }
)
export const saveVendor = createAsyncThunk(
    'vendors/saveVendor',
    async (values, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/saveVendorMaster`, token, {...values})
            
        }
        catch(error){
            console.log("Error occured while adding vendor.", error)
            alert("Error occured while adding vendor.")
        }
    }
)
export const deleteVendor = createAsyncThunk(
    'vendors/deleteVendor',
    async (formData, {getState}) => {
        try{
            const {token} = getState().auth
            await apiCall("POST", `/master/deleteVendorMaster`, token, {...formData})
            
        }
        catch(error){
            console.log("Error occured while deleting UOM.", error)
            alert("Error occured while deleting UOM.")
        }
    }
)

export const { clearVendor } = vendorSlice.actions;
export default vendorSlice.reducer