import React, { useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { attractions } from "../data/attractions";
import { useNavigation } from "@react-navigation/native";

const AttractionsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sortOption, setSortOption] = useState({ field: "name", order: "asc" });
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState("name");
  const [selectedOrder, setSelectedOrder] = useState("asc");

  const navigation = useNavigation();

  const handleCancel = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
    }
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const applySort = () => {
    setSortOption({ field: selectedField, order: selectedOrder });
    setModalVisible(false);
  };

  const filteredAttractions = attractions
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "All" || (filter === "Open" && item.status === "Open");
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOption.order === "asc") {
        return a[sortOption.field] > b[sortOption.field] ? 1 : -1;
      } else {
        return a[sortOption.field] < b[sortOption.field] ? 1 : -1;
      }
    });

  const renderAttraction = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.waitStatusContainer}>
            {item.status === "Open" && (
              <>
                <Text style={styles.waitTime}>🕒 {item.waitTime} min</Text>
                <Text style={styles.separator}> • </Text>
              </>
            )}
            <Text
              style={[
                styles.status,
                { color: item.status === "Open" ? "#27ae60" : "#c0392b" },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.lastUpdated}>Last Updated: {item.lastUpdated}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="feather" size={26} color="#007aff" />
        </TouchableOpacity>
        <SearchBar
          placeholder="Search Attractions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          lightTheme
          round
          clearIcon={{ name: "close", type: "font-awesome" }}
          containerStyle={styles.searchBarContainerStyle}
          inputContainerStyle={styles.searchBarInputContainerStyle}
        />
        {isFocused && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "All" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("All")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "Open" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("Open")}
        >
          <Text style={styles.filterText}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={toggleModal}
        >
          <Text style={styles.dropdownText}>Sort ▾</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAttractions}
        renderItem={renderAttraction}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <View style={styles.modalOptions}>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  onPress={() => setSelectedField("name")}
                  style={styles.radioOption}
                >
                  <View style={styles.radio}>
                    {selectedField === "name" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioOptionText}>Name</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedField("waitTime")}
                  style={styles.radioOption}
                >
                  <View style={styles.radio}>
                    {selectedField === "waitTime" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioOptionText}>Wait Time</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  onPress={() => setSelectedOrder("asc")}
                  style={styles.radioOption}
                >
                  <View style={styles.radio}>
                    {selectedOrder === "asc" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioOptionText}>Ascending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedOrder("desc")}
                  style={styles.radioOption}
                >
                  <View style={styles.radio}>
                    {selectedOrder === "desc" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioOptionText}>Descending</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.applyButton} onPress={applySort}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchBarContainerStyle: {
    flex: 1,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBarInputContainerStyle: {
    backgroundColor: "#f4f0ec",
    borderRadius: 10,
  },
  cancelButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#007aff",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  filterButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: "#007aff",
  },
  filterText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  dropdownContainer: {
    marginLeft: "auto",
  },
  dropdownText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007aff",
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  detailsContainer: {
    marginTop: 5,
  },
  waitStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  waitTime: {
    fontSize: 16,
    color: "#f39c12",
    marginRight: 5,
  },
  separator: {
    fontSize: 18,
    color: "#34495e",
    marginHorizontal: 10,
  },
  status: {
    fontSize: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#95a5a6",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "#f8f9fa",
    width: "90%",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
  },
  modalOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  radioGroup: {
    flex: 1,
    marginHorizontal: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioOptionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#2c3e50",
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007aff",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007aff",
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: "#007aff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AttractionsList;
