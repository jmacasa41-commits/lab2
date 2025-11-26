import React, { useState } from "react";
import "./App.css";
import { originalProducts } from "./data";

function App() {
  const [master, setMaster] = useState(() =>
    originalProducts.map(p => ({ ...p }))
  );

  const [displayed, setDisplayed] = useState(() =>
    originalProducts.map(p => ({ ...p }))
  );

  const [search, setSearch] = useState("");

  // ⭐ Balanced reorder logic (YES + NO)
  const needsReorder = (p) => p.stock < p.avgSales;
  const notNeedingReorder = (p) => p.stock >= p.avgSales;

  // ⭐ Generate Forecast
  const generateForecast = () => {
    const updated = master.map(p => ({
      ...p,
      stock: Math.floor(Math.random() * 61),
      avgSales: Math.floor(Math.random() * 56) + 5,
      leadTime: Math.floor(Math.random() * 14) + 1
    }));

    setMaster(updated);
    setDisplayed(updated);
  };

  const sortInventoryDesc = () => {
    const sorted = [...displayed].sort((a, b) => b.stock - a.stock);
    setDisplayed(sorted);
  };

  // ⭐ Show reorder only (YES)
  const showReorderOnly = () => {
    const filtered = master.filter(p => needsReorder(p));
    setDisplayed(filtered);
  };

  // ⭐ NEW: Show NOT needing reorder (NO)
  const showNoReorderOnly = () => {
    const filtered = master.filter(p => notNeedingReorder(p));
    setDisplayed(filtered);
  };

  // ⭐ Reset
  const resetProducts = () => {
    const reset = originalProducts.map(p => ({ ...p }));
    setMaster(reset);
    setDisplayed(reset);
    setSearch("");
  };

  // ⭐ Search logic
  const applySearch = (value) => {
    setSearch(value);
    const filtered = master.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayed(filtered);
  };

  return (
    <div className="container">
      <h2>Inventory Forecast Dashboard</h2>

      <p>Total products needing reorder: {master.filter(needsReorder).length}</p>

      <p style={{ marginBottom: "10px", fontSize: "15px", fontWeight: "600" }}>
        Products: {displayed.length}
      </p>

      <div style={{ marginBottom: 8 }}>
        <button onClick={generateForecast}>Generate Forecast</button>
        <button onClick={sortInventoryDesc} style={{ marginLeft: 8 }}>
          Sort by Inventory Desc
        </button>
        <button onClick={showReorderOnly} style={{ marginLeft: 8 }}>
          Show Reorder Only
        </button>

        {/* ⭐ NEW BUTTON: Show NO only */}
        <button
          onClick={showNoReorderOnly}
          style={{
            marginLeft: 8,
            background: "#28a745",
            color: "white"
          }}
        >
          Show Not Needing Reorder
        </button>

        <button
          onClick={resetProducts}
          style={{
            marginLeft: 8,
            background: "#6c757d",
            color: "white"
          }}
        >
          Reset Products
        </button>
      </div>

      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => applySearch(e.target.value)}
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
          {displayed.map((p, idx) => {
            const reorder = needsReorder(p);

            return (
              <tr
                key={idx}
                style={{
                  background: reorder ? "#ffe5e5" : "#eaffea"
                }}
              >
                <td>{p.name}</td>
                <td style={{ textAlign: "center" }}>{p.stock}</td>
                <td style={{ textAlign: "center" }}>{p.avgSales}</td>
                <td style={{ textAlign: "center" }}>{p.leadTime}</td>

                <td
                  style={{
                    color: reorder ? "red" : "green",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  {reorder ? "YES" : "NO"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
