import {
  Close,
  ContentCopyTwoTone,
  Delete,
  DeleteForever,
  Settings,
  ShortTextTwoTone,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";

import { BsPencilSquare } from "react-icons/bs";

import Switch from "@mui/material/Switch";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, FormControlLabel, IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { Dialog, DialogTitle } from "@mui/material";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Drawer from "@mui/material/Drawer";
import Slider from "@mui/material/Slider";
import axios from "axios";
import FormHeader from "./FormHeader";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast, { Toaster } from "react-hot-toast";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Lottie from "lottie-react";
import success from "../assets/success.json";

import {
  BsInputCursor,
  BsTextareaResize,
  BsUiRadios,
  BsUiChecks,
  BsPersonCircle,
} from "react-icons/bs";
import { TiSortNumerically } from "react-icons/ti";
import { HiMail } from "react-icons/hi";
import { VscPreview } from "react-icons/vsc";
import { RotatingLines } from "react-loader-spinner";

const style = {
  height: 100,
  width: 100,
};
// Dialog transition
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

const FormBody = () => {
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formData, setFormData] = useState([]);
  const [formType, setFormType] = useState("IPD");
  const [radioIndex, setRadioIndex] = useState(0);
  const [formStatus, setFormStatus] = useState(true);
  const [weightIndex, setWeightIndex] = useState(0);
  const [minimumWeightage, setMinimumWeightage] = useState(0);
  const [maximumWeightage, setMaximumWeightage] = useState(0);
  const [averageWeightage, setAverageWeightage] = useState(0);
  const [loading, setLoading] = useState(false);

  const createdBy = "admin";
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [textOpen, setTextOpen] = React.useState(false);
  const [numericOpen, setNumericOpen] = React.useState(false);
  const [multilineOpen, setMultilineOpen] = React.useState(false);
  const [radioOpen, setRadioOpen] = React.useState(false);
  const [checkboxOpen, setCheckboxOpen] = React.useState(false);
  const [fieldOpen, setFieldOpen] = useState(false);
  const [labelText, setLabelText] = useState("");
  const [completed, setCompleted] = useState(false);

  const formEndRef = useRef(null);

  useEffect(() => {
    formEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [formData]);

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    var itemgg = [...formData];
    const itemF = reorder(
      itemgg,
      result.source.index,
      result.destination.index
    );
    setFormData(itemF);
    console.log(formData);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // !! preview function
  const handleClickOpen = () => {
    console.log(formData);
    const filteredData = formData.filter((element) =>
      element.inputType.includes("radio")
    );

    let lastIndex = filteredData[0]?.options.length - 1 || 0;

    let minWeight = filteredData[0]?.options[0].weightage || 0;
    let maxWeight = filteredData[0]?.options[lastIndex].weightage || 0;

    setMinimumWeightage(minWeight);

    setMaximumWeightage(maxWeight);

    let average = (minWeight + maxWeight) / 2;

    setAverageWeightage(average);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloses = () => {
    setLoading(false);
  };

  const newLabel = () => {
    setFormData([
      ...formData,
      {
        label: labelText,
        inputType: "label",
      },
    ]);
  };

  const newName = () => {
    setFormData([
      ...formData,
      {
        label: "Name",
        text: "",
        inputType: "name",
      },
    ]);
  };

  const newEmail = () => {
    setFormData([
      ...formData,
      {
        label: "Email",
        text: "",
        inputType: "email",
      },
    ]);
  };

  const newText = () => {
    setFormData([
      ...formData,
      {
        labelText: "",
        text: "",
        inputType: "text",
        required: false,
        placeholderText: "",
        style: {
          label: false,
          fontSize: "",
          weight: false,
          italic: false,
          underline: false,
          alignment: "",
        },
      },
    ]);
    console.log(formData);
  };

  const newMultiline = () => {
    setFormData([
      ...formData,
      {
        labelText: "",
        text: "",
        inputType: "multiline",
        required: false,
        placeholderText: "",
        style: {
          label: false,
          fontSize: "",
          weight: false,
          italic: false,
          underline: false,
          alignment: "",
        },
      },
    ]);
  };

  const duplicateText = (i) => {
    const text = [...formData];
    const newText = text[i];
    console.log([...formData]);
    console.log(newText);
    setFormData([...formData, newText]);
    console.log(i);
    setRadioIndex(radioIndex + 1);
    console.log(i);
  };

  const changeFontSize = (i, fontSize) => {
    const newFormData = [...formData];
    newFormData[i].style.fontSize = fontSize;
    setFormData(newFormData);
  };

  const changeRequired = (i) => {
    const newFormData = [...formData];
    newFormData[i].required = !newFormData[i].required;
    setFormData(newFormData);
  };

  const handleLabel = (i) => {
    const newFormData = [...formData];
    newFormData[i].style.label = !newFormData[i].style.label;
    setFormData(newFormData);
  };

  const changeLabel = (i, text) => {
    const newFormData = [...formData];
    newFormData[i].label = text;
    setFormData(newFormData);
  };

  const changeCredential = (i, text) => {
    const newFormData = [...formData];
    newFormData[i].text = text;
    setFormData(newFormData);
  };

  const changeWeight = (i) => {
    const newFormData = [...formData];
    newFormData[i].style.weight = !newFormData[i].style.weight;

    setFormData(newFormData);
    console.log(formData);
  };

  const changeItalic = (i) => {
    const newFormData = [...formData];
    newFormData[i].style.italic = !newFormData[i].style.italic;
    setFormData(newFormData);
  };

  const changeUnderline = (i) => {
    const newFormData = [...formData];
    newFormData[i].style.underline = !newFormData[i].style.underline;
    setFormData(newFormData);
  };

  const changeAlignment = (i, alignment) => {
    const newFormData = [...formData];
    newFormData[i].style.alignment = alignment;
    setFormData(newFormData);
  };

  const changeText = (text, i) => {
    let newText = [...formData];
    newText[i].text = text;
    setFormData(newText);
    console.log(formData);
  };

  const changeLabelText = (text, i) => {
    let newText = [...formData];
    newText[i].labelText = text;
    setFormData(newText);
    console.log(formData);
  };

  const changePlaceHolderText = (text, i) => {
    let newplaceholder = [...formData];
    newplaceholder[i].placeholderText = text;
    setFormData(newplaceholder);
  };

  const newTextNumeric = () => {
    setFormData([
      ...formData,
      {
        labelText: "",
        text: "",
        inputType: "number",
        required: false,
        placeholderText: "",
        style: {
          label: false,
          fontSize: "",
          weight: false,
          italic: false,
          underline: false,
          alignment: "",
        },
      },
    ]);
  };

  // ** radio functions

  const newRadio = () => {
    console.log([...formData]);
    setFormData([
      ...formData,
      {
        text: "",
        inputType: "radio",
        questionNo: 0,
        ansText: "",
        required: true,
        weightage: 0,
        options: [{ optionText: "", weightage: 1 }],
        style: {
          size: "lg",
          weight: false,
          italic: false,
          underline: false,
          weightsorter: false,
          weights: 9,
        },
      },
    ]);

    console.log(formData);
  };

  const handleRadioDialog = (i) => {
    setRadioIndex(i);
    setRadioOpen(true);
  };

  const duplicateRadio = (i) => {
    console.log([...formData]);
    setFormData([
      ...formData,
      {
        text: formData[i].text,
        inputType: "radio",
        questionNo: Number(formData[i].questionNo) + 1,
        ansText: "",
        required: true,
        weightage: 0,
        options: formData[i].options.map((option) => ({
          optionText: option.optionText,
          weightage: option.weightage,
        })),

        style: {
          size: "lg",
          weight: false,
          italic: false,
          underline: false,
          weightsorter: false,
          weights: 9,
        },
      },
    ]);

    console.log(formData);
  };

  const duplicateCheckbox = (i) => {
    console.log([...formData]);
    setFormData([
      ...formData,
      {
        text: "Enter question text",
        inputType: "checkbox",

        questionNo: Number(formData[i].questionNo) + 1,

        ans: [],
        required: true,
        options: [{ optionText: "Enter option text", isChecked: false }],
        style: {
          size: "lg",
          weight: false,
          italic: false,
          underline: false,
          weights: 9,
        },
      },
    ]);

    console.log(formData);
  };

  const changeQuestionNumber = (text, i) => {
    let newText = [...formData];
    newText[i].questionNo = text;
    setFormData(newText);
    console.log(formData);
  };

  const changeRadioQuestion = (text, i) => {
    let newQuestionText = [...formData];
    console.log(newQuestionText);
    newQuestionText[i].text = text;
    console.log(i);
    setFormData(newQuestionText);
    console.log(newQuestionText);
  };

  const changeOptionValue = (text, i, j) => {
    let optionsQuestion = [...formData];
    optionsQuestion[i].options[j].optionText = text;
    setFormData(optionsQuestion);
    console.log(optionsQuestion);
  };

  const changeWeightageValue = (text, i, j) => {
    let optionsQuestion = [...formData];
    optionsQuestion[i].options[j].weightage = parseInt(text);
    setDescending(optionsQuestion[0].options[0].weightage);
    setFormData(optionsQuestion);
    console.log(optionsQuestion);
  };

  const addOption = (i, j) => {
    let optionsQuestion = [...formData];
    const options = optionsQuestion[i].options;
    console.log("option" + options[0].weightage);

    // optionsQuestion[i].options[0].weightage = descending || 10;

    // var tem =
    //   optionsQuestion[i].options[optionsQuestion[i].options.length - 1]
    //     .weightage;
    // console.log(optionsQuestion[i].length - 1 + " // " + tem);
    // if (optionsQuestion[i].style.weightsorter) {
    //   if (tem > 1) {
    //     tem = tem - 1;
    //   }
    // } else {
    //   tem = tem + 1;
    //   if (tem < 10) {
    //   }
    // }

    if (optionsQuestion[i].options[0].weightage !== 1) {
      setWeightIndex(weightIndex + 1);
    }

    if (optionsQuestion[i].options.length < 10) {
      optionsQuestion[i].options = [
        ...options,
        {
          optionText: "",
          weightage:
            optionsQuestion[i].options[0].weightage === 1
              ? optionsQuestion[i].options.length + 1
              : optionsQuestion[i].options[weightIndex].weightage - 1,
        },
      ];

      setFormData(optionsQuestion);
    } else {
      console.log("Max 10 options");
    }
  };

  const removeOption = (i, j) => {
    let removeOptionQuestion = [...formData];
    if (removeOptionQuestion[i].options.length > 1) {
      removeOptionQuestion[i].options.splice(j, 1);
      setFormData(removeOptionQuestion);
      console.log(i + " " + j);
    }
  };

  // const descendingSort = (i) => {
  //   const newFormData = [...formData];
  //   newFormData[i].style.weightsorter = true;

  //   newFormData[i].options[0].weightage = descending || 10;
  //   var tem = newFormData[i].options[0].weightage;
  //   for (let j = 0; j < newFormData[i].options.length; j++) {
  //     console.log(tem--);
  //   }

  //   setFormData(newFormData);
  // };

  const deleteComponent = (i) => {
    let qs = [...formData];
    if (formData.length >= 1) {
      qs.splice(i, 1);
      setFormData(qs);
    }
  };

  // ** checkbox functions

  const newCheckBox = () => {
    setFormData([
      ...formData,
      {
        text: "",
        inputType: "checkbox",

        questionNo: radioIndex,

        ansText: "",
        required: true,
        options: [{ optionText: "", isChecked: false }],
        style: {
          size: "lg",
          weight: false,
          italic: false,
          underline: false,
          weights: 9,
        },
      },
    ]);
  };
  const addCheckboxOption = (i) => {
    let optionsQuestion = [...formData];
    if (optionsQuestion[i].options.length < 5) {
      optionsQuestion[i].options.push({
        optionText: "",
        isChecked: false,
      });
      setFormData(optionsQuestion);
    } else {
      console.log("Max 5 options");
    }
  };

  // ** range functions
  const newRange = () => {
    setFormData([
      ...formData,
      {
        text: "Enter text",
        inputType: "range",
        value: 0,
        required: true,
      },
    ]);
  };

  const updateRange = (value, index) => {
    let newRange = [...formData];
    newRange[index].value = value;
    setFormData(newRange);
    console.log(formData);
  };

  // ? form submit
  const handleSubmit = async () => {
    setLoading(true);
    const res = await axios.post("/api/form", {
      formName,
      formData,
      formDescription,
      formId,
      formType,
      minimumWeightage,
      maximumWeightage,
      averageWeightage,
      status: formStatus,
      createdBy,
    });

    if (res) {
      setCompleted(true);
    }

    setTimeout(() => {
      router.push("/formTemplate");
      // setLoading(false);
      // handleClose();
    }, [500]);
  };

  useEffect(() => {
    const id = uuidv4();
    setFormId(id);
  }, []);

  const formUI = () => {
    return (
      <div>
        {formData?.map((form, i) => {
          switch (form.inputType) {
            // ! create a new text field in Form UI
            case "text":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      key={i}
                      ref={provided.innerRef}
                      // eslint-disable-next-line react/no-unknown-property
                      isDragging={snapshot.isDragging}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full mb-0 flex items-center justify-center">
                            <DragIndicatorIcon
                              className={`rotate-90 ${
                                snapshot.isDragging && "text-green-400"
                              }`}
                            />
                          </div>
                          <div
                            key={i}
                            className={`${
                              snapshot.isDragging &&
                              "border-green-300 border-2 border-dashed bg-opacity-10"
                            }
                              bg-white w-full flex rounded-lg space-x-3 items-center px-6 py-6 space-y-3  shadow-lg h-fit mb-5`}
                          >
                            <div
                              onClick={() => setTextOpen(true)}
                              className="flex flex-col flex-1"
                            >
                              {!formData[i].style.label ? (
                                <div className="w-full">
                                  <input
                                    type="text"
                                    disabled
                                    placeholder="Single Line"
                                    value={formData[i].labelText}
                                    className="w-full bg-transparent text-gray-600 form-input border-0 outline-0 font-semibold focus:ring-0 focus:border-b-2 -ml-3"
                                  />
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="w-full flex ">
                                <input
                                  className={`

                    ${form.style.fontSize === "xl" ? "text-2xl" : ""}
                    ${form.style.fontSize === "4xl" ? "text-4xl" : ""}
                    ${form.style.fontSize === "lg" ? "text-lg" : ""}
                    ${form.style.fontSize === "" ? "text-lg" : ""}

                    ${form.style.alignment === "start" ? "text-start" : ""}
                    ${form.style.alignment === "center" ? "text-center" : ""}
                    ${form.style.alignment === "end" ? "text-end" : ""}
                    ${form.style.alignment === "" ? "text-start" : ""}
                   
                   
                    
                    
                   ${!formData[i].style.weight ? "font-medium" : `font-bold`} ${
                                    !formData[i].style.italic
                                      ? "not-italic"
                                      : "italic"
                                  } ${
                                    !formData[i].style.underline
                                      ? "no-underline"
                                      : "underline"
                                  } "form-input w-full text-${
                                    formData[i].style.fontSize
                                  }  focus:ring-0 focus:outline-0 rounded-md focus:border-gray-500 bg-transparent`}
                                  type={formData[i].inputType}
                                  placeholder={formData[i].placeholderText}
                                  value={formData[i].text}
                                  readOnly
                                  // onChange={(e) => changeText(e.target.value, i)}
                                />
                              </div>
                            </div>

                            <div
                              key={"right"}
                              className="flex items-center space-x-2 justify-center   "
                            >
                              <IconButton
                                className="h-10 w-10 text-green-700 font-light bg-gray-200"
                                onClick={() => setTextOpen(true)}
                              >
                                <Settings className="text-green-700" />
                              </IconButton>
                              <IconButton
                                className="text-red-700 bg-gray-200 h-10 w-10"
                                aria-label="delete"
                                onClick={() => {
                                  deleteComponent(i);
                                }}
                              >
                                <Delete className="text-red-700" />
                              </IconButton>
                              <Drawer
                                anchor={"right"}
                                open={textOpen}
                                variant="temporary"
                                onClose={() => setTextOpen(false)}
                                ModalProps={{
                                  keepMounted: true,
                                }}
                              >
                                <Box
                                  sx={{ width: "right" && 500 }}
                                  role="presentation"
                                >
                                  <div className="flex flex-col py-10 px-10">
                                    <div className="flex items-center justify-between">
                                      <h1 className="text-3xl font-bold text-gray-700">
                                        Text Properties
                                      </h1>
                                      {/* <IconButton
                                        className="bg-gray-200 text-blue-700"
                                        onClick={() => setTextOpen(false)}
                                      >
                                        <Close />
                                      </IconButton> */}
                                    </div>

                                    <p className="text-lg mt-5 font-bold text-gray-500">
                                      Label
                                    </p>
                                    <input
                                      className="form-input w-96 mt-2 rounded-md shadow-sm  focus:ring-0 "
                                      type={formData[i].inputType}
                                      placeholder="Enter text"
                                      value={formData[i].labelText}
                                      onChange={(e) =>
                                        changeLabelText(e.target.value, i)
                                      }
                                    />

                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={formData[i].style.label}
                                          onChange={() => handleLabel(i)}
                                          inputprops={{
                                            "aria-label": "controlled",
                                          }}
                                        />
                                      }
                                      label="Hide Label"
                                    />

                                    <p className="text-lg font-bold text-gray-500">
                                      Placeholder
                                    </p>
                                    <input
                                      className="form-input w-96 mt-2 mb-5 rounded-sm   focus:ring-0 "
                                      placeholder="Enter placeholder text"
                                      type={formData[i].inputType}
                                      value={formData[i].placeholderText}
                                      onChange={(e) =>
                                        changePlaceHolderText(e.target.value, i)
                                      }
                                    />

                                    <p className="text-lg font-bold text-gray-500">
                                      Initial Value
                                    </p>
                                    <input
                                      className="form-input w-96 mt-2 rounded-sm  focus:ring-0 "
                                      type={formData[i].inputType}
                                      value={formData[i].text}
                                      placeholder="Enter Initial Text"
                                      onChange={(e) =>
                                        changeText(e.target.value, i)
                                      }
                                    />

                                    <p className="mt-5 font-bold text-lg text-gray-500">
                                      Required
                                    </p>

                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={formData[i].required}
                                          onChange={() => changeRequired(i)}
                                          inputprops={{
                                            "aria-label": "controlled",
                                          }}
                                        />
                                      }
                                      label="Required"
                                    />

                                    <p className="mt-5 text-lg font-bold text-gray-500">
                                      Text Style
                                    </p>
                                    <div className="flex w-96 space-x-2 mt-2">
                                      <div
                                        onClick={() => changeWeight(i)}
                                        className={`${
                                          formData[i].style.weight &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border text-center text-gray-500 border-gray-500 text-lg rounded-xl shadow-lg font-bold cursor-pointer`}
                                      >
                                        Bold
                                      </div>
                                      <div
                                        onClick={() => changeItalic(i)}
                                        className={`${
                                          formData[i].style.italic &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border text-center text-gray-500 border-gray-500 text-lg rounded-xl shadow-lg font-bold cursor-pointer`}
                                      >
                                        Italic
                                      </div>
                                      <div
                                        onClick={() => changeUnderline(i)}
                                        className={`${
                                          formData[i].style.underline &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border text-center text-gray-500 border-gray-500 text-lg rounded-xl shadow-lg font-bold cursor-pointer`}
                                      >
                                        Underline
                                      </div>
                                    </div>

                                    <div className="flex items-center mt-5 space-x-3">
                                      <div
                                        onClick={() => {
                                          deleteComponent(i),
                                            setTextOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg bg-white text-red-700 px-6 border border-red-700 cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-base font-medium">
                                          Delete
                                        </p>
                                        <DeleteForever />
                                      </div>

                                      <div
                                        onClick={() => {
                                          setTextOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg text-white bg-blue-500 px-6 border  cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-base font-medium px-4">
                                          Save
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Box>
                              </Drawer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            // ** number
            case "number":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full mb-0 flex justify-center">
                            <DragIndicatorIcon
                              className={`rotate-90 ${
                                snapshot.isDragging && "text-green-400"
                              }`}
                            />
                          </div>
                          <div
                            key={i}
                            className={`${
                              snapshot.isDragging &&
                              "border-green-300 border-2 border-dashed bg-opacity-10"
                            } w-full flex space-x-3 items-center px-6 py-6 rounded-lg space-y-3 bg-white shadow-lg h-fit mb-5`}
                          >
                            <div
                              key={"right"}
                              onClick={() => setNumericOpen(true)}
                              className="flex flex-col flex-1"
                            >
                              {!formData[i].style.label ? (
                                <div className="w-full">
                                  <input
                                    type="text"
                                    disabled
                                    placeholder="Number"
                                    value={formData[i].labelText}
                                    className="w-full form-input bg-transparent border-0 outline-0 font-semibold text-gray-600 focus:ring-0 focus:border-b-2 -ml-3"
                                  />
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="w-full flex ">
                                <input
                                  className={`

                    ${form.style.fontSize === "xl" ? "text-2xl" : ""}
                    ${form.style.fontSize === "4xl" ? "text-4xl" : ""}
                    ${form.style.fontSize === "lg" ? "text-lg" : ""}
                    ${form.style.fontSize === "" ? "text-lg" : ""}

                    ${form.style.alignment === "start" ? "text-start" : ""}
                    ${form.style.alignment === "center" ? "text-center" : ""}
                    ${form.style.alignment === "end" ? "text-end" : ""}
                    ${form.style.alignment === "" ? "text-start" : ""}
                   
                   
                    
                    
                   ${!formData[i].style.weight ? "font-medium" : `font-bold`} ${
                                    !formData[i].style.italic
                                      ? "not-italic"
                                      : "italic"
                                  } ${
                                    !formData[i].style.underline
                                      ? "no-underline"
                                      : "underline"
                                  } "form-input w-full text-${
                                    formData[i].style.fontSize
                                  }  focus:ring-0 focus:outline-0 bg-transparent rounded-md focus:border-gray-500`}
                                  type={formData[i].inputType}
                                  placeholder={formData[i].placeholderText}
                                  value={formData[i].text}
                                  readOnly
                                  // onChange={(e) => changeText(e.target.value, i)}
                                />
                              </div>
                            </div>

                            <div
                              key={"right"}
                              className="flex items-center space-x-2 justify-center   "
                            >
                              <IconButton
                                className="h-10 w-10 bg-gray-200 text-green-700"
                                onClick={() => setNumericOpen(true)}
                              >
                                <Settings className="text-green-700" />
                              </IconButton>
                              <IconButton
                                className="text-red-700 bg-gray-200 h-10 w-10"
                                aria-label="delete"
                                onClick={() => {
                                  deleteComponent(i);
                                }}
                              >
                                <Delete className="text-red-700" />
                              </IconButton>
                              <Drawer
                                anchor={"right"}
                                open={numericOpen}
                                variant="temporary"
                                onClose={() => setNumericOpen(false)}
                              >
                                <Box
                                  sx={{ width: "right" && 500 }}
                                  role="presentation"
                                >
                                  <div className="flex flex-col py-10 px-10">
                                    <div className="flex items-center justify-between">
                                      <h1 className="text-3xl font-bold text-gray-700">
                                        Number Properties
                                      </h1>
                                      {/* <IconButton
                                        className="bg-gray-200 text-gray-700 "
                                        onClick={() => setNumericOpen(false)}
                                      >
                                        <Close />
                                      </IconButton> */}
                                    </div>

                                    <p className="text-lg mt-5 font-bold text-gray-500">
                                      Label
                                    </p>
                                    <input
                                      className="form-input w-96 mt-2  rounded-sm focus:ring-0 "
                                      type="text"
                                      placeholder="Enter label"
                                      value={formData[i].labelText}
                                      onChange={(e) =>
                                        changeLabelText(e.target.value, i)
                                      }
                                    />

                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={formData[i].style.label}
                                          onChange={() => handleLabel(i)}
                                          inputprops={{
                                            "aria-label": "controlled",
                                          }}
                                        />
                                      }
                                      label="Hide Label"
                                    />

                                    <p className="text-lg font-bold text-gray-500">
                                      Placeholder
                                    </p>
                                    <input
                                      className="form-input w-96 mt-2 mb-5   focus:ring-0 "
                                      type="text"
                                      value={formData[i].placeholderText}
                                      placeholder="Enter placeholder"
                                      onChange={(e) =>
                                        changePlaceHolderText(e.target.value, i)
                                      }
                                    />

                                    <p className="text-lg font-bold text-gray-500">
                                      Initial Value
                                    </p>
                                    <input
                                      className="form-input w-96 mt-2   focus:ring-0 "
                                      type={formData[i].inputType}
                                      placeholder="Enter Initial Value"
                                      value={formData[i].text}
                                      onChange={(e) =>
                                        changeText(e.target.value, i)
                                      }
                                    />

                                    <p className="mt-5 font-bold text-lg text-gray-500">
                                      Required Field
                                    </p>

                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={formData[i].required}
                                          onChange={() => changeRequired(i)}
                                          inputprops={{
                                            "aria-label": "controlled",
                                          }}
                                        />
                                      }
                                      label="Required"
                                    />

                                    <p className="mt-5 text-lg font-bold text-gray-500">
                                      Text Style
                                    </p>
                                    <div className="flex w-96 space-x-2 mt-2">
                                      <div
                                        onClick={() => changeWeight(i)}
                                        className={`${
                                          formData[i].style.weight &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Bold
                                      </div>
                                      <div
                                        onClick={() => changeItalic(i)}
                                        className={`${
                                          formData[i].style.italic &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Italic
                                      </div>
                                      <div
                                        onClick={() => changeUnderline(i)}
                                        className={`${
                                          formData[i].style.underline &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Underline
                                      </div>
                                    </div>

                                    <div className="flex items-center mt-5 space-x-3">
                                      <div
                                        onClick={() => {
                                          deleteComponent(i),
                                            setNumericOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg bg-white text-red-700 px-6 border border-red-700 cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-base font-medium">
                                          Delete
                                        </p>
                                        <DeleteForever />
                                      </div>

                                      <div
                                        onClick={() => {
                                          setNumericOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg text-white bg-blue-500 px-6 border  cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-base font-medium px-4">
                                          Save
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Box>
                              </Drawer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            // ** multiline
            case "multiline":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full mb-0 flex justify-center">
                            <DragIndicatorIcon
                              className={`rotate-90 ${
                                snapshot.isDragging && "text-green-400"
                              }`}
                            />
                          </div>
                          <div
                            key={i}
                            className={`${
                              snapshot.isDragging &&
                              "border-green-400 border-2 border-dashed bg-opacity-10"
                            } w-full flex space-x-3 items-center px-6 py-6 space-y-3 rounded-lg bg-white shadow-lg h-fit mb-5`}
                          >
                            <div
                              key={"right"}
                              onClick={() => setMultilineOpen(true)}
                              className="flex flex-col flex-1"
                            >
                              {!formData[i].style.label ? (
                                <div className="w-full">
                                  <input
                                    type="text"
                                    disabled
                                    placeholder="Multiline"
                                    value={formData[i].labelText}
                                    className="w-full bg-transparent text-gray-600 form-input border-0 outline-0 font-semibold focus:ring-0 focus:border-b-2 -ml-3"
                                  />
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="w-full flex ">
                                <textarea
                                  rows="3"
                                  className="w-full h-20 bg-transparent rounded-md"
                                  disabled
                                  placeholder={formData[i].placeholderText}
                                  value={formData[i].text}
                                ></textarea>
                              </div>
                            </div>

                            <div
                              key={"right"}
                              className="flex items-center justify-center space-x-2  "
                            >
                              <IconButton
                                className="h-10 w-10 bg-gray-200 text-green-700"
                                onClick={() => setMultilineOpen(true)}
                              >
                                <Settings className="text-green-700" />
                              </IconButton>
                              <IconButton
                                className="text-red-700 bg-gray-200 h-10 w-10"
                                aria-label="delete"
                                onClick={() => {
                                  deleteComponent(i);
                                }}
                              >
                                <Delete className="text-red-700" />
                              </IconButton>
                              <Drawer
                                anchor={"right"}
                                open={multilineOpen}
                                variant="temporary"
                                onClose={() => setMultilineOpen(false)}
                                ModalProps={{
                                  keepMounted: true,
                                }}
                              >
                                <Box
                                  sx={{ width: "right" && 500 }}
                                  role="presentation"
                                >
                                  <div className="flex flex-col py-10 px-10">
                                    <div className="flex items-center justify-between">
                                      <h1 className="text-3xl font-bold text-gray-700">
                                        Multiline Properties
                                      </h1>
                                      {/* <IconButton
                                        className="bg-gray-200 text-black"
                                        onClick={() => setMultilineOpen(false)}
                                      >
                                        <Close />
                                      </IconButton> */}
                                    </div>

                                    <p className="text-lg mt-5 font-bold text-gray-500">
                                      Label
                                    </p>
                                    <input
                                      className="form-input w-96 mt-2 rounded-md  focus:ring-0 "
                                      type="text"
                                      placeholder="Enter label"
                                      value={formData[i].labelText}
                                      onChange={(e) =>
                                        changeLabelText(e.target.value, i)
                                      }
                                    />

                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={formData[i].style.label}
                                          onChange={() => handleLabel(i)}
                                          inputprops={{
                                            "aria-label": "controlled",
                                          }}
                                        />
                                      }
                                      label="Hide Label"
                                    />

                                    <p className="text-lg font-bold text-gray-500">
                                      Placeholder
                                    </p>
                                    <input
                                      className="form-input w-96 mt-2 mb-5 rounded-md  focus:ring-0 "
                                      placeholder="Enter placeholder text"
                                      type="text"
                                      value={formData[i].placeholderText}
                                      onChange={(e) =>
                                        changePlaceHolderText(e.target.value, i)
                                      }
                                    />

                                    <p className="text-lg font-bold text-gray-500 mb-2">
                                      Initial Value
                                    </p>

                                    <textarea
                                      className="w-96 rounded-md"
                                      rows="5"
                                      value={formData[i].text}
                                      onChange={(e) =>
                                        changeText(e.target.value, i)
                                      }
                                    ></textarea>

                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={formData[i].required}
                                          onChange={() => changeRequired(i)}
                                          inputProps={{
                                            "aria-label": "controlled",
                                          }}
                                        />
                                      }
                                      label="Required"
                                    />

                                    <p className="mt-5 text-lg font-bold text-gray-500">
                                      Text Style
                                    </p>
                                    <div className="flex w-96 space-x-2 mt-2">
                                      <div
                                        onClick={() => changeWeight(i)}
                                        className={`${
                                          formData[i].style.weight &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Bold
                                      </div>
                                      <div
                                        onClick={() => changeItalic(i)}
                                        className={`${
                                          formData[i].style.italic &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Italic
                                      </div>
                                      <div
                                        onClick={() => changeUnderline(i)}
                                        className={`${
                                          formData[i].style.underline &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Underline
                                      </div>
                                    </div>

                                    <div className="flex items-center mt-5 space-x-3">
                                      <div
                                        onClick={() => {
                                          deleteComponent(i),
                                            setMultilineOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg bg-white text-red-700 px-6 border border-red-700 cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-base font-medium">
                                          Delete
                                        </p>
                                        <DeleteForever />
                                      </div>

                                      <div
                                        onClick={() => {
                                          setMultilineOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg text-white bg-blue-500 px-6 border  cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-base font-medium px-4">
                                          Save
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Box>
                              </Drawer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            // !! add new radio in the form UI
            case "radio":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full mb-0 flex justify-center">
                            <DragIndicatorIcon
                              className={`rotate-90  ${
                                snapshot.isDragging && "text-green-400 "
                              }`}
                            />
                          </div>
                          <div
                            className={`${
                              snapshot.isDragging &&
                              "border-green-400 border-2 bg-opacity-10"
                            } flex items-center justify-between px-10 rounded-lg bg-white h-auto py-8 mb-5 shadow-md`}
                          >
                            <div
                              className="w-full flex flex-col cursor-pointer  "
                              // onClick={() => setRadioOpen(true)}
                              onClick={() => handleRadioDialog(i)}
                            >
                              <div className="flex items-center space-x-1">
                                <input
                                  type="text"
                                  className={`
                  ${form.style.fontSize === "xl" ? "text-2xl" : ""}
                    ${form.style.fontSize === "4xl" ? "text-4xl" : ""}
                    ${form.style.fontSize === "lg" ? "text-lg" : ""}
                    ${form.style.fontSize === "" ? "text-2xl" : ""}

                   
                    
                   ${!formData[i].style.weight ? "font-medium" : `font-bold`} ${
                                    !formData[i].style.italic
                                      ? "not-italic"
                                      : "italic"
                                  } ${
                                    !formData[i].style.underline
                                      ? "no-underline"
                                      : "underline"
                                  } "form-input w-full bg-transparent -ml-3  outline-0 border-0  focus:ring-0 focus:border-b-2"`}
                                  value={formData[i].text}
                                  placeholder="Question"
                                  disabled
                                />
                              </div>

                              {form.options.map((op, j) => (
                                <div
                                  key={j}
                                  className="flex items-center space-x-2 mt-1"
                                >
                                  <div className="flex items-center  w-96 space-x-2">
                                    <input
                                      type={formData[i].inputType}
                                      disabled
                                    />

                                    <input
                                      type="text"
                                      className="form-input w-full bg-transparent border-0 focus:ring-0"
                                      placeholder="option"
                                      value={form.options[j].optionText}
                                      // onChange={(e) => {
                                      //   changeOptionValue(e.target.value, i, j);
                                      // }}

                                      disabled
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center space-x-2 justify-end">
                              <div
                                onClick={() => handleRadioDialog(i)}
                                className="bg-gray-200 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 text-green-500 hover:text-green-700 duration-200 ease-out"
                              >
                                <BsPencilSquare className="h-6 w-6" />
                              </div>
                              <div
                                className="bg-gray-200 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 text-red-500 hover:text-red-700 duration-200 ease-out"
                                onClick={() => {
                                  deleteComponent(i);
                                }}
                              >
                                <Delete />
                              </div>

                              {/* radio properties */}
                              <Drawer
                                anchor={"right"}
                                open={radioOpen}
                                variant="temporary"
                                onClose={() => {
                                  setRadioOpen(false);
                                }}
                                ModalProps={{
                                  keepMounted: true,
                                }}
                              >
                                <Box
                                  sx={{ width: "right" && 500 }}
                                  role="presentation"
                                >
                                  <div className="flex flex-col py-10 px-10 rounded-md">
                                    <div className="flex items-center justify-between">
                                      <h1 className="text-3xl font-bold text-gray-700">
                                        Radio Properties
                                      </h1>

                                      {/* <IconButton
                                        className="bg-gray-200 text-gray-700"
                                        onClick={() => setRadioOpen(false)}
                                      >
                                        <Close />
                                      </IconButton> */}
                                    </div>

                                    {/* <p className="text-lg mt-5 font-bold text-gray-500">
                                      Question No
                                    </p>
                                    <input
                                      type="number"
                                      className="text-input bg-transparent focus:ring-0 w-96 h-fit mt-2"
                                      placeholder="1"
                                      value={formData[radioIndex]?.questionNo}
                                      onChange={(e) => {
                                        changeQuestionNumber(
                                          e.target.value,
                                          radioIndex
                                        );
                                      }}
                                    /> */}

                                    <p className="text-lg mt-5 font-medium text-gray-500">
                                      Question
                                    </p>
                                    <textarea
                                      className="form-input w-96 mt-2 mb-5 rounded-md  shadow-sm focus:ring-gray-600  "
                                      type="text"
                                      placeholder="Enter question "
                                      value={formData[radioIndex]?.text}
                                      onChange={(e) =>
                                        changeRadioQuestion(
                                          e.target.value,
                                          radioIndex
                                        )
                                      }
                                    />

                                    <p className="text-lg font-medium text-gray-500">
                                      Options
                                    </p>
                                    {formData[radioIndex]?.options?.map(
                                      (op, j) => (
                                        <div
                                          key={j}
                                          className="flex items-center space-x-2 mt-3"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="text"
                                              className="text-input rounded-md focus:ring-gray-600"
                                              placeholder="option"
                                              value={
                                                formData[radioIndex]?.options[j]
                                                  .optionText
                                              }
                                              onChange={(e) => {
                                                changeOptionValue(
                                                  e.target.value,
                                                  radioIndex,
                                                  j
                                                );
                                              }}
                                            />

                                            <input
                                              type="number"
                                              className="text-input rounded-md  focus:ring-0 w-full h-fit text-center"
                                              placeholder="option"
                                              disabled
                                              value={
                                                formData[radioIndex]?.options[j]
                                                  .weightage
                                              }
                                              onChange={(e) => {
                                                changeWeightageValue(
                                                  e.target.value,
                                                  i,
                                                  j
                                                );
                                              }}
                                            />

                                            <IconButton
                                              className="bg-gray-200"
                                              aria-label="delete"
                                            >
                                              <DeleteForever
                                                className="text-red-500"
                                                onClick={() =>
                                                  removeOption(radioIndex, j)
                                                }
                                              />
                                            </IconButton>
                                          </div>
                                        </div>
                                      )
                                    )}

                                    {form.options.length < 10 ? (
                                      <div className="flex items-center mt-5">
                                        <FormControlLabel
                                          disabled
                                          control={
                                            form.inputType !== "text" ? (
                                              <input
                                                type={form.inputType}
                                                color="primary"
                                                // inputprops={{
                                                //   "aria-label":
                                                //     "secondary checkbox",
                                                // }}
                                                style={{
                                                  marginLeft: "10px",
                                                  marginRight: "10px",
                                                }}
                                                disabled
                                              />
                                            ) : (
                                              <ShortTextTwoTone
                                                style={{ marginRight: "10px" }}
                                              />
                                            )
                                          }
                                          label={
                                            <div>
                                              <Button
                                                size="small"
                                                variant="outlined"
                                                style={{
                                                  textTransform: "none",
                                                  color: "#4285F4",
                                                  fontSize: "13px",
                                                  fontWeight: "600",
                                                  marginLeft: "10px",
                                                }}
                                                onClick={() =>
                                                  addOption(radioIndex)
                                                }
                                              >
                                                Add Option
                                              </Button>
                                            </div>
                                          }
                                        />
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    <div className="flex items-center space-x-2 mt-5">
                                      <p className="font-medium text-lg text-gray-500">
                                        Required
                                      </p>

                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={formData[i].required}
                                            onChange={() => changeRequired(i)}
                                            inputprops={{
                                              "aria-label": "controlled",
                                            }}
                                          />
                                        }
                                      />
                                    </div>

                                    <p className="mt-5 text-lg font-medium text-gray-500">
                                      Text Style
                                    </p>
                                    <div className="flex w-96 space-x-2 mt-2">
                                      <div
                                        onClick={() => changeWeight(i)}
                                        className={`${
                                          formData[i].style.weight &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Bold
                                      </div>
                                      <div
                                        onClick={() => changeItalic(i)}
                                        className={`${
                                          formData[i].style.italic &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Italic
                                      </div>
                                      <div
                                        onClick={() => changeUnderline(i)}
                                        className={`${
                                          formData[i].style.underline &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Underline
                                      </div>
                                    </div>

                                    {/* <h1 className="text-lg font-bold mt-5 text-gray-500">
                                      Duplicate
                                    </h1> */}

                                    {/* <h1 className="text-lg font-bold mt-5 text-gray-500">
                                      Delete
                                    </h1> */}

                                    <div className="flex items-center mt-5 justify-between">
                                      <div
                                        onClick={() => {
                                          duplicateRadio(radioIndex);
                                          setRadioOpen(false);
                                        }}
                                        className="max-w-fit flex items-center shadow-lg rounded-md bg-white text-green-500 py-3 px-4 border border-green-500 cursor-pointer mt-2 space-x-2"
                                      >
                                        <ContentCopyTwoTone />
                                        <p className="text-base font-medium">
                                          Duplicate
                                        </p>
                                      </div>
                                      <div
                                        onClick={() => {
                                          deleteComponent(radioIndex),
                                            setRadioOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg bg-white text-red-700 px-6 border border-red-700 cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-base font-medium">
                                          Delete
                                        </p>
                                        <DeleteForever />
                                      </div>

                                      <div
                                        onClick={() => {
                                          setRadioOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg text-white bg-blue-500 px-6 border  cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-base font-medium px-4">
                                          Save
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Box>
                              </Drawer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            // !! add a new checkbox in form UI
            case "checkbox":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full mb-0 flex justify-center">
                            <DragIndicatorIcon
                              className={`rotate-90  ${
                                snapshot.isDragging && "text-green-400 "
                              }`}
                            />
                          </div>
                          <div
                            className={`${
                              snapshot.isDragging &&
                              "border-green-400 border-2 bg-opacity-10"
                            } flex items-center justify-between px-10 bg-white h-auto py-6 rounded-lg mb-5 shadow-lg`}
                          >
                            <div
                              className="w-full flex flex-col cursor-pointer  "
                              onClick={() => setCheckboxOpen(true)}
                            >
                              <div className="flex items-center space-x-1">
                                {/* {formData[i].questionNo === 0 ? (
                                  ""
                                ) : (
                                  <p className="font-bold">
                                    {formData[i].questionNo}.
                                  </p>
                                )} */}
                                <input
                                  type="text"
                                  className={`
                  ${form.style.fontSize === "xl" ? "text-2xl" : ""}
                    ${form.style.fontSize === "4xl" ? "text-4xl" : ""}
                    ${form.style.fontSize === "lg" ? "text-lg" : ""}
                    ${form.style.fontSize === "" ? "text-2xl" : ""}

                   
                    
                   ${!formData[i].style.weight ? "font-medium" : `font-bold`} ${
                                    !formData[i].style.italic
                                      ? "not-italic"
                                      : "italic"
                                  } ${
                                    !formData[i].style.underline
                                      ? "no-underline"
                                      : "underline"
                                  } "form-input w-full bg-transparent -ml-3  outline-0 border-0  focus:ring-0 focus:border-b-2"`}
                                  value={formData[i].text}
                                  placeholder="Question"
                                  disabled
                                />
                              </div>
                              {form.options.map((op, j) => (
                                <div
                                  key={j}
                                  className="flex items-center space-x-2 mt-2"
                                >
                                  {form.inputType !== "text" ? (
                                    <input
                                      className="bg-transparent"
                                      type={form.inputType}
                                    />
                                  ) : (
                                    <ShortTextTwoTone
                                      style={{ marginRight: "10px" }}
                                    />
                                  )}

                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      className="text_input bg-transparent w-96 border-0 focus:ring-0"
                                      placeholder="option"
                                      value={form.options[j].optionText}
                                      // onChange={(e) => {
                                      //   changeOptionValue(e.target.value, i, j);
                                      // }}

                                      disabled
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center space-x-2 justify-end">
                              <div
                                onClick={() => setCheckboxOpen(true)}
                                className="bg-gray-200 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 text-green-500 hover:text-green-700 duration-200 ease-out"
                              >
                                <BsPencilSquare />
                              </div>
                              <div
                                className="bg-gray-200 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-300 text-red-500 hover:text-red-700 duration-200 ease-out"
                                onClick={() => {
                                  deleteComponent(i);
                                }}
                              >
                                <Delete />
                              </div>
                              <Drawer
                                anchor={"right"}
                                open={checkboxOpen}
                                variant="temporary"
                                onClose={() => {
                                  setCheckboxOpen(false);
                                }}
                                ModalProps={{
                                  keepMounted: true,
                                }}
                              >
                                <Box
                                  sx={{ width: "right" && 500 }}
                                  role="presentation"
                                >
                                  <div className="flex flex-col py-10 px-10">
                                    <div className="flex items-center justify-between">
                                      <h1 className="text-3xl font-bold text-gray-700">
                                        Checkbox Properties
                                      </h1>
                                      {/* <IconButton
                                        className="bg-gray-200 text-gray-700"
                                        onClick={() => setCheckboxOpen(false)}
                                      >
                                        <Close />
                                      </IconButton> */}
                                    </div>

                                    <p className="text-lg mt-5 font-medium text-gray-500">
                                      Question
                                    </p>
                                    <textarea
                                      className="form-input w-96 mt-2 mb-5   focus:ring-gray-500 rounded-md "
                                      type="text"
                                      placeholder="Enter text"
                                      value={formData[i].text}
                                      onChange={(e) =>
                                        changeRadioQuestion(e.target.value, i)
                                      }
                                    />

                                    <p className="text-lg font-medium text-gray-500">
                                      Options
                                    </p>
                                    {form.options.map((op, j) => (
                                      <div
                                        key={j}
                                        className="flex items-center  space-x-2 mt-3"
                                      >
                                        {form.inputType !== "text" ? (
                                          <input type={form.inputType} />
                                        ) : (
                                          <ShortTextTwoTone
                                            style={{ marginRight: "10px" }}
                                          />
                                        )}

                                        <div className="flex items-center w-96 space-x-2">
                                          <input
                                            type="text"
                                            className="text-input rounded-md w-96 focus:ring-0"
                                            placeholder="option"
                                            value={form.options[j].optionText}
                                            onChange={(e) => {
                                              changeOptionValue(
                                                e.target.value,
                                                i,
                                                j
                                              );
                                            }}
                                          />

                                          <IconButton
                                            className="bg-gray-200"
                                            aria-label="delete"
                                          >
                                            <DeleteForever
                                              className="text-red-500"
                                              onClick={() => removeOption(i, j)}
                                            />
                                          </IconButton>
                                        </div>
                                      </div>
                                    ))}

                                    {form.options.length < 5 ? (
                                      <div className="flex items-center mt-5">
                                        <FormControlLabel
                                          disabled
                                          control={
                                            form.inputType !== "text" ? (
                                              <input
                                                type={form.inputType}
                                                color="primary"
                                                // inputprops={{
                                                //   "aria-label":
                                                //     "secondary checkbox",
                                                // }}
                                                style={{
                                                  marginLeft: "10px",
                                                  marginRight: "10px",
                                                }}
                                                disabled
                                              />
                                            ) : (
                                              <ShortTextTwoTone
                                                style={{ marginRight: "10px" }}
                                              />
                                            )
                                          }
                                          label={
                                            <div>
                                              <Button
                                                size="small"
                                                variant="outlined"
                                                style={{
                                                  textTransform: "none",
                                                  color: "#4285F4",
                                                  fontSize: "13px",
                                                  fontWeight: "600",
                                                  marginLeft: "10px",
                                                }}
                                                onClick={() =>
                                                  addCheckboxOption(i)
                                                }
                                              >
                                                Add Option
                                              </Button>
                                            </div>
                                          }
                                        />
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    <div className="flex items-center space-x-2 mt-5">
                                      <p className="font-medium text-lg text-gray-500">
                                        Required
                                      </p>

                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={formData[i].required}
                                            onChange={() => changeRequired(i)}
                                            inputprops={{
                                              "aria-label": "controlled",
                                            }}
                                          />
                                        }
                                      />
                                    </div>

                                    <p className="mt-5 text-lg font-bold text-gray-500">
                                      Text Style
                                    </p>
                                    <div className="flex w-96 space-x-2 mt-2">
                                      <div
                                        onClick={() => changeWeight(i)}
                                        className={`${
                                          formData[i].style.weight &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Bold
                                      </div>
                                      <div
                                        onClick={() => changeItalic(i)}
                                        className={`${
                                          formData[i].style.italic &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Italic
                                      </div>
                                      <div
                                        onClick={() => changeUnderline(i)}
                                        className={`${
                                          formData[i].style.underline &&
                                          "!border-blue-500 !text-blue-500"
                                        } w-32 py-3 px-4 border border-gray-700 text-gray-500 shadow-lg rounded-md text-center font-bold cursor-pointer`}
                                      >
                                        Underline
                                      </div>
                                    </div>

                                    {/* <h1 className="text-lg font-bold mt-5 text-gray-500">
                                      Duplicate Field
                                    </h1> */}
                                    {/* <div
                                      onClick={() =>
                                        duplicateCheckbox(radioIndex)
                                      }
                                      className="max-w-fit flex items-center shadow-lg rounded-md bg-green-500 text-white py-3 px-4 border cursor-pointer mt-2 space-x-2"
                                    >
                                      <ContentCopyTwoTone />
                                      <p className="text-lg font-black">
                                        Duplicate
                                      </p>
                                    </div> */}

                                    {/* <h1 className="text-lg font-bold mt-5 text-gray-500">
                                      Delete Field
                                    </h1> */}

                                    <div className="flex items-center justify-start mt-5 space-x-3">
                                      <div
                                        onClick={() => {
                                          deleteComponent(i),
                                            setCheckboxOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg bg-red-700 text-white px-6 border cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-lg font-bold">
                                          Delete
                                        </p>
                                        <DeleteForever />
                                      </div>

                                      <div
                                        onClick={() => {
                                          setCheckboxOpen(false);
                                        }}
                                        className="max-w-fit flex items-center py-3 rounded-md shadow-lg bg-blue-500 text-white px-6 border cursor-pointer mt-2 space-x-2"
                                      >
                                        <p className="text-lg px-6 font-bold">
                                          Save
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Box>
                              </Drawer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            case "range":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full mb-0">
                            <DragIndicatorIcon className="rotate-90" />
                          </div>
                          <div className="flex items-center justify-between  px-10 bg-white h-auto py-8 mb-5 shadow-lg">
                            <div className="flex flex-col">
                              <input
                                type="text"
                                className="form-input w-[35rem] border-0 flex-1 outline-0 focus:ring-0 focus:border-b-2 mb-5"
                                value={formData[i].text}
                                onChange={(e) => {
                                  changeText(e.target.value, i);
                                }}
                              />
                              <Slider
                                defaultValue={0}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                onChange={(e, value) => {
                                  updateRange(value, i);
                                }}
                              />
                            </div>

                            <IconButton
                              aria-label="delete"
                              onClick={() => {
                                deleteComponent(i);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            // !! add a new label in form UI
            case "label":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full flex items-center justify-center mb-0">
                            <DragIndicatorIcon
                              className={`rotate-90 ${
                                snapshot.isDragging && "text-green-500"
                              }`}
                            />
                          </div>
                          <div
                            className={`${
                              snapshot.isDragging &&
                              "border-green-300 border-2 border-dashed bg-opacity-10"
                            }
                              bg-white w-full flex space-x-3 rounded-lg items-center px-6 py-10 space-y-3  shadow-lg h-fit mb-5`}
                          >
                            <div className="w-full flex flex-col space-y-2">
                              <div className="flex space-x-5">
                                <input
                                  className="w-full bg-transparent text-input rounded-md"
                                  type="text"
                                  placeholder="Enter Label"
                                  value={formData[i].label}
                                  onChange={(e) =>
                                    changeLabel(i, e.target.value)
                                  }
                                />
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    deleteComponent(i);
                                  }}
                                >
                                  <Delete className="text-red-500" />
                                </IconButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            // !! add a name field in form UI
            case "name":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full flex items-center justify-center mb-0">
                            <DragIndicatorIcon
                              className={`rotate-90 ${
                                snapshot.isDragging && "text-green-500"
                              }`}
                            />
                          </div>
                          <div
                            className={`${
                              snapshot.isDragging &&
                              "border-green-300 border-2 border-dashed bg-opacity-10"
                            }
                              bg-white w-full flex space-x-3 items-center px-6 py-10 space-y-3  shadow-lg h-fit mb-5`}
                          >
                            <div className="w-full flex flex-col space-y-2">
                              <h1 className="font-medium">
                                {formData[i].label}
                              </h1>
                              <div className="flex space-x-5">
                                <input
                                  className="w-full bg-transparent rounded-md"
                                  type="text"
                                  placeholder="Enter name"
                                  value={formData[i].text}
                                  onChange={(e) =>
                                    changeCredential(i, e.target.value)
                                  }
                                />
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    deleteComponent(i);
                                  }}
                                >
                                  <Delete className="text-red-500" />
                                </IconButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            // !! add an email field i form UI
            case "email":
              return (
                <Draggable key={i} draggableId={i + "id"} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <div className="mb-0">
                          <div className="w-full mb-0 flex items-center justify-center">
                            <DragIndicatorIcon
                              className={`rotate-90 ${
                                snapshot.isDragging && "text-green-500"
                              }`}
                            />
                          </div>
                          <div
                            className={`${
                              snapshot.isDragging &&
                              "border-green-300 border-2 border-dashed bg-opacity-10"
                            }
                              bg-white w-full flex space-x-3 items-center px-6 py-10 space-y-3  shadow-lg h-fit mb-5`}
                          >
                            <div className="w-full flex flex-col space-y-2">
                              <h1>{formData[i].label}</h1>
                              <div className="flex space-x-5">
                                <input
                                  className="w-full bg-transparent rounded-md text-input"
                                  type="text"
                                  placeholder="Enter email"
                                  value={formData[i].text}
                                  onChange={(e) =>
                                    changeCredential(i, e.target.value)
                                  }
                                />
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    deleteComponent(i);
                                  }}
                                >
                                  <Delete className="text-red-500" />
                                </IconButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );

            default:
              return <h1>Add a new form</h1>;
          }
        })}
      </div>
    );
  };

  // ! Form Builder UI
  return (
    <>
      <div className="max-w-screen relative  flex-1 h-auto">
        <FormHeader title={formName || "Untitled"} />
        <div className="flex relative justify-between">
          <div
            className={` w-[20rem] 
            bg-white border  fixed top-14 py-8 px-8 h-screen`}
          >
            {/* <h1 className="mb-5 font-semibold text-gray-800 text-xl">
            Form Fields
          </h1> */}
            <div
              className={`grid-cols-2 grid
              gap-4`}
            >
              <button
                onClick={() => newLabel()}
                className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
              >
                <div className="flex items-center">
                  <BsInputCursor className="mr-2 text-2xl" />
                  <h1 className="text-sm font-semibold">Label</h1>
                </div>
              </button>

              <button
                onClick={() => newRadio()}
                className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
              >
                <div className="flex items-center">
                  <BsUiRadios className="text-2xl mr-2" />
                  <h1 className="text-sm font-semibold mt-1">Radio</h1>
                </div>
              </button>

              <button
                onClick={() => newCheckBox()}
                className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
              >
                <div className="flex items-center">
                  <BsUiChecks className="text-2xl mr-2" />
                  <h1 className="text-sm font-semibold mt-1">Checkbox</h1>
                </div>
              </button>
              <button
                onClick={() => newText()}
                className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
              >
                <div className="flex items-center">
                  <BsInputCursor className="mr-2 text-2xl" />
                  <h1 className="text-sm font-semibold">Text</h1>
                </div>
              </button>

              <button
                className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
                onClick={() => newTextNumeric()}
              >
                <div className="flex items-center">
                  <TiSortNumerically className="mr-2 text-2xl" />
                  <h1 className="text-sm font-semibold mt-1">Number</h1>
                </div>
              </button>

              <button
                className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
                onClick={() => newMultiline()}
              >
                <div className="flex items-center">
                  <BsTextareaResize className="mr-2 text-2xl" />
                  <h1 className="text-sm font-semibold mt-1">Multiline</h1>
                </div>
              </button>

              {/* <button
              onClick={() => newRange()}
              className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
              disabled
            >
              Range
            </button> */}

              <button
                onClick={() => newName()}
                className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
              >
                <div className="flex items-center">
                  <BsPersonCircle className="text-2xl mr-2" />
                  <h1 className="text-sm font-semibold mt-1">Name</h1>
                </div>
              </button>

              <button
                onClick={() => newEmail()}
                className="w-32 py-3 px-4 rounded-md shadow-lg border-2 border-blue-500 text-blue-600 text-xs font-bold "
              >
                <div className="flex items-center">
                  <HiMail className="text-2xl mr-2" />
                  <h1 className="text-sm font-semibold mt-1">Email</h1>
                </div>
              </button>

              <button
                disabled={formData.length < 1}
                className={`${
                  formData.length < 1 && "shadow-none text-gray-600 bg-gray-300"
                } w-full shadow-xl col-span-2 py-3 px-4 rounded-md  text-gray-600 bg-blue-700 font-bold border-blue-500`}
                onClick={handleClickOpen}
              >
                <div className="flex items-center justify-center">
                  <h1 className="text-sm font-bold mt-1 text-white">Preview</h1>
                  <VscPreview className="text-2xl ml-2 text-white" />
                </div>
              </button>
              <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
              >
                <AppBar sx={{ position: "fixed", top: "0" }}>
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleClose}
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography
                      sx={{ ml: 2, flex: 1 }}
                      variant="h6"
                      component="div"
                    >
                      {formId} (Preview)
                    </Typography>
                    <button
                      className="w-fit border-white border px-8 py-2 text-lg font-bold cursor-pointer"
                      onClick={() => handleSubmit()}
                    >
                      Save and Create
                    </button>
                  </Toolbar>
                </AppBar>
                <div className="max-w-screen bg-gray-50 h-auto">
                  <BootstrapDialog
                    onClose={handleCloses}
                    aria-labelledby="customized-dialog-title"
                    open={loading}
                  >
                    {completed ? (
                      <div className="w-96 flex flex-col py-10 items-center justify-center ">
                        <Lottie animationData={success} style={style} />
                        <p>Data uploaded successfully</p>
                      </div>
                    ) : (
                      <div className="w-96 h-auto py-6 flex flex-col items-center justify-center">
                        <RotatingLines
                          strokeColor="blue"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="60"
                          visible={true}
                        />
                        <p>Creating Form ...</p>
                      </div>
                    )}
                  </BootstrapDialog>
                  <div className="max-w-5xl mx-auto flex flex-col  rounded-lg  h-auto bg-white mt-20 shadow-md py-10 px-10 ">
                    <h1 className="text-2xl leading-none font-semibold text-gray-600">
                      {formName}{" "}
                    </h1>
                    <p className="text-sm mt-2  font-medium text-gray-500">
                      {formDescription}
                    </p>
                    <Box sx={{ minWidth: 120 }} className="mt-5">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Select Form Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={formType}
                          label="Select Form Type"
                          onChange={(e) => setFormType(e.target.value)}
                        >
                          <MenuItem value={"IPD"}>IPD</MenuItem>
                          <MenuItem value={"OPD"}>OPD</MenuItem>
                          <MenuItem value={"Doctor"}>Doctor</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <div className="flex items-center mt-2 justify-between">
                      <div className="flex flex-col space-y-2">
                        <h1 className="text-base text-gray-500">
                          Expected Feedback Weightage for management attention
                          (*)
                        </h1>
                        <input
                          className="text-input rounded-md bg-transparent"
                          type="number"
                          value={averageWeightage}
                          onChange={(e) => setAverageWeightage(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <h1 className="text-sm text-gray-500">
                          Minimum Weightage : {minimumWeightage}
                        </h1>
                        <h1 className="text-sm text-gray-500">
                          Maximum Weightage : {maximumWeightage}
                        </h1>
                      </div>
                    </div>

                    {formData.map((form, i) => {
                      switch (form.inputType) {
                        case "label":
                          return (
                            <div key={i}>
                              <div className="flex space-x-2 mt-5">
                                <h1 className="font-semibold text-gray-600">
                                  {formData[i].label}
                                </h1>
                              </div>
                            </div>
                          );

                        case "text":
                          return (
                            <div key={i}>
                              {!formData[i].style.label && (
                                <div className="flex space-x-2 mt-5">
                                  <h1 className="font-semibold text-gray-600">
                                    {formData[i].labelText}
                                  </h1>
                                  {formData[i].required && (
                                    <h1 className="font-semibold text-xl text-red-500 ">
                                      *
                                    </h1>
                                  )}
                                </div>
                              )}
                              <input
                                className=" border w-96 h-10 rounded-md shadow-md mt-1 border-gray-400 bg-transparent"
                                type="text"
                                value={formData[i].text}
                                placeholder={formData[i].placeholderText}
                                disabled
                              ></input>
                            </div>
                          );

                        case "number":
                          return (
                            <div key={i}>
                              {!formData[i].style.label && (
                                <div className="flex space-x-2 mt-5">
                                  <h1 className="font-semibold text-gray-600">
                                    {formData[i].labelText}
                                  </h1>
                                  {formData[i].required && (
                                    <h1 className="font-semibold text-xl text-red-500 ">
                                      *
                                    </h1>
                                  )}
                                </div>
                              )}
                              <input
                                className=" border w-96 h-10 border-gray-400 rounded-md shadow-md mt-1 bg-transparent"
                                type="text"
                                value={formData[i].text}
                                placeholder={formData[i].placeholderText}
                                disabled
                              ></input>
                            </div>
                          );

                        case "multiline":
                          return (
                            <div key={i}>
                              {!formData[i].style.label && (
                                <div className="flex space-x-2 mt-5">
                                  <h1 className="font-semibold text-gray-500">
                                    {formData[i].labelText}
                                  </h1>
                                  {formData[i].required && (
                                    <h1 className="font-semibold text-xl text-red-500 ">
                                      *
                                    </h1>
                                  )}
                                </div>
                              )}
                              <textarea
                                className=" border w-full rounded-md shadow-md mt-2 border-gray-400 bg-transparent"
                                rows="5"
                                value={formData[i].text}
                                placeholder={formData[i].placeholderText}
                                disabled
                              ></textarea>
                            </div>
                          );
                        case "name":
                          return (
                            <h1 className="font-bold mt-5" key={i}>
                              {formData[i].label} :{" "}
                              <span className="border-b-2 font-medium border-b-black">
                                {formData[i].text}
                              </span>
                            </h1>
                          );

                        case "email":
                          return (
                            <h1 className="font-bold mt-5" key={i}>
                              {formData[i].label} :{" "}
                              <span className="border-b-2 font-medium border-b-black">
                                {formData[i].text}
                              </span>
                            </h1>
                          );

                        case "radio":
                          return (
                            <div className="flex flex-col space-y-3 mt-5">
                              <div className="flex items-center space-x-3">
                                <h1
                                  key={i}
                                  className="font-semibold text-base text-gray-600 "
                                >
                                  {formData[i].text}
                                </h1>
                                {formData[i].required && (
                                  <p className="text-red-700">*</p>
                                )}
                              </div>

                              {form.options.map((option, j) => {
                                return (
                                  <div
                                    key={j}
                                    className="flex items-center  space-x-2"
                                  >
                                    <input
                                      type={formData[i].inputType}
                                      disabled
                                    />

                                    <p className="text-sm font-medium text-gray-500">
                                      {option.optionText}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          );

                        case "checkbox":
                          return (
                            <div className="flex flex-col mt-5 space-y-3">
                              <h1
                                key={i}
                                className="font-semibold text-base text-gray-600"
                              >
                                {formData[i].text}
                              </h1>
                              {form.options.map((option, j) => {
                                return (
                                  <div
                                    key={j}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type={formData[i].inputType}
                                      disabled
                                    />

                                    <p className="text-sm font-medium text-gray-500">
                                      {option.optionText}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          );

                        case "range":
                          return (
                            <div className="flex flex-col mt-5 space-y-3">
                              <h1 key={i}>{formData[i].text}</h1>
                              <Slider
                                defaultValue={formData[i].value}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                disabled={true}
                              />
                            </div>
                          );

                        default:
                          return <h1>Add a new form</h1>;
                      }
                    })}
                  </div>
                </div>
              </Dialog>
            </div>
          </div>
          <div className=" flex w-full h-auto justify-center flex-1">
            <div>
              <div className="bg-gray-50 w-[50rem] h-fit mt-10 ml-56 shadow-md  ">
                <div className="bg-blue-500 w-full h-3 rounded-t-md"></div>
                <div className=" pt-10 pb-10 px-10">
                  <input
                    type="text"
                    className="form-input bg-transparent text-4xl w-full border-0 outline-0 focus:ring-0  focus:border-b-2"
                    placeholder=" Title"
                    required="true"
                    onChange={(e) => setFormName(e.target.value)}
                  />

                  <textarea
                    rows="1"
                    className="form-input bg-transparent text-gray-600 text-base font-semibold w-full border-0 outline-0 focus:ring-0 mb-4 focus:border-b-2"
                    placeholder=" Form Description (Optional)"
                    onChange={(e) => setFormDescription(e.target.value)}
                  />

                  {/* Droppable area */}

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {formUI()}
                          <div ref={formEndRef}></div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormBody;
