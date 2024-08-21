import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

const CustomButton = ({ text, onPress, disabled = false, icon }) => {
  return (
    <>
      {disabled == true ? (
        <TouchableOpacity
          disabled
          style={styles.containerDisabled}
          onPress={onPress}
        >
          <View style={styles.buttonContent}>
            {icon && (
              <Ionicons
                name={icon} // Use the icon prop here
                size={24}
                style={styles.buttonTextDisabled}
                color={colors.white}
              />
            )}
            <Text style={styles.buttonTextDisabled}>{text}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <View style={styles.buttonContent}>
            {icon && (
              <Ionicons
                name={icon} // Use the icon prop here
                size={24}
                style={styles.buttonTextDisabled}
                color={colors.white}
              />
            )}

            <Text style={styles.buttonText}>{text}</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
    display: "flex",
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  containerDisabled: {
    padding: 15,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: colors.muted,
  },
  buttonTextDisabled: {
    fontWeight: "bold",
    color: colors.light,
    marginHorizontal: 5,
  },
  buttonContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
