import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants";

const ProductSkelton = () => {
  return (
    <View>
      {/* <View style={styles.container}> */}
      {/* Placeholder card content */}
      <View style={styles.placeholder}>
        <Text style={{ color: "gray", marginTop: 80 }}>Loading...</Text>
      </View>
      {/* <View style={styles.placeholder} />
        <View style={styles.placeholder} /> */}
    </View>
    // </View>
  );
};
export default ProductSkelton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    borderRadius: 13,
    minWidth: "100%",
    padding: 16,
    marginBottom: 16,
    marginTop: 50,
  },
  placeholder: {
    backgroundColor: "#ddd",
    height: 16,
    width: 150,
    height: 200,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    elevation: 3,
    margin: 12,
  },
});
