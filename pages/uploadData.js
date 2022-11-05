import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import FormHeader from "../components/FormHeader";
import { read, utils } from "xlsx";
import { useTable, usePagination } from "react-table";
import axios from "axios";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { AppBar, Slide, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { RotatingLines } from "react-loader-spinner";
import Lottie from "lottie-react";
import success from "../assets/success.json";
const style = {
  height: 100,
  width: 100,
};

// missing data dialog transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
const UploadData = () => {
  const { status } = useSession();
  const [missingData, setMissingData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const router = useRouter();

  const data = useMemo(() => patients, [patients]);

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const fileName = "UserData";

  const exportToExcel = async (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
    handleDialogClose();
  };

  const handleClickOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleImport = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          //   setUsers(rows);
          const patientData = rows.filter(
            (user) => user.name && user.mobileNumber && user.regId
          );
          setPatients(patientData);

          const missing = rows.filter(
            (user) =>
              user.name === undefined ||
              user.mobileNumber === undefined ||
              user.regId === undefined
          );
          setMissingData(missing);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await axios.post(`/api/patient/`, {
      patients: patients,
    });

    const response = await axios.post(`/api/createUser`);

    if (response) {
      setCompleted(true);
    }

    setTimeout(() => {
      router.push("/dashboard");
      // setLoading(false);
      // handleClose();
    }, [500]);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Mobile",
        accessor: "mobileNumber",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Age",
        accessor: "age",
      },
      {
        Header: "Reg Id",
        accessor: "regId",
      },
      {
        Header: "UHID",
        accessor: "uhId",
      },
      {
        Header: "Patient Type",
        accessor: "patientType",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  return (
    <>
      {status === "authenticated" && (
        <>
          <Head>
            <title>Upload Excel | Rely Form</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta
              name="keywords"
              content="Form Feedback , Feedback Form , Rely Form"
            />
            <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <meta http-equiv="X-UA-Compatible" content="IE=7" />
          </Head>

          <div className="w-screen h-screen bg-gray-50 flex overflow-hidden">
            <Sidebar />

            <div className="flex-1 bg-gray-50 relative">
              <div className="w-full h-10">
                <FormHeader
                  //   handleOpen={handleOpen}
                  //   openSidebar={openSidebar}
                  title="Import Data"
                />
              </div>

              <div className="w-full flex flex-col h-screen px-7">
                <div className="w-full flex items-center border justify-between bg-white rounded-md shadow-md pl-4 pr-10 py-3  mt-10">
                  <div className="w-96 flex-col">
                    {/* <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      for="file_input"
                    >
                      Upload file
                    </label> */}
                    <input
                      className="block p-[2px] w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id="file_input"
                      type="file"
                      name="file"
                      required
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleImport}
                    />
                  </div>

                  <button
                    onClick={handleClickOpen}
                    className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600 text-white"
                  >
                    <span className="absolute w-96 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                    <span className="relative text-indigo-600 transition duration-300 group-hover:text-white ease">
                      Upload Data
                    </span>
                  </button>

                  <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={modalOpen}
                  >
                    {loading ? (
                      <>
                        {completed ? (
                          <div className="w-96 flex flex-col py-10 items-center justify-center ">
                            <Lottie animationData={success} style={style} />
                            <p>Data uploaded successfully</p>
                          </div>
                        ) : (
                          <div className="w-96 flex flex-col py-10 items-center justify-center">
                            <RotatingLines
                              strokeColor="blue"
                              strokeWidth="5"
                              animationDuration="0.75"
                              width="60"
                              visible={true}
                            />
                            <p>Uploading data ...</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <BootstrapDialogTitle
                          id="customized-dialog-title"
                          onClose={handleClose}
                        >
                          Upload Patient Data
                        </BootstrapDialogTitle>

                        <DialogContent dividers>
                          {missingData.length > 0 && (
                            <h1 className="w-96 text-sm text-red-500 mb-3">
                              {missingData.length} record(s) found with missing
                              data{" "}
                              <span
                                onClick={handleDialogOpen}
                                className="text-blue-500 ml-5 cursor-pointer hover:underline"
                              >
                                View
                              </span>
                            </h1>
                          )}

                          <h1 className="w-96 text-sm  mb-3 text-green-600">
                            {patients.length} record(s) will be inserted
                          </h1>

                          <h1 className="w-96 text-sm text-gray-600">
                            Total Records :{" "}
                            {patients.length + missingData.length}
                          </h1>
                        </DialogContent>
                        <DialogActions>
                          <button
                            className="bg-blue-700 px-2 py-1 rounded-lg text-white"
                            onClick={handleSubmit}
                          >
                            Upload
                          </button>
                        </DialogActions>
                      </>
                    )}
                  </BootstrapDialog>

                  <Dialog
                    fullScreen
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    TransitionComponent={Transition}
                  >
                    <AppBar sx={{ position: "relative" }}>
                      <Toolbar>
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={handleDialogClose}
                          aria-label="close"
                        >
                          <CloseIcon />
                        </IconButton>
                        <Typography
                          sx={{ ml: 2, flex: 1 }}
                          variant="h6"
                          component="div"
                        >
                          View Missing Data
                        </Typography>
                        <Button
                          autoFocus
                          color="inherit"
                          onClick={() => exportToExcel(missingData)}
                        >
                          Export Data
                        </Button>
                      </Toolbar>
                    </AppBar>
                    <div className="w-full px-10">
                      <table className="w-full mt-8 text-gray-700">
                        <tr className="border-b-2">
                          <th>Sl. No</th>
                          <th>Name</th>
                          <th>Mobile</th>
                          <th>Gender</th>
                          <th>Age</th>
                          <th>Reg Id</th>
                          <th>UH Id</th>
                          <th>Patient Type</th>
                        </tr>

                        {missingData.map((data, i) => (
                          <tr
                            key={i}
                            className="text-sm text-center font-medium odd:bg-blue-100 h-10"
                          >
                            <td>{i + 1}</td>
                            <td>{data.name}</td>
                            <td>{data.mobileNumber}</td>
                            <td>{data.gender}</td>
                            <td>{data.age}</td>
                            <td>{data.regId}</td>
                            <td>{data.uhId}</td>
                            <td>{data.patientType}</td>
                          </tr>
                        ))}
                      </table>
                    </div>
                  </Dialog>
                </div>

                {/* <h1>
                  {users.length} records found with{" "}
                  {users.length - patients.length} data missing name or mobile
                  number
                </h1> */}

                {patients.length > 0 && (
                  <div className="mt-5 w-full h-[65%] bg-white rounded-md shadow-md px-10 py-4 relative">
                    <table {...getTableProps()} className="w-full px-10  ">
                      <thead>
                        {headerGroups.map((headerGroup) => (
                          <tr
                            className="border-b-2  "
                            key={headerGroup.id}
                            {...headerGroup.getHeaderGroupProps()}
                          >
                            {headerGroup.headers.map((column) => (
                              <th
                                key={column.id}
                                {...column.getHeaderProps()}
                                className="text-sm p-2 text-start pl-10"
                              >
                                {column.render("Header")}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>

                      <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                          prepareRow(row);
                          return (
                            <tr
                              key={row.id}
                              {...row.getRowProps()}
                              className="even:bg-blue-50"
                            >
                              {row.cells.map((cell) => {
                                return (
                                  <td
                                    key={cell.id}
                                    {...cell.getCellProps()}
                                    className="text-xs font-medium text-gray-600  pl-10 p-2  "
                                  >
                                    {cell.render("Cell")}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="absolute w-full h-10 bottom-0 border-2 p-2 flex justify-end pr-10 space-x-2 shadow-sm -left-0 ">
                      {/* <h1 className="text-sm text-red-500">
                        {missingData.length} record(s) found with missing data
                      </h1> */}
                      <button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                      >
                        {"<<"}
                      </button>{" "}
                      <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                      >
                        {"<"}
                      </button>{" "}
                      <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                      >
                        {">"}
                      </button>{" "}
                      <button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                      >
                        {">>"}
                      </button>{" "}
                      <span>
                        Page{" "}
                        <strong>
                          {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UploadData;
