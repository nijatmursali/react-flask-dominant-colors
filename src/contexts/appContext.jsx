/* eslint-disable react/prop-types */
import { useState, useContext, createContext } from "react";
import axios from "axios";

const appContext = createContext();

const AppProvider = ({ children }) => {
  const data = useProvideData();
  return <appContext.Provider value={data}>{children}</appContext.Provider>;
};

const useProvideData = () => {
  const [data, setData] = useState([]);

  const getImage = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/image`,
        data
      );
      return response;
    } catch (error) {
      return null;
    }
  };

  return {
    data,
    setData,
    requests: {
      getImage,
    },
  };
};

export const useData = () => {
  return useContext(appContext);
};

export default AppProvider;
