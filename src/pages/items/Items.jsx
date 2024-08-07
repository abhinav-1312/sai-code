// // ItemsPage.js
// import React, { useState, useEffect } from "react";
// import { Button, Modal, Input } from "antd";
// import ItemsTable from "./ItemsTable";
// import ItemsForm from "./ItemsForm";
// import dayjs from "dayjs";
// import {
//   itemNames,
//   types,
//   allDisciplines,
//   subCategories,
// } from "./KeyValueMapping";
// import { apiHeader, convertArrayToObject, convertEpochToDateString } from "../../utils/Functions";
// import axios from "axios";
// import { useSelector } from "react-redux";



// const ItemsPage = () => {
//   const token = useSelector(state=> state.auth.token)
//   const itemData = useSelector(state => state.item.data)
//   const vendorData = useSelector(state => state.vendors.data)
//   const locationData = useSelector(state => state.locations.data)
//   const locatorData = useSelector(state => state.locators.data)
//   const uomData = useSelector(state => state.uoms.data)
//   const [items, setItems] = useState([]);
//   const [visible, setVisible] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [brands, setBrands] = useState([]);
//   const [selectedId, setSelectedId] = useState(null);
//   const [uoms, setUoms] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [locators, setLocators] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [usageCategories, setUsageCategories] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const apiRequest = async (url, method, requestData) => {
//     const options = {
//       method: method,
//       headers: {
//         "Content-Type": "application/json",
//         'Authorization': `Bearer ${token}`,
//       },
//     };
  
//     if (method === "POST") {
//       options["body"] = JSON.stringify(requestData);
//     }
  
//     try {
//       const response = await fetch(url, options);
//       const data = await response.json();
//       return data.responseData;
//     } catch (error) {
//       console.log("object")
//       console.error("Error: ", error);
//     }
//   };

//   const getUoms = async () => {
//     // const uomResponse = await apiRequest(
//     //   "/master/getUOMMaster",
//     //   "GET"
//     // );

//     setUoms(uomData);
//   };
//   const getBrands = async () => {
//     const brandsResponse = await apiRequest(
//       "/genparam/getAllBrands",
//       "GET"
//     );

//     setBrands(brandsResponse);
//   };
//   const getSizes = async () => {
//     const sizesResponse = await apiRequest(
//       "/genparam/getAllSizes",
//       "GET"
//     );

//     setSizes(sizesResponse);
//   };
//   const getColors = async () => {
//     const colorsResponse = await apiRequest(
//       "/genparam/getAllColors",
//       "GET"
//     );

//     setColors(colorsResponse);
//   };
//   const getUsageCategories = async () => {
//     const usageCategoriesRespone = await apiRequest(
//       "/genparam/getAllUsageCategories",
//       "GET"
//     );

//     setUsageCategories(usageCategoriesRespone);
//   };
//   const getCategories = async () => {
//     const categoriesRespone = await apiRequest(
//       "/genparam/getAllCategories",
//       "GET"
//     );

//     setCategories(categoriesRespone);
//   };

//   const getLocations = async () => {
//     // const locationsResponse = await apiRequest(
//     //   "/master/getLocationMaster",
//     //   "GET"
//     // );
//     setLocations(locationData);
//   };

//   const getLocators = async () => {
//     // const locatorsResponse = await apiRequest(
//     //   "/master/getLocatorMaster",
//     //   "GET"
//     // );
//     setLocators(locatorData);
//   };

//   const getVendors = async () => {
//     // const vendorsResponse = await apiRequest(
//     //   "/master/getVendorMaster",
//     //   "GET"
//     // );
//     setVendors(vendorData);
//   };

  

//   const getItems = async () => {
//     const itemMasterUrl = "/master/getItemMaster"
//     const vendorMasterUrl = "/master/getVendorMaster"
//     try {

//       // const [itemMasterData, vendorMasterData] = await Promise.all([
//       //   axios.get(itemMasterUrl, apiHeader("GET", token)),
//       //   axios.get(vendorMasterUrl, apiHeader("GET", token)),
//       // ]);

//       // const itemData = itemMasterData.data.responseData;
//       // const vendorData = vendorMasterData.data.responseData;

//       const vendorObj = convertArrayToObject(vendorData, "id", "vendorName")
      
//       const itemList = itemData.map(item=>{
//         return{
//           key: item.id,
//             id: item.id,
//             itemCode: item.itemMasterCd,
//             itemDescription: item.itemMasterDesc,
//             uom: item.uomDtls.uomName,
//             price: item.price,
//             vendorDetail: vendorObj[parseInt(item.vendorId)],
//             category: item.categoryDesc,
//             subcategory: item.subCategoryDesc,
//             type: item.typeDesc,
//             disciplines: item.disciplinesDesc,
//             brand: item.brandDesc,
//             colour: item.colorDesc,
//             size: item.sizeDesc,
//             usageCategory: item.usageCategoryDesc,
//             reOrderPoint: item.reOrderPoint ? item.reOrderPoint : "null",
//             minStockLevel: item.minStockLevel,
//             maxStockLevel: item.maxStockLevel,
//             status: item.status === "A" ? "Active" : "InActive",
//             // endDate: new Date(item.endDate).toISOString().split("T")[0],
//             endDate: convertEpochToDateString(item.endDate)
//         }
//       })


