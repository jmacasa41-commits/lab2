import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [model, setModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch dummy products
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.products.map((p) => ({
          name: p.title,
          current: Math.floor(Math.random() * 50),
          avgSales: Math.floor(Math.random() * 60),
          leadTime: Math.floor(Math.random() * 10) + 1,
          status: "",
        }));
        setProducts(formatted);
      });
  }, []);

  // train AI model using TensorFlow
  const trainModel = async () => {
    const xs = tf.tensor2d([
      [40, 10, 2],
      [5, 40, 6],
      [30, 20, 4],
      [2, 30, 8],
    ]);

    const ys = tf.tensor2d([
      [0],
      [1],
      [0],
      [1],
    ]);

    const mdl = tf.sequential();
    mdl.add(tf.layers.dense({ inputShape: [3], units: 6, activation: "relu" }));
    mdl.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    mdl.compile({ loss: "binaryCrossentropy", optimizer: "adam" });

    await mdl.fit(xs, ys, { epochs: 200 });

    setModel(mdl);
    return mdl;
  };

  // generate AI forecast
  const generateForecast = async () => {
    let ai = model || (await trainModel());

    const updated = products.map((p) => {
      const input = tf.tensor2d([[p.current, p.avgSales, p.leadTime]]);
      const prediction = ai.predict(input).dataSync()[0];

      let status = "SAFE";
      if (prediction > 0.75) status = "CRITICAL";
      else if (prediction > 0.45) status = "LOW";

      return { ...p, status };
    });

    setProducts(updated);
  };

  // sorting
  const sortInventoryDesc = () => {
    setProducts([...products].sort((a, b) => b.current - a.current));
  };

  // filter reorder only
  const showReorderOnly = () => {
    setProducts(products.filter((p) => p.status === "CRITICAL" || p.status === "LOW"));
  };

  // search
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalCount = products.filter((p) => p.status === "CRITICAL").length;

  return (
    <div className="container">

      <h2>Inventory Forecast Dashboard</h2>
      <p>Total products needing reorder: {criticalCount}</p>

      <button onClick={generateForecast}>Generate Forecast</button>
      <button onClick={sortInventoryDesc}>Sort by Inventory Desc</button>
      <button onClick={showReorderOnly}>Show Reorder Only</button>

      <br />

      <input
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Current Inventory Level</th>
            <th>Average Sales per Week</th>
            <th>Days to Replenish</th>
            <th>Reorder?</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((p, i) => (
            <tr
              key={i}
              className={
                p.status === "CRITICAL"
                  ? "critical-row"
                  : p.status === "LOW"
                  ? "low-row"
                  : ""
              }
            >
              <td>{p.name}</td>
              <td>{p.current}</td>
              <td>{p.avgSales}</td>
              <td>{p.leadTime}</td>
              <td
                className={
                  p.status === "CRITICAL"
                    ? "status-critical"
                    : p.status === "LOW"
                    ? "status-low"
                    : "status-safe"
                }
              >
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
