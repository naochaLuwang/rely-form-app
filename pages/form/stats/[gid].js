import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import dbConnect from "../../../utils/db";

const GraphStats = ({ formFeedback }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: `${formFeedback[0]?.formName} Bar Chart`,
        font: { size: 24, color: "red" },
      },
    },
  };
  const labels = [];
  const datas = [];

  const getLables = () => {
    for (
      let i = formFeedback[0].minimumWeightage;
      i <= formFeedback[0].maximumWeightage;
      i++
    ) {
      labels.push(i);
      datas.push(0);
    }
  };

  getLables();

  // formFeedback[0].form[0].options.map((text) => {
  //   labels.push(text.optionText, -1);
  // });

  formFeedback.map((form, i) => {
    switch (form.overallScore) {
      case 1:
        datas[0] += 1;

        break;
      case 2:
        datas[1] += 1;
        break;
      case 3:
        datas[2] += 1;
        break;
      case 4:
        datas[3] += 1;
        break;
      case 5:
        datas[4] += 1;
        break;
      case 6:
        datas[5] += 1;
        break;
      case 7:
        datas[6] += 1;
        break;
      case 8:
        datas[7] += 1;
        break;
      case 9:
        datas[8] += 1;
        break;
      case 10:
        datas[9] += 1;

      default:
        break;
    }
  });

  console.log(datas);

  const data = {
    labels,
    datasets: [
      {
        label: "Submitted",
        data: datas,
        backgroundColor: "rgb(54, 162, 235 , 0.5)",
        borderColor: "rgb(54,162,235)",
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  console.log(formFeedback);
  return (
    <div className="max-w-6xl mx-auto mt-14 h-full">
      <Bar options={options} data={data} />
    </div>
  );
};

export default GraphStats;

export async function getServerSideProps(context) {
  const { params } = context;
  const { gid } = params;
  console.log(gid);

  await dbConnect();

  const response = await fetch(
    `https://rely-form.herokuapp.com/api/formFeedback/${gid}`
  );

  const data = await response.json();
  console.log(data);

  return {
    props: {
      // formFeedback: JSON.parse(JSON.stringify(data)),
      formFeedback: JSON.parse(JSON.stringify(data)),
    },
  };
}