//       setItems(itemList);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };  

//   const init = () => {
//     // getItems()
//     // getUoms()
//     getBrands()
//     getSizes()
//     getColors()
//     getUsageCategories()
//     getCategories()
//     // getLocations()
//     // getLocators()
//     // getVendors()
//   }

//   useEffect(() => {
//     console.log("Use effect called")
//     init()
//   }, []);

//   const getItem = async (id) => {
//     const itemResponse = await apiRequest(
//       "/master/getItemMasterById",
//       "POST",
//       {
//         id: id,
//         userId: userCd,
//       }
//     );
//     return itemResponse;
//   };

//   const handleEdit = async ({ id }) => {
//     setSelectedId(id);
//     const item = await getItem(id);
//     const dateObject = new Date(item.endDate);
//     const year = dateObject.getFullYear();
//     const month = dateObject.getMonth(); // Months are zero-based, so add 1
//     const date = dateObject.getDate();
//     const tempItem = {
//       ...item,
//       endDate: dayjs(new Date(year, month, date)),
//       reOrderPoint: 1,
//     };
//     setEditingItem(tempItem);
//     setVisible(true);
//   };

//   const {userCd} = useSelector(state => state.auth)
//   const handleDelete = async (itemId) => {
//     // Implement delete logic here
//     await apiRequest(
//       "/master/deleteItemMaster",
//       "POST",
//       {
//         id: itemId,
//         userId: userCd,
//       }
//     );
//     getItems();
//   };


//   const handleFormSubmit = async (values) => {
//     setEditingItem(null);
//     const tempItem = {
//       ...values,

//       uomId: Number(values.uomId),
//       createUserId: userCd,
//       endDate: values.endDate.format("DD/MM/YYYY"),
//     };

//     if (!tempItem.itemMasterCd) {
//       delete tempItem.itemMasterCd;
//     }

//     if (editingItem) {
//       if (selectedId) {
//         tempItem["itemMasterId"] = selectedId;
//       }

//       const data = await apiRequest(
//         "/master/updateItemMaster",
//         "POST",
//         tempItem
//       );
//     } else {
//       // Implement create logic here
//       const data = await apiRequest(
//         "/master/saveItemMaster",
//         "POST",
//         tempItem
//       );
//     }
//     getItems();
//     setVisible(false);
//   };

//   return (
//     <div>
//       <div
//         style={{
//           marginBottom: "16px",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <Input
//           placeholder="Search items"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{ width: "200px" }}
//         />
//         <Button
//           type="primary"
//           className="saitheme-btn"
//           onClick={() => setVisible(true)}
//         >
//           Add Item
//         </Button>
//       </div>
//       <ItemsTable
//         // items={items.filter((item) =>
//         //   item.itemDescription.toLowerCase().includes(searchText.toLowerCase()) ||
//         //   item.itemCode.toLowerCase().includes(searchText.toLowerCase())
//         // )}
//         items={items?.filter((item) =>
//           Object.values(item).some(
//             (value) =>
//               typeof value === "string" &&
//               value.toLowerCase().includes(searchText.toLowerCase())
//           )
//         )}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />

//       <Modal
//         title={editingItem ? "Edit Item" : "Add Item"}
//         visible={visible}
//         onCancel={() => {
//           setEditingItem(null);
//           setVisible(false);
//         }}
//         footer={null}
//       >
//         <ItemsForm
//           key={editingItem ? `edit-${editingItem.id}` : "add"}
//           onSubmit={handleFormSubmit}
//           initialValues={editingItem}
//           uoms={uoms}
//           locations={locations}
//           locators={locators}
//           vendors={vendors}
//           brands={brands}
//           colors={colors}
//           itemNames={itemNames}
//           types={types}
//           subCategories={subCategories}
//           categories={categories}
//           usageCategories={usageCategories}
//           sizes={sizes}
//           disciplines={allDisciplines}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default ItemsPage;





// ItemsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Input } from "antd";
import ItemsTable from "./ItemsTable";
import ItemsForm from "./ItemsForm";
import dayjs from "dayjs";
import {
  itemNames,
  types,
  allDisciplines,
  subCategories,
} from "./KeyValueMapping";
import { apiCall, convertEpochToDateString } from "../../utils/Functions";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemData } from "../../redux/slice/itemSlice";



