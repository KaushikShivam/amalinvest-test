import React, { useState } from "react";
import SearchForm from "../../components/SearchForm";
import { v4 as uuidv4 } from "uuid";
import { getStockPerformance } from "../../lib/api";
import { StockWithWeight } from "@amalinvest/types";
import Chart from "../../components/Chart";
import ErrorMessage from "../../components/ErrorMessage";

const WatchlistPage = () => {
  const [formValues, setFormValues] = useState<StockWithWeight[]>([
    { id: uuidv4(), stock: "", weight: "" },
  ]);
  const [error, setError] = useState<string>();
  const [fetchError, setFetchError] = useState<string>();
  const [performanceData, setPerformanceData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(false);

  const addField = () => {
    setError("");
    setFormValues([...formValues, { id: uuidv4(), stock: "", weight: "" }]);
  };

  const removeField = (id: string) => {
    setError("");
    setFormValues(formValues.filter((value) => value.id !== id));
  };

  const handleChange = (body: Partial<StockWithWeight>) => {
    setError("");
    setFormValues(
      formValues.map((value) =>
        value.id === body.id ? { ...value, ...body } : value
      )
    );
  };

  const handleSubmit = async () => {
    if (
      Array.from(new Set(formValues.map((i) => i.stock))).length !==
      formValues.map((i) => i.stock).length
    ) {
      setError("You can not add same stocks more than once");
      return;
    }

    const isEmpty = formValues.find((i) => i.stock === "" || i.weight === "");
    if (isEmpty) {
      setError("All stocks must contain weight and stock name");
      return;
    }

    const totalWeight = formValues.reduce(
      (prev, next) => prev + parseFloat(next.weight),
      0
    );
    if (totalWeight !== 100) {
      setError("All stock value weight should amount to a total of 100");
      return;
    }
    try {
      setLoading(true);
      const data = await getStockPerformance(formValues);
      if (data && data.length) setPerformanceData(data);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
        setTimeout(() => {
          setFetchError("");
        }, 2000);
      }
      setLoading(false);
      setPerformanceData([]);
    }
  };

  return (
    <>
      <nav className="h-14 flex items-center justify-between px-4">
        <img
          src="https://www.amalinvest.com/_next/static/media/logo.563d1285.svg"
          alt="Amal Invest logo"
        />
      </nav>
      {fetchError && <ErrorMessage message={fetchError} />}
      <main className="flex p-4 flex-col md:flex-row space-x-4">
        <section className="w-full md:w-1/2">
          <SearchForm
            error={error}
            formValues={formValues}
            addField={addField}
            removeField={removeField}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </section>
        {loading && (
          <div className="fixed top-4 right-4 w-8 h-8 border-2 border-dashed rounded-full border-blue-700 bg-white animate-spin"></div>
        )}
        {!loading && performanceData.length > 1 ? (
          <section className="w-full md:w-1/2 mt-4 md:-mt-2">
            <Chart performanceData={performanceData} />
          </section>
        ) : (
          <></>
        )}
      </main>
    </>
  );
};

export default WatchlistPage;
