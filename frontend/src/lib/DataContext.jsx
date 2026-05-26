import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]); 
  const [excelRawData, setExcelRawData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [archives, setArchives] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [targetNodes, setTargetNodes] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [aggregateUptime, setAggregateUptime] = useState("0.00%");

  return (
    <DataContext.Provider value={{
      isAutoMode, setIsAutoMode,
      selectedFile, setSelectedFile,
      activeFilters, setActiveFilters,
      excelRawData, setExcelRawData,
      networkData, setNetworkData,
      archives, setArchives,
      searchQuery, setSearchQuery,
      targetNodes, setTargetNodes,
      startDate, setStartDate,
      endDate, setEndDate,
      analyticsData, setAnalyticsData,
      aggregateUptime, setAggregateUptime
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);