import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import { LineChart } from "react-native-gifted-charts";
import { SelectList } from "react-native-dropdown-select-list";
import moment from "moment";

const getApiUrl = () =>
  "http://192.168.1.49:3000/api/attractions/weekly-average";

const WeeklyAverageChartPage = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  useEffect(() => {
    fetchWeeklyAverages();
  }, []);

  const fetchWeeklyAverages = async () => {
    try {
      const response = await axios.get(getApiUrl());
      setWeeklyData(response.data);
      setSelectedAttraction(response.data[0]?._id || null);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Unable to retrieve data.");
    }
  };

  const formatDataForChart = (attraction) => {
    return attraction.dailyAverages.map((item, index) => {
      const formattedDate = moment(item.date).format("DD/MM");
      return {
        value: item.averageWaitTime,
        label: formattedDate,
        frontColor: `rgba(134, 65, 244, ${0.7 + index * 0.01})`,
      };
    });
  };

  const selectedData = weeklyData.find(
    (attraction) => attraction._id === selectedAttraction
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Weekly Average Wait Times of Attractions between 30/01 to 06/02
      </Text>

      <View style={styles.dropdownContainer}>
        <SelectList
          setSelected={(val) => setSelectedAttraction(val)}
          data={weeklyData.map((attraction) => ({
            label: attraction.name,
            value: attraction._id,
          }))}
          placeholder="Select an attraction"
        />
      </View>

      {selectedData ? (
        <View style={styles.chartContainer}>
          <View style={styles.yAxisLabelContainer}>
            <Text style={styles.yAxisLabel}>Average Wait Time (minutes)</Text>
          </View>

          <LineChart
            data={formatDataForChart(selectedData)}
            areaChart
            curved
            showVerticalLines
            showValuesAsDataPoints
            color="purple"
            yAxisTextStyle={{ color: "gray" }}
            xAxisLabelTextStyle={{ color: "gray" }}
            xAxisLabels={formatDataForChart(selectedData).map(
              (item) => item.formattedLabel
            )}
            width={Dimensions.get("window").height * 0.4}
            height={250}
          />
          <Text style={styles.axisLabel}>Date (DD/MM)</Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>No data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 30,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  axisLabel: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    left: 30,
    marginVertical: 10,
  },
  yAxisLabelContainer: {
    position: "absolute",
    left: -90,
    top: "50%",
    transform: [{ translateY: -50 }, { rotate: "270deg" }],
  },
  yAxisLabel: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  loadingText: { textAlign: "center", fontSize: 16, color: "#666" },
});

export default WeeklyAverageChartPage;
