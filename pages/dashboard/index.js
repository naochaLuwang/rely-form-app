import { AgGridReact } from "ag-grid-react";
import { SearchIcon } from "@heroicons/react/outline";
import React, { useEffect, useState, useRef, useMemo } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment";
import Link from "next/link";

import { FaFileExport } from "react-icons/fa";
import { FcRefresh } from "react-icons/fc";

const Dashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [gridApi, setGridApi] = useState();
  const [refresh, setRefresh] = useState(false);

  console.log(tableData);

  const today = new Date();
  const gridRef = useRef();

  const date = today.setDate(today.getDate());
  const defaultValue = new Date(date).toISOString();
  console.log(defaultValue);
  const todaysDate = defaultValue.split("T")[0];
  console.log(todaysDate);
  // const defaultValue = new Date(date).toISOString().split("T")[0]; // yyyy-mm-dd
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      cellClass: "text-small tracking-wide font-medium ",
      flex: 0.7,

      checkboxSelection: true,
    },
    {
      headerName: "Date",
      field: "createdAt",
      cellClass: "text-small tracking-wide font-medium ",
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
      cellClass: "text-small tracking-wide font-medium ",
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
      cellClass: "text-small tracking-wide font-medium ",
    },
    {
      headerName: "Submitted At",
      field: "updatedAt",
      cellClass: "text-small tracking-wide font-medium ",
      flex: 1.5,
      width: 300,
      cellRenderer: (data) => {
        // return moment(data.updatedAt).format("DD/MM/YYYY");
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
    },
    {
      headerName: "Share",
      field: "formUrl",
      cellRenderer: (data) => {
        return (
          <Link href={data.data.formUrl}>
            <a target="_blank">Link</a>
          </Link>
        );
      },
    },
    {
      headerName: "Status",

      field: "isSubmitted",
      cellRenderer: (data) => {
        return (
          // <h1 className="text-green-500 font-bold">
          //   {data.data.isSubmitted ? "Submitted" : "Pending"}
          // </h1>
          <>
            {data.data.isSubmitted ? (
              <h1 className="text-green-500 font-bold">Submitted</h1>
            ) : (
              <h1 className="text-red-500 font-bold">Pending</h1>
            )}
          </>
        );
      },
    },
    {
      headerName: "Action",

      field: "_id",
      cellClass: " font-bold text-blue-500 hover:underline",
      cellRenderer: (data) => {
        return <Link href={`/dashboard/${data.data._id}`}>View</Link>;
      },
    },
  ];

  const defaultColDef = {
    headerClass: function (params) {
      // logic to return the correct class
      return "header-one";
    },
    // sortable: true,
    editable: false,
    flex: 1,
    resizeable: true,
    // filter: true,
    // floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params);
    fetch("/api/formFeedback")
      .then((resp) => resp.json())
      .then((resp) => params.api.applyTransaction({ add: resp }));
  };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  const handleRefresh = () => {
    getUsers();
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

  const getFilterType = () => {
    if (startDate !== "" && endDate !== "") return "inRange";
    else if (startDate !== "") return "greaterThan";
    else if (endDate !== "") return "lessThan";
  };

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

  console.log(startDate, endDate);
  return (
    <div className=" w-screen h-screen overflow-hidden ">
      <div className="mx-auto max-w-7xl h-[70%]  mt-5 ag-theme-alpine  ">
        <h1 className="text-xl font-bold">Form Feedback</h1>

        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm font-semibold ">
            Total Records :{tableData.length}
          </h1>

          <div className="flex space-x-5 ">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-semibold">From</h1>
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
              onClick={onExportClick}
            >
              <div className="flex items-center text-white text-sm font-semibold space-x-2">
                <h1>Export</h1>
                <FaFileExport />
              </div>
            </button>
          </div>
        </div>

        <AgGridReact
          columnDefs={columnDefs}
          // rowData={tableData}
          ref={gridRef}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default Dashboard;
