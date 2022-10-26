import { AgGridReact } from "ag-grid-react";
import { SearchIcon } from "@heroicons/react/outline";
import React, { useEffect, useState, useRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton } from "@mui/material";

import { FaFileExport } from "react-icons/fa";
import { FcRefresh } from "react-icons/fc";

import { useSession } from "next-auth/react";

import Sidebar from "../../components/Sidebar";
import FormHeader from "../../components/FormHeader";

const Dashboard = ({ form }) => {
  const [tableData, setTableData] = useState([]);
  const [gridApi, setGridApi] = useState();

  const [feedbackNumber, setFeedbackNumber] = useState(0);
  const [seed, setSeed] = useState(1);
  const [record, setRecord] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [openSidebar, setOpen] = useState(false);

  const { status } = useSession();

  const router = useRouter();

  const handleOpen = () => {
    setOpen(!openSidebar);
  };

  const refreshData = () => {
    // onGridReady();
    setSeed(Math.random());
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
    fetch("/api/formFeedback")
      .then((resp) => resp.json())
      .then(
        (resp) => (
          params.api.applyTransaction({ add: resp }),
          setFeedbackNumber(resp.length),
          setRecord(params.api.getDisplayedRowCount())
        )
      );
  };

  const getUsers = () => {
    fetch("/api/formFeedback")
      .then((resp) => resp.json())
      .then((resp) => setTableData(resp));
  };
  const onExportClick = () => {
    gridApi.api.exportDataAsCsv();
  };

  const onFilterTextChange = (e) => {
    gridApi.api.setQuickFilter(e.target.value);
  };

  const onSelectChange = (e) => {
    gridApi.api.setQuickFilter(e.target.value);
    const count = gridApi.api.getDisplayedRowCount();
    setRecord(count);
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

            <div key={seed} className=" flex-1  bg-gray-50   relative  ">
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
                      className="bg-gray-50 form-input block w-96  sm:text-sm border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      onChange={onSelectChange}
                    >
                      <option value="false">Pending</option>
                      <option value="true">Submitted</option>
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
                      onClick={refreshData}
                    >
                      <div className="flex items-center text-gray-600 text-sm font-semibold space-x-2">
                        <h1>Refresh</h1>
                        <FcRefresh className="text-sm text-gray-600" />
                      </div>
                    </button>
                    <button
                      className="max-w-fit px-4 text-sm py-2 border shadow-md bg-blue-500 rounded-md"
                      onClick={onExportClick}
                    >
                      <div className="flex items-center text-white text-sm font-semibold space-x-2">
                        <h1>Export</h1>
                        <FaFileExport />
                      </div>
                    </button>
                  </div>
                </div>

                <h1 className="text-sm mb-2  text-gray-600">
                  {record} record(s) found
                </h1>

                <div className="ag-theme-alpine  h-[70%] bg-white px-6 py-6 rounded-xl shadow-2xl w-full">
                  <AgGridReact
                    columnDefs={columnDefs}
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
  const response = await fetch("https://rely-form.herokuapp.com/api/form");

  const data = await response.json();

  console.log(data);

  return {
    props: {
      form: JSON.parse(JSON.stringify(data)),
    },
  };
}
