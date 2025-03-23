import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/eve.json")  
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        setData(json);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const processData = () => {
    const timestamps = {};
    const categories = {};
    const ports = {};
    const attackers = {};

    data.forEach((entry) => {
      const time = entry.timestamp.split("T")[1].split(":")[1];
      timestamps[time] = (timestamps[time] || 0) + 1;
      categories[entry.alert.category] = (categories[entry.alert.category] || 0) + 1;
      ports[entry.dest_port] = (ports[entry.dest_port] || 0) + 1;
      attackers[entry.src_ip] = (attackers[entry.src_ip] || 0) + 1;
    });

    return { timestamps, categories, ports, attackers };
  };

  const { timestamps, categories, ports, attackers } = processData();

  return (
    <div className="dashboard">
      <h1>Network Security Dashboard</h1>
      <div className="charts-container">
        <div className="chart">
          <h2>Attack Frequency Over Time</h2>
          <Line
            data={{
              labels: Object.keys(timestamps),
              datasets: [
                {
                  label: "Attacks per Minute",
                  data: Object.values(timestamps),
                  borderColor: "#ffcc00",
                  backgroundColor: "rgba(255, 204, 0, 0.2)",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
            }}
            height={175} 
          />
        </div>

        <div className="chart">
          <h2>Top Attack Categories</h2>
          <Pie
            data={{
              labels: Object.keys(categories),
              datasets: [
                {
                  data: Object.values(categories),
                  backgroundColor: ["#ff5733", "#33ff57", "#3357ff"],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              layout: {
                padding: {
                  top: 10,
                  bottom: 10,
                },
              },
            }}
            height={175} 
          />
        </div>

        <div className="chart">
          <h2>Most Targeted Ports</h2>
          <Bar
            data={{
              labels: Object.keys(ports),
              datasets: [
                {
                  label: "Attack Count",
                  data: Object.values(ports),
                  backgroundColor: "#ff3333",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
            }}
            height={175}
          />
        </div>

        <div className="chart">
          <h2>Most Frequent Attackers</h2>
          <Bar
            data={{
              labels: Object.keys(attackers),
              datasets: [
                {
                  label: "Attack Count",
                  data: Object.values(attackers),
                  backgroundColor: "#33aaff",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
            }}
            height={175}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
