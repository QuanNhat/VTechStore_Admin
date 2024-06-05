"use client";
import { compactNumber } from "@/utils/func";
import { ArcElement, Legend, Tooltip } from "chart.js";
import Chart from "chart.js/auto";
import { useState } from "react";
import { Line } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

interface IProps {
  labels: string[];
  values: any[];
}
export default function LineChart({ labels, values }: IProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Line
      className="h-full w-full"
      datasetIdKey="custom-chart"
      data={{
        labels: labels,
        datasets: [
          {
            borderColor: "#305DFF",
            borderWidth: 1,
            data: values,
            backgroundColor: (context) => {
              const bgColor = ["#53C1FF80", "#78CFFF00"];

              if (!context.chart.chartArea) return;
              const {
                ctx,
                chartArea: { top, bottom },
              } = context.chart;
              const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
              const colorTranches = 1 / (bgColor.length - 1);
              for (let i = 0; i < bgColor.length; i++) {
                gradientBg.addColorStop(0 + i * colorTranches, bgColor[i]);
              }

              return gradientBg;
            },
            pointBorderColor: "#fff",
            pointBackgroundColor: (context) => {
              const index = context.dataIndex;
              const activeColor = "#53C1FF"; // Color for the active/hovered point
              const defaultColor = "#305DFF"; // Default color for points

              return index === activeIndex ? activeColor : defaultColor;
            },
            pointStyle: "circle",
            pointRadius: 8,
            pointBorderWidth: 1,
            pointHoverBorderWidth: 2,
            pointHoverRadius: 10,
            fill: true,
          },
        ],
      }}
      options={{
        animation: {
          duration: 1000,
        },
        responsive: true, // Make sure this is set or left as default
        maintainAspectRatio: true, // Adjust this as needed,
        scales: {
          x: {
            border: {
              display: true,
              dash: [10, 6],
            },

            ticks: {
              font: {
                size: 14,
                family: "Inter",
                weight: 400,
              },
              color: (context) => {
                // Check if the current index matches the activeIndex
                return context.tick && context.index === activeIndex ? "#1F2124" : "#9F9EA4"; // Change 'red' to your desired active color
              },
            },
            grid: {
              // color: "#53C1FF",
              color: (context) => {
                // Change color if the index matches the activeIndex
                if (context.tick && context.index === activeIndex) {
                  return "#53C1FF"; // Highlight color
                }
                return "transparent"; // Default color
              },
            },
          },
          y: {
            border: {
              display: true,
            },

            beginAtZero: false,
            ticks: {
              font: {
                size: 11,
                family: "Inter",
                weight: 600,
              },
              color: "#9F9EA4",
              padding: 10,
              callback: (context: any) => {
                return compactNumber(context as number);
              },
            },
            grid: {
              color: "#E1E3EA",
            },
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },

        plugins: {
          title: {
            display: false,
            text: "Custom Chart Title",
            font: {
              size: 20,
              family: "Inter",
            },
          },

          legend: {
            display: false,
            labels: {
              color: "#FFF2F9",
              font: {
                size: 14,
                weight: "bold",
                family: "Inter",
              },
            },
          },

          tooltip: {
            position: "average",
            backgroundColor: "#1F2124",
            bodyColor: "#fff",
            bodyFont: {
              family: "Inter",
              size: 14,
              weight: 400,
            },
            caretPadding: 0,
            // callbacks: {
            //   label: function (context) {
            //     return `HOLDERS: ${compactNumber(context.parsed.y)}`;
            //   },
            //   title: function (context) {
            //     return `DATE: ${context[0].label}`;
            //   },
            // },
            callbacks: {
              labelTextColor(tooltipItem) {
                setActiveIndex(tooltipItem.dataIndex);
              },
            },
            displayColors: false,
            titleColor: "#fff",
            titleFont: {
              family: "Inter",
              size: 14,
              weight: 700,
            },
            yAlign: "bottom",
            cornerRadius: 4,
            xAlign: "center",
          },
        },
      }}
    />
  );
}