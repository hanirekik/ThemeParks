import React, { useState } from "react";
import { View, TouchableOpacity, Keyboard, Text } from "react-native";
import { SearchBar } from "react-native-elements";

const SearchBarComponent = ({ searchQuery, setSearchQuery }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleCancel = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
    }
    Keyboard.dismiss();
    setIsFocused(false);
  };

  return (
    <View style={styles.searchBarContainer}>
      <SearchBar
        placeholder="Search ..."
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
  );
};

const styles = {
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
    color: "#687ed4",
    fontSize: 16,
    fontWeight: "bold",
  },
};

export default SearchBarComponent;
