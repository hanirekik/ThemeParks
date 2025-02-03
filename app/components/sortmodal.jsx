import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
const SortModal = ({
  isModalVisible,
  toggleModal,
  selectedField,
  setSelectedField,
  selectedOrder,
  setSelectedOrder,
  applySort,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
    borderColor: "#687ed4",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#687ed4",
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: "#687ed4",
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

export default SortModal;
