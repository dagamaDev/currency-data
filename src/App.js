import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchExchangeRates } from './exchangeRatesSlice';
import { Line } from 'react-chartjs-2';
import './App.css';
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function App() {
  const dispatch = useDispatch();
  const { rates, loading, error } = useSelector((state) => state.exchangeRates);

  const [activePeriod, setActivePeriod] = useState(null);

  const getPeriods = () => {
    const now = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    const createPeriod = (months) => {
      const start = new Date(now);
      start.setMonth(start.getMonth() - months);
      return {
        label: `${months} month${months > 1 ? 's' : ''}`,
        start: formatDate(start),
        end: formatDate(now),
      };
    };

    return [
      createPeriod(1),
      createPeriod(3),
      createPeriod(6),
      createPeriod(12),
    ];
  };

  const [periods] = useState(getPeriods);

  useEffect(() => {
    const initialPeriod = periods[0];
    setActivePeriod(initialPeriod.label);
    dispatch(fetchExchangeRates({ startDate: initialPeriod.start, endDate: initialPeriod.end }));
  }, [dispatch, periods]);

  const chartData = {
    labels: rates.map((data) => data.date),
    datasets: [
      {
        label: 'EUR to USD',
        data: rates.map((data) => data.rate),
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>EUR to USD Exchange Rates</h1>
        {error && <p className="error">Error: {error}</p>}
        <div className="period-buttons">
          {periods.map((period) => (
            <button
              key={period.label}
              className={activePeriod === period.label ? 'active' : ''}
              onClick={() => {
                setActivePeriod(period.label);
                dispatch(fetchExchangeRates({ startDate: period.start, endDate: period.end }));
              }}
            >
              {period.label}
            </button>
          ))}
        </div>
      </header>
      <div className="content">
        <div className="table-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Exchange Rate (EUR to USD)</th>
                </tr>
              </thead>
              <tbody>
                {rates.map(({ date, rate }) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default App;
