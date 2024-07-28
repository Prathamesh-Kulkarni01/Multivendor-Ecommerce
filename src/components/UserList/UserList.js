import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants";
import { TouchableOpacity } from "react-native";

const UserList = ({ username, email, onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.profileContainer}>
        <Ionicons
          name="person-circle-outline"
          size={40}
          color={colors.primary_light}
        />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.usernameText}>{username}</Text>
        <Text style={styles.userEmailText}>{email}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 70,
    borderRadius: 10,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
    margin: 5,
  },
  profileContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  userEmailText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  userInfoContainer: {
    marginLeft: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