const ItemsPage = () => {
  const dispatch = useDispatch()

  const {token} = useSelector(state=> state.auth)
  const {data: itemData} = useSelector(state => state.item)
  const {data: vendorData} = useSelector(state => state.vendors)
  const {data: locationData} = useSelector(state => state.locations)
  const {data: locatorData} = useSelector(state => state.locators)
  const {data: uomData} = useSelector(state => state.uoms)
  const {vendorObj} = useSelector(state => state.vendors)

  const itemList = itemData?.map(item=>{
    return{
      key: item.id,
        id: item.id,
        itemCode: item.itemMasterCd,
        itemDescription: item.itemMasterDesc,
        uom: item.uomDtls.uomName,
        price: item.price,
        vendorDetail: vendorObj[parseInt(item.vendorId)],
        category: item.categoryDesc,
        subcategory: item.subCategoryDesc,
        type: item.typeDesc,
        disciplines: item.disciplinesDesc,
        brand: item.brandDesc,
        colour: item.colorDesc,
        size: item.sizeDesc,
        usageCategory: item.usageCategoryDesc,
        reOrderPoint: item.reOrderPoint ? item.reOrderPoint : "null",
        minStockLevel: item.minStockLevel,
        maxStockLevel: item.maxStockLevel,
        status: item.status === "A" ? "Active" : "InActive",
        endDate: convertEpochToDateString(item.endDate)
    }
  })

  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [usageCategories, setUsageCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const getBrands = useCallback(async () => {
    const brandsResponse = await apiCall(
      "GET",
      "/genparam/getAllBrands",
      token
    );

    setBrands(brandsResponse?.responseData || []);
  }, [token]);

  const getSizes = useCallback(async () => {
    const sizesResponse = await apiCall(
      "GET",
      "/genparam/getAllSizes",
      token
    );

    setSizes(sizesResponse?.responseData || []);
  }, [token]);

  const getColors = useCallback(async () => {
    const colorsResponse = await apiCall(
      "GET",
      "/genparam/getAllColors",
      token
    );

    setColors(colorsResponse?.responseData || []);
  }, [token]);


  const getUsageCategories = useCallback(async () => {
    const usageCategoriesRespone = await apiCall(
      "GET",
      "/genparam/getAllUsageCategories",
      token
    );

    setUsageCategories(usageCategoriesRespone?.responseData || []);
  }, [token]);

  const getCategories = useCallback(async () => {
    const categoriesRespone = await apiCall(
      "GET",
      "/genparam/getAllCategories",
      token
    );

    setCategories(categoriesRespone?.responseData || []);
  }, [token]);


  useEffect(() => {
    getBrands()
    getSizes()
    getColors()
    getUsageCategories()
    getCategories()
  }, [getBrands, getSizes, getColors, getUsageCategories, getCategories]);


  const getItem = async (id) => {
    const itemResponse = await apiCall(
      "POST",
      "/master/getItemMasterById",
      token,
      {
        id: id,
        userId: userCd,
      }
    );
    return itemResponse;
  };

  const handleEdit = async ({ id }) => {
    setSelectedId(id);
    const item = await getItem(id);
    const dateObject = new Date(item.endDate);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth(); // Months are zero-based, so add 1
    const date = dateObject.getDate();
    const tempItem = {
      ...item,
      endDate: dayjs(new Date(year, month, date)),
      reOrderPoint: 1,
    };
    setEditingItem(tempItem);
    setVisible(true);
  };

  const {userCd} = useSelector(state => state.auth)
  const handleDelete = async (itemId) => {
    // Implement delete logic here
    await apiCall(
      "POST",
      "/master/deleteItemMaster",
      token,
      {
        id: itemId,
        userId: userCd,
      }
    );
    dispatch(fetchItemData())
  };


  const handleFormSubmit = async (values) => {
    setEditingItem(null);
    const tempItem = {
      ...values,

      uomId: Number(values.uomId),
      createUserId: userCd,
      endDate: values.endDate.format("DD/MM/YYYY"),
    };

    if (!tempItem.itemMasterCd) {
      delete tempItem.itemMasterCd;
    }

    if (editingItem) {
      if (selectedId) {
        tempItem["itemMasterId"] = selectedId;
      }

      await apiCall(
        "POST",
        "/master/updateItemMaster",
        token,
        tempItem
      );
    } else {
      // Implement create logic here
      await apiCall(
        "POST",
        "/master/saveItemMaster",
        token,
        tempItem
      );
    }

    dispatch(fetchItemData())
    setVisible(false);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search items"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          className="saitheme-btn"
          onClick={() => setVisible(true)}
        >
          Add Item
        </Button>
      </div>
      <ItemsTable
    
        items={itemList?.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchText.toLowerCase())
          )
        )}

        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingItem ? "Edit Item" : "Add Item"}
        visible={visible}
        onCancel={() => {
          setEditingItem(null);
          setVisible(false);
        }}
        footer={null}
      >
        <ItemsForm
          key={editingItem ? `edit-${editingItem.id}` : "add"}
          onSubmit={handleFormSubmit}
          initialValues={editingItem}
          uoms={uomData}
          locations={locationData}
          locators={locatorData}
          vendors={vendorData}
          brands={brands}
          colors={colors}
          itemNames={itemNames}
          types={types}
          subCategories={subCategories}
          categories={categories}
          usageCategories={usageCategories}
          sizes={sizes}
          disciplines={allDisciplines}
        />
      </Modal>
    </div>
  );
};

export default ItemsPage;
