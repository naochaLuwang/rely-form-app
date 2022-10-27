import React, { useState, useEffect, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaFileExport } from "react-icons/fa";
import { FcRefresh } from "react-icons/fc";
import { SearchIcon } from "@heroicons/react/outline";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import { ImSwitch } from "react-icons/im";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import Link from "next/link";
import { ImStatsBars } from "react-icons/im";
import dbConnect from "../utils/db";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import FormHeader from "../components/FormHeader";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const FormTemplate = ({ form }) => {
  const [tableData, setTableData] = useState(form);
  const [gridApi, setGridApi] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [formName, setFormName] = useState("");
  const [formId, setFormId] = useState("");
  const [record, setRecord] = useState(0);

  const gridRef = useRef();

  const today = new Date();
  const date = today.setDate(today.getDate());
  const defaultValue = new Date(date)?.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(defaultValue);

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const fileName = "Form Feedback";

  const exportToExcel = async (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const dateFilterParams = {
    // provide comparator function
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      var dateAsString = moment(cellValue).format("YYYY-MM-DD");

      if (dateAsString == null) {
        return 0;
      }

      // In the example application, dates are stored as dd/mm/yyyy
      // We create a Date object for comparison against the filter date

      console.log(dateAsString);
      var dateParts = dateAsString?.split("-");
      var day = Number(dateParts[2]);
      var month = Number(dateParts[1]) - 1;
      var year = Number(dateParts[0]);
      var cellDate = new Date(year, month, day);

      // Now that both parameters are Date objects, we can compare
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      } else if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
  };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const getFormTemplates = async () => {
    const response = await axios.get("/api/form");
    const data = response.data;
    setTableData(data);
  };

  const onFilterTextChange = (e) => {
    gridApi.api.setQuickFilter(e.target.value);
    const count = gridApi.api.getDisplayedRowCount();
    setRecord(count);
  };

  const onSelectStatusChange = (e) => {
    gridApi.api.setQuickFilter(e.target.value);
    const count = gridApi.api.getDisplayedRowCount();
    setRecord(count);
  };

  const getFilterType = () => {
    if (startDate !== "" && endDate !== "") return "inRange";
    else if (startDate !== "") return "greaterThan";
    else if (endDate !== "") return "lessThan";
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.api.setQuickFilter("true");
      const count = gridApi.api.getDisplayedRowCount();
      setRecord(count);
    }
  }, [gridApi]);
  useEffect(() => {
    if (gridApi) {
      var dateFilterComponent = gridApi.api.getFilterInstance("createdAt");
      dateFilterComponent.setModel({
        type: getFilterType(),
        dateFrom: startDate,
        dateTo: endDate,
      });

      gridApi.api.onFilterChanged();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleRefresh = () => {
    getFormTemplates();
  };

  const onExportClick = () => {
    gridApi.api.exportDataAsCsv();
  };

  const defaultColDef = useMemo(
    () => ({
      headerClass: function (params) {
        return "header-one";
      },
      editable: false,
      flex: 1,
      resizable: true,
    }),
    []
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const disableForm = async () => {
    console.log("id" + formId);

    await axios.put(`/api/form/${formId}`, {
      status: false,
    });
    getFormTemplates();
    handleClose2();
  };

  const enableForm = async () => {
    await axios.put(`/api/form/${formId}`, {
      status: true,
    });
    getFormTemplates();
    handleClose2();
  };

  const handleDelete = async () => {
    console.log(formId);
    await axios.put(`/api/form/${formId}`, {
      status: false,
      isDeleted: true,
    });
    getFormTemplates();
    handleClose();
  };

  //* Grid Columns
  const columnDefs = [
    {
      headerName: "Sl No.",
      valueGetter: "node.rowIndex + 1",
      cellClass: "text-xs tracking-wide font-medium ",
      flex: 0.7,
    },
    {
      headerName: "Form Name",
      field: "formName",
      flex: 2,
      cellClass: "text-xs font-medium text-grey-500",
    },
    {
      headerName: "Date",
      field: "createdAt",
      cellClass: "text-xs text-grey-500 tracking-wide font-medium  ",
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,

      cellRenderer: (data) => {
        return moment(data.data.createdAt).format("DD/MM/YYYY ");
      },
      flex: 1.2,
    },
    {
      headerName: "Time",
      field: "createdAt",
      cellClass: "text-xs text-grey-500 tracking-wide font-medium ",

      cellRenderer: (data) => {
        return moment(data.data.createdAt).format("hh:mm A ");
      },
      flex: 1,
    },
    {
      headerName: "Form Type",
      field: "formType",
      cellClass: "text-xs text-grey-500 tracking-wider ml-5 font-medium",
      flex: 1,
    },
    {
      headerName: "Created By",
      field: "createdBy",
      cellClass: "text-xs text-grey-500 tracking-wider  font-medium",
      flex: 1.5,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (data) => {
        return (
          <div className="flex justify-between items-center w-24">
            <div>
              {data.data.status ? (
                <h1 className="text-white text-xs  bg-green-500 px-5 py-1.5 rounded-full font-medium">
                  Active
                </h1>
              ) : (
                <h1 className=" text-white rounded-full text-xs px-4 py-1.5 bg-gray-500  font-medium">
                  Inactive
                </h1>
              )}
            </div>

            <div>
              <Tooltip
                title={`${data.data.status ? "Deactivate" : "Activate"}`}
              >
                <IconButton
                  className="bg-gray-200 h-8 w-8 hover:bg-gray-300"
                  //
                  onClick={() => {
                    handleClickOpen2();
                    console.log(data.value);
                    setFormId(data.data.formId);
                    setFormName(data.data.formName);
                    setFormStatus(data.data.status);
                  }}
                >
                  <ImSwitch
                    className={`${
                      data.data.status ? "text-green-500" : "text-grey-500"
                    }`}
                  />
                </IconButton>
              </Tooltip>

              <Dialog
                open={open2}
                onClose={handleClose2}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Change Form Status
                </DialogTitle>
                <DialogContent>
                  <DialogContentText
                    id="alert-dialog-description"
                    className="w-96"
                  >
                    {formStatus ? (
                      <span className="w-96">Disable {formName}</span>
                    ) : (
                      <span className="w-96">Enable {formName}</span>
                    )}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <p
                    onClick={handleClose2}
                    className="inline-flex items-center cursor-pointer justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    data-rounded="rounded-md"
                    data-primary="blue-600"
                    data-primary-reset="{}"
                  >
                    Cancel
                  </p>

                  {formStatus ? (
                    <p
                      onClick={disableForm}
                      className="inline-flex items-center cursor-pointer justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-red-600 border border-blue-700 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      data-rounded="rounded-md"
                      data-primary="blue-600"
                      data-primary-reset="{}"
                    >
                      Disable
                    </p>
                  ) : (
                    <p
                      onClick={enableForm}
                      className="inline-flex items-center cursor-pointer justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-green-600 border border-blue-700 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      data-rounded="rounded-md"
                      data-primary="blue-600"
                      data-primary-reset="{}"
                    >
                      Enable
                    </p>
                  )}
                </DialogActions>
              </Dialog>
            </div>
          </div>
        );
      },
    },
    // {
    //   headerName: "Actions",
    //   field: "formId",
    //   cellRenderer: (data) => {
    //     console.log(data.value);
    //     return (
    //       <>
    //         <div className="  flex items-center justify-center">
    //           <div>
    //             <Tooltip title="Edit" className="bg-blue">
    //               <IconButton className="bg-gray-200  h-8 w-8 hover:bg-gray-300">
    //                 <FiEdit className="text-blue-500" />
    //               </IconButton>
    //             </Tooltip>
    //           </div>
    //           <div>
    //             <Tooltip title="Delete">
    //               <IconButton
    //                 className="bg-gray-200 h-8 w-8 hover:bg-gray-300"
    //                 //
    //                 onClick={() => {
    //                   handleClickOpen();
    //                   console.log(data.value);
    //                   setFormId(data.value);
    //                   setFormName(data.data.formName);
    //                 }}
    //               >
    //                 <DeleteIcon className="text-red-500" />
    //               </IconButton>
    //             </Tooltip>

    //             <Dialog
    //               open={open}
    //               onClose={handleClose}
    //               aria-labelledby="alert-dialog-title"
    //               aria-describedby="alert-dialog-description"
    //             >
    //               <DialogTitle id="alert-dialog-title">
    //                 Delete {formName}
    //               </DialogTitle>
    //               <DialogContent>
    //                 <DialogContentText id="alert-dialog-description">
    //                   Are you sure you want to delete this form ?
    //                 </DialogContentText>
    //               </DialogContent>
    //               <DialogActions>
    //                 <p
    //                   onClick={handleClose}
    //                   className="inline-flex items-center cursor-pointer justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    //                   data-rounded="rounded-md"
    //                   data-primary="blue-600"
    //                   data-primary-reset="{}"
    //                 >
    //                   Cancel
    //                 </p>
    //                 <p
    //                   onClick={handleDelete}
    //                   className="inline-flex items-center cursor-pointer justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-red-600 border border-blue-700 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    //                   data-rounded="rounded-md"
    //                   data-primary="blue-600"
    //                   data-primary-reset="{}"
    //                 >
    //                   Delete
    //                 </p>
    //               </DialogActions>
    //             </Dialog>
    //           </div>
    //         </div>
    //       </>
    //     );
    //   },
    // },
    {
      headerName: "Stats",
      field: "formId",
      cellRenderer: (data) => {
        return (
          <Link href={`/form/stats/${data.data.formId}`}>
            <div className="py-2 px-4">
              <ImStatsBars className="text-xl text-blue-800 cursor-pointer hover:scale-150 duration-200 translate-transform ease-in-out" />
            </div>
          </Link>
        );
      },
    },
  ];
  return (
    <>
      <Head>
        <title>Home | Rely Form</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className=" w-screen h-screen flex bg-gray-50 overflow-hidden  ">
        <Sidebar />
        <div className="flex-1 h-full     ">
          <FormHeader title="Form Templates" />
          <div className="px-7 h-full">
            <div className="flex items-center bg-white px-6 rounded-xl shadow-lg mt-5 justify-between mb-3">
              {/* <h1 className="text-base text-gray-500 font-semibold ">
              {tableData?.length} templates found
            </h1> */}

              <div className="flex space-x-5   ">
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    className="bg-gray-50 form-input block w-full pl-10 sm:text-sm border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    placeholder="dd-mm-yyyy"
                    value={startDate}
                    onChange={(e) =>
                      //   setStartDate(moment(e.target.value).format("YYYY/MM/DD"))
                      setStartDate(e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <h1 className="text-sm font-semibold">To</h1>
                  <input
                    type="date"
                    value={endDate}
                    className="bg-gray-50 form-input block w-full pl-10 sm:text-sm border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <select
                  name="status"
                  id="status"
                  className="bg-gray-50 form-input block w-40  sm:text-sm border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  onChange={onSelectStatusChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <select
                  name="formType"
                  id="formType"
                  className="bg-gray-50 form-input block w-40 sm:text-sm border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  onChange={onSelectStatusChange}
                >
                  <option value="">Form Type</option>
                  <option value="IPD">IPD</option>
                  <option value="OPD">OPD</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 ">
                <div className="max-w-xs">
                  <div className=" mt-1 relative p-3 runded-md  ">
                    <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      className="bg-gray-50 form-input block w-full pl-10 sm:text-sm border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      type="search"
                      placeholder="search"
                      onChange={onFilterTextChange}
                    />
                  </div>
                </div>
                <button
                  className="max-w-fit px-4 text-sm py-2 border shadow-md bg-slate-200 rounded-md"
                  onClick={handleRefresh}
                >
                  <div className="flex items-center text-gray-600 text-sm font-semibold space-x-2">
                    <h1>Refresh</h1>
                    <FcRefresh className="text-sm text-gray-600" />
                  </div>
                </button>
                <button
                  className="max-w-fit px-4 text-sm py-2 border shadow-md bg-blue-500 rounded-md"
                  onClick={() => exportToExcel(tableData)}
                >
                  <div className="flex items-center text-white text-sm font-semibold space-x-2">
                    <h1>Export</h1>
                    <FaFileExport />
                  </div>
                </button>
              </div>
            </div>

            <h1 className="text-sm mb-2 ">{record} record(s) found</h1>

            <div className="ag-theme-alpine ag-style h-[65%]  bg-white px-6 py-6 rounded-xl shadow-2xl    w-full ">
              <AgGridReact
                columnDefs={columnDefs}
                rowData={tableData}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                pagination={true}
                ref={gridRef}
                paginationPageSize={10}
                paginationAutoPageSize={true}
                headerHeight={30}
              ></AgGridReact>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormTemplate;

export async function getServerSideProps(context) {
  await dbConnect();
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.HOST_URL
      : "http://localhost:3000";
  const response = await fetch(`${url}/api/form`);
  const data = await response.json();

  console.log(data);

  return {
    props: {
      form: JSON.parse(JSON.stringify(data)),
    },
  };
}
