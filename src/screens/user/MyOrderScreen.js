import React, { useState, useEffect } from "react";
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import {
  Layout,
  Text,
  Spinner,
  Button,
  Tab,
  TabView,
  useStyleSheet,
  StyleService,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import OrderList from "../../components/OrderList/OrderList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, network } from "../../constants";
import ProgressDialog from "react-native-progress-dialog";

const MyOrderScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const styles = useStyleSheet(themedStyles);
  const [userInfo, setUserInfo] = useState(user);

  const logout = async () => {
    await AsyncStorage.removeItem("authUser");
    navigation.replace("login");
  };

  const convertToJSON = (obj) => {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  };

  const getToken = () => userInfo.token;

  const handleOnRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleOrderDetail = (item) => {
    navigation.navigate("myorderdetail", {
      orderDetail: item,
      Token: getToken(),
    });
  };

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) {
      setError("Token not found");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${network.serverip}/orders`, {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      });
      const result = await response.json();

      if (result?.err === "jwt expired") {
        logout();
      } else if (result.success) {
        setOrders(result.data);
        setError("");
      } else {
        setError(result.message || "Failed to fetch orders");
      }
    } catch (error) {
      setError(error.message);
      console.log("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUserInfo(convertToJSON(user));
    fetchOrders();
  }, [user]);

  return (
    <Layout style={styles.container}>
      <StatusBar />
      <ProgressDialog visible={isLoading} label={"Loading"} />
      <Layout style={styles.topBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-outline" size={30} color={colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOnRefresh}>
          <Ionicons name="cart-outline" size={30} color={colors.primary} />
        </TouchableOpacity>
      </Layout>
      <Layout style={styles.screenNameContainer}>
        <Text category="h1" style={styles.screenNameText}>My Orders and Quotes</Text>
        <Text style={styles.screenNameParagraph}>Your orders and quotes</Text>
      </Layout>
      <CustomAlert message={error} type={alertType} />
      <TabView selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
        <Tab title='My Orders'>
          {orders.length === 0 ? (
            <Layout style={styles.ListContainerEmpty}>
              <Text style={styles.secondaryTextSmItalic}>
                "There are no orders placed yet."
              </Text>
            </Layout>
          ) : (
            <ScrollView
              style={{ width: "100%",height:Dimensions.get('window').height - 280, padding: 20 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />
              }
            >
              {orders.map((order, index) => (
                <OrderList
                  item={order}
                  key={index}
                  onPress={() => handleOrderDetail(order)}
                />
              ))}
            </ScrollView>
          )}
        </Tab>
        <Tab title='My Quotes'>
          {/* Implement quotes fetching logic here if necessary */}
          <Layout style={styles.ListContainerEmpty}>
            <Text style={styles.secondaryTextSmItalic}>
              "There are no quotes available yet."
            </Text>
          </Layout>
        </Tab>
      </TabView>
    </Layout>
  );
};

export default MyOrderScreen;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  topBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  screenNameContainer: {
    padding: 20,
    paddingTop: 0,
  },
  screenNameText: {
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
  },
  ListContainerEmpty: {
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryTextSmItalic: {
    fontStyle: "italic",
    fontSize: 15,
    color: colors.muted,
  },
});
