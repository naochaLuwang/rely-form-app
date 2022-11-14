import { SearchIcon } from "@heroicons/react/outline";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

import { FaFileExport } from "react-icons/fa";
import { FcRefresh } from "react-icons/fc";

import { useSession } from "next-auth/react";

import FormHeader from "../../components/FormHeader";
import Sidebar from "../../components/Sidebar";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const Dashboard = ({ form }) => {
  const [tableData, setTableData] = useState(form);

  const [gridApi, setGridApi] = useState();
  const [record, setRecord] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [openSidebar, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [type, setType] = useState("IPD");

  const exportData = [];

  const { status } = useSession();
  const style = {
    height: 50,
    width: 50,
  };

  const router = useRouter();

  console.log(tableData);

  const handleOpen = () => {
    setOpen(!openSidebar);
  };

  const refreshData = async () => {
    if (pending === false) {
      const response = await fetch(`/api/dashboard/false`);
      const data = await response.json();
      setTableData(data);
    } else {
      const response = await fetch(`/api/dashboard/true`);
      const data = await response.json();
      setTableData(data);
    }
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  console.log(form);

  const today = new Date();
  const gridRef = useRef();

  const date = today.setDate(today.getDate());
  const defaultValue = new Date(date).toISOString();

  const todaysDate = defaultValue.split("T")[0];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(todaysDate);

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }

  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  // !! parameters for date filter
  const dateFilterParams = {
    // provide comparator function
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      var dateAsString = moment(cellValue).format("YYYY-MM-DD");

      if (dateAsString == null) {
        return 0;
      }

      //  dates are stored as dd/mm/yyyy
      // We create a Date object for comparison against the filter date

      console.log(dateAsString);
      var dateParts = dateAsString.split("-");
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

  const columnDefs = [
    {
      headerName: "Sl No.",
      valueGetter: "node.rowIndex + 1",
      cellClass: "text-xs tracking-wide font-medium ",
      flex: 0.7,
    },
    {
      headerName: "Date",
      field: "createdAt",
      cellClass: "text-xs tracking-wide font-medium ",
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
      flex: 1,

      cellRenderer: (data) => {
        return moment(data.value).format("DD/MM/YYYY");
      },
    },

    {
      headerName: "Name",

      field: "patient.name",
      cellClass: "text-xs tracking-wide font-medium ",
      flex: 1.6,
      cellRenderer: (data) => {
        return (
          <p>
            {data.data.patient.salutationName} {data.value}
          </p>
        );
      },
    },
    {
      headerName: "Mobile",

      field: "patient.primaryMobileNumber",
      cellClass: "text-xs tracking-wide font-medium ",
    },
    {
      headerName: "Submitted At",
      field: "updatedAt",
      cellClass: "text-xs tracking-wide font-medium ",
      flex: 1.5,
      width: 300,
      cellRenderer: (data) => {
        return (
          <>
            {data.data.isSubmitted
              ? moment(data.value).format("DD/MM/YYYY hh:mm A")
              : ""}
          </>
        );
      },
    },

    {
      headerName: "Score",

      field: "overallScore",
      cellRenderer: (data) => {
        return (
          <>
            {data.value < data.data.averageWeightage && data.value !== 0 ? (
              <h1 className="text-red-500 flex items-center justify-center w-fit h-full text-xs">
                {data.value == 0 ? "" : data.value}
              </h1>
            ) : (
              <h1 className="text-gray-600 text-xs flex items-center justify-center w-fit h-full">
                {data.value == 0 ? "" : data.value}
              </h1>
            )}
          </>
        );
      },
    },

    {
      headerName: "Share",
      field: "formUrl",
      flex: 0.7,
      cellRenderer: (data) => {
        return (
          <Link href={data.value}>
            <a target="_blank">
              <IconButton className="h-8 w-8">
                <ShareIcon className="text-blue-500 h-6 w-6" />
              </IconButton>
            </a>
          </Link>
        );
      },
    },
    {
      headerName: "Status",
      cellClass: "text-start ",
      flex: 1,
      field: "isSubmitted",

      cellRenderer: (data) => {
        return (
          // <h1 className="text-green-500 font-bold">
          //   {data.data.isSubmitted ? "Submitted" : "Pending"}
          // </h1>
          <>
            {data.data.isSubmitted ? (
              <div className="flex  h-full items-center w-full ">
                <h1 className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-2xl">
                  Submitted
                </h1>
              </div>
            ) : (
              <div className="flex w-full h-full items-center ">
                <h1 className="bg-red-500 text-white  text-xs font-bold px-6 py-1.5 rounded-2xl">
                  Pending
                </h1>
              </div>
            )}
          </>
        );
      },
    },
    {
      headerName: "Action",

      field: "_id",
      cellRenderer: (data) => {
        return data.data.isSubmitted ? (
          <Link href={`/dashboard/${data.data._id}`}>
            <p className="font-bold text-blue-500 hover:underline flex items-center justify-center w-fit h-full cursor-pointer text-xs">
              View
            </p>
          </Link>
        ) : (
          <h1 className="font-medium flex items-center justify-center w-fit h-full  text-gray-400 text-xs">
            View
          </h1>
        );
      },
    },
  ];

  const defaultColDef = {
    headerClass: function (params) {
      return "header-one";
    },

    editable: false,
    flex: 1,
    resizeable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const fileName = "FeedbackData";

  const onExportClick = () => {
    // gridApi.api.exportDataAsCsv();
    for (let i = 0; i < tableData.length; i++) {
      exportData.push({
        SalutationName: tableData[i].patient.salutationName,
        Name: tableData[i].patient.name,
        Mobile: tableData[i].patient.primaryMobileNumber,
        SubmittedAt: tableData[i].updatedAt,
        Score: tableData[i].overallScore,
        Status: `${tableData[i].isSubmitted ? "Submitted" : "Pending"}`,
      });
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const onHandleSearch = (e) => {
    gridApi.api.setQuickFilter(e.target.value);
  };

  const onSelectChange = async (e) => {
    setLoading(true);
    setPending(!pending);

    const response = await fetch(`/api/dashboard/${e.target.value}/${type}`);
    const data = await response.json();

    if (data.length < 0) {
      setTableData([]);
    } else {
      setTableData(data);
    }

    gridApi.api.setQuickFilter(e.target.value);
    setLoading(false);
    const count = gridApi.api.getDisplayedRowCount();
    setRecord(count);
  };

  const onSelectTypeChange = async (e) => {
    setLoading(true);
    setType(e.target.value);

    const response = await fetch(`/api/dashboard/${pending}/${e.target.value}`);
    const data = await response.json();

    if (data.length < 0) {
      setTableData([]);
    } else {
      setTableData(data);
    }

    setLoading(false);
  };
  const getFilterType = () => {
    if (startDate !== "" && endDate !== "") return "inRange";
    else if (startDate !== "") return "greaterThanOrEqual";
    else if (endDate !== "") return "lessThanOrEqual";
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.api.setQuickFilter("false");
      const count = gridApi.api.getDisplayedRowCount();
      setRecord(count);
      // getFormTemplates();
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
      const count = gridApi.api.getDisplayedRowCount();
      setRecord(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  if (status === "unauthenticated") {
    router.push("/signin");
  }

  return (
    <>
      {status === "authenticated" && (
        <>
          <Head>
            <title>Dashboard | Rely Form</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta http-equiv="X-UA-Compatible" content="IE=7" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
            <meta name="keywords" content="Form Feedback , Feedback Form" />
          </Head>
          <div className=" w-screen h-screen bg-gray-50 flex overflow-hidden ">
            <Sidebar open={openSidebar} />

            <div className=" flex-1  bg-gray-50   relative  ">
              <div className="w-full h-10">
                <FormHeader
                  handleOpen={handleOpen}
                  openSidebar={openSidebar}
                  title="Form Feedback"
                />
              </div>
              <div className="w-full flex flex-col h-screen px-7">
                <div className="flex items-center mt-7 px-7 bg-white  rounded-xl shadow-lg   justify-between mb-3">
                  <div className="flex space-x-5 ">
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        className="bg-gray-50 form-input block w-full pl-10 sm:text-sm border border-gray-300 rounded-md focus:ring-black focus:border-black"
                        placeholder="dd-mm-yyyy"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
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
                      onChange={onSelectChange}
                    >
                      <option className="border p-5" value="false">
                        Pending
                      </option>
                      <option value="true">Submitted</option>
                    </select>
                  </div>

                  <div>
                    <select
                      name="formType"
                      id="formType"
                      className="bg-gray-50 form-input block w-40 sm:text-sm border border-gray-300 rounded-md focus:ring-black focus:border-black "
                      onChange={onSelectTypeChange}
                    >
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
                          onChange={onHandleSearch}
                        />
                      </div>
                    </div>

                    <button
                      onClick={refreshData}
                      className="relative z-30 inline-flex items-center justify-center w-auto px-4 py-2 overflow-hidden  text-gray-500 transition-all duration-500 border border-gray-200 rounded-md cursor-pointer group ease bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-white active:to-white"
                    >
                      <span className="w-full h-0.5 absolute bottom-0 group-active:bg-transparent left-0 bg-gray-100"></span>
                      <span className="h-full w-0.5 absolute bottom-0 group-active:bg-transparent right-0 bg-gray-100"></span>
                      Refresh{" "}
                      <FcRefresh className="text-sm ml-2 text-gray-600 font-medium" />
                    </button>
                    {/* <button
                      className="max-w-fit px-4 text-sm py-2 border shadow-md bg-blue-500 rounded-md"
                      onClick={onExportClick}
                    >
                      <div className="flex items-center text-white text-sm font-semibold space-x-2">
                        <h1>Export</h1>
                        <FaFileExport />
                      </div>
                    </button> */}

                    <button
                      onClick={onExportClick}
                      className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 "
                      data-rounded="rounded-md"
                      data-primary="blue-600"
                      data-primary-reset="{}"
                    >
                      Export{" "}
                      <span className="ml-2">
                        <FaFileExport />
                      </span>
                    </button>
                  </div>
                </div>

                <h1 className="text-sm mb-2  text-gray-600">
                  {tableData.length} record(s) found
                </h1>

                <div className="ag-theme-alpine  h-[70%] bg-white px-6 py-6 rounded-xl shadow-2xl w-full">
                  <BootstrapDialog
                    onClose={() => setLoading(false)}
                    aria-labelledby="customized-dialog-title"
                    open={loading}
                  >
                    {loading && (
                      <div className="w-96 flex flex-col py-4 items-center justify-center">
                        <RotatingLines
                          strokeColor="blue"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="60"
                          visible={true}
                        />
                        <p className="animate-pulse text-sm font-medium text-gray-500 mt-2">
                          Loading ...
                        </p>
                      </div>
                    )}
                  </BootstrapDialog>

                  <AgGridReact
                    columnDefs={columnDefs}
                    rowData={tableData}
                    ref={gridRef}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    pagination={true}
                    paginationPageSize={10}
                    paginationAutoPageSize={true}
                    headerHeight={30}
                  ></AgGridReact>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;

export async function getServerSideProps(context) {
  const url = process.env.HOST_URL;

  const submitted = false;
  const type = "IPD";
  const response = await fetch(`${url}/api/dashboard/${submitted}/${type}`);

  const data = await response.json();

  console.log(data);

  return {
    props: {
      form: JSON.parse(JSON.stringify(data)),
    },
  };
}
