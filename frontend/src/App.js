import axios from "axios";
import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function App() {

  const [cityData, setCityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {

    // CITY-WISE API

    axios.get("/city-wise")
      .then((response) => {

        const formattedCityData = response.data.map((item) => ({
          city: item.city,
          total: Number(item.total)
        }));

        setCityData(formattedCityData);

      })
      .catch((error) => {
        console.log(error);
      });




    // CATEGORY-WISE API

    axios.get("/category-wise")
      .then((response) => {

        const formattedCategoryData = response.data.map((item) => ({
          category: item.category,
          total: Number(item.total)
        }));

        setCategoryData(formattedCategoryData);

      })
      .catch((error) => {
        console.log(error);
      });




    // SOURCE-WISE API

    axios.get("/source-wise")
      .then((response) => {

        const formattedSourceData = response.data.map((item) => ({
          source: item.source,
          total: Number(item.total)
        }));

        setSourceData(formattedSourceData);

      })
      .catch((error) => {
        console.log(error);
      });

  }, []);




  return (

    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: darkMode
          ? "linear-gradient(to right, #141e30, #243b55)"
          : "linear-gradient(to right, #f5f7fa, #c3cfe2)",
        color: darkMode ? "white" : "black",
        fontFamily: "Arial"
      }}
    >

      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "40px"
        }}
      >
        📊 Business Dashboard
      </h1>

      <div style={{ textAlign: "center" }}>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            marginBottom: "30px",
            background: darkMode ? "white" : "black",
            color: darkMode ? "black" : "white",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

      </div>




      {/* CITY BAR CHART */}

      <div
        style={{
          background: darkMode ? "white" : "#f0f0f0",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "40px",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.3)"
        }}
      >

        <h2
          style={{
            color: "black",
            textAlign: "center"
          }}
        >
          City-wise Business Count
        </h2>

        <div style={{ display: "flex", justifyContent: "center" }}>

          <BarChart
            width={700}
            height={400}
            data={cityData}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="city" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#00C49F"
            />

          </BarChart>

        </div>

      </div>




      {/* CATEGORY BAR CHART */}

      <div
        style={{
          background: darkMode ? "white" : "#f0f0f0",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "40px",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.3)"
        }}
      >

        <h2
          style={{
            color: "black",
            textAlign: "center"
          }}
        >
          Category-wise Business Count
        </h2>

        <div style={{ display: "flex", justifyContent: "center" }}>

          <BarChart
            width={700}
            height={400}
            data={categoryData}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="category" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#8884d8"
            />

          </BarChart>

        </div>

      </div>




      {/* SOURCE PIE CHART */}

      <div
        style={{
          background: darkMode ? "white" : "#f0f0f0",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.3)"
        }}
      >

        <h2
          style={{
            color: "black",
            textAlign: "center"
          }}
        >
          Source-wise Business Count
        </h2>

        <div style={{ display: "flex", justifyContent: "center" }}>

          <PieChart width={500} height={400}>

            <Pie
              data={sourceData}
              dataKey="total"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >

              {sourceData.map((entry, index) => (

                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </div>

      </div>

    </div>
  );
}

export default App;
