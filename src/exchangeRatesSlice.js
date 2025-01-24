import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk for Fetching Exchange Rates
export const fetchExchangeRates = createAsyncThunk(
  'exchangeRates/fetchExchangeRates',
  async ({ startDate, endDate }) => {
    const response = await fetch(
      `https://api.frankfurter.app/${startDate}..${endDate}?base=EUR&symbols=USD`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data = await response.json();
    return Object.entries(data.rates).map(([date, rate]) => ({
      date,
      rate: rate.USD,
    }));
  }
);

const exchangeRatesSlice = createSlice({
  name: 'exchangeRates',
  initialState: {
    rates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default exchangeRatesSlice.reducer;
