import { StockWithWeight, Stock } from "@amalinvest/types";

const BASE_URL = "http://localhost:4000";

export const getStockNames = async (search: string): Promise<Stock[]> => {
  try {
    const response = await fetch(`${BASE_URL}/stocks?q=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch stocks");
    }

    const data: Stock[] = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};

export const getStockPerformance = async (
  values: StockWithWeight[]
): Promise<number[][] | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/stocks/performance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stocks: values }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch performance");
    }

    const data: number[][] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
