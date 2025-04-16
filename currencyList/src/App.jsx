import { useState, useEffect } from "react";

// Reusable List component
const List = ({ items, renderItem }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

// Main App component
const App = () => {
  const [rates, setRates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        const ratesArray = Object.entries(data.rates).map(
          ([currency, rate]) => ({
            currency,
            rate,
          })
        );

        setRates(ratesArray);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
  };

  if (isLoading) {
    return <div>Loading exchange rates...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app">
      <h1>Currency Exchange Rates</h1>

      <div className="controls">
        <label htmlFor="itemsPerPage">Currencies per page: </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <List
        items={rates.slice(0, itemsPerPage)}
        renderItem={(rate) => (
          <div className="rate-item">
            <strong>{rate.currency}:</strong> {rate.rate.toFixed(4)}
          </div>
        )}
      />
    </div>
  );
};

export default App;
