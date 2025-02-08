import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchPrediction = ({ searchQuery, handleSearch, navigation }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
        <Ionicons name="arrow-back" size={26} color="#687ed4" />
      </TouchableOpacity>
      <TextInput
        style={{
          flex: 1,
          height: 40,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingHorizontal: 10,
        }}
        
        placeholder="Rechercher une attraction..."
        onChangeText={handleSearch}
        value={searchQuery}
      />
    </View>
  );
};

export default SearchPrediction;
