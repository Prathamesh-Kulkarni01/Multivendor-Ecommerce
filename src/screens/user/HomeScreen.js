import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import cartIcon from "../../assets/icons/cart_beg.png";
import scanIcon from "../../assets/icons/scan_icons.png";
import easybuylogo from "../../assets/logo/logo.png";
import { colors, network } from "../../constants";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import SearchableDropdown from "react-native-searchable-dropdown";
import Carousel from "react-native-carousel-banner";
import CustomButton from "../../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductSkeleton from "../../components/Skeltons/ProductSkelton";
import { useSelector, useDispatch } from "react-redux";
import { addCartItem } from "../../states/slices/cartSlice";
import QuotationFormDialog from "../../utilities/QuotationFormDialog";

const category = [
  {
    _id: "62fe244f58f7aa8230817f89",
    title: "Civil Supplies",
    image: require("../../assets/icons/garments.png"),
  },
  {
    _id: "62fe243858f7aa8230817f86",
    title: "Electrical",
    image: require("../../assets/icons/electronics.png"),
  },
  {
    _id: "62fe241958f7aa8230817f83",
    title: "Plumbing",
    image: require("../../assets/icons/cosmetics.png"),
  },
  {
    _id: "62fe246858f7aa8230817f8c",
    title: "Plywood",
    image: require("../../assets/icons/grocery.png"),
  },
  {
    _id: "62fe246858f7aa8230817f8d", // Corrected ID
    title: "TMT Bars",
    image: require("../../assets/icons/grocery.png"),
  },
  {
    _id: "62fe246858f7aa8230817f8e", // Corrected ID
    title: "Sand",
    image: require("../../assets/icons/grocery.png"),
  },
];

const slides = [
  "https://thumbs.dreamstime.com/z/building-store-website-template-building-materials-supplies-store-website-template-illustration-cartoon-worker-purchasing-249146806.jpg?w=992",
  "https://img.freepik.com/free-vector/flat-construction-social-media-cover-template_23-2149571537.jpg",
];

const HomeScreen = ({ navigation, route }) => {
  const cartProducts = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const { user } = route.params;
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [searchItems, setSearchItems] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);

  const toggleDialog = () => {
    setDialogVisible((d) => !d);
  };

  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product });
  };

  const handleAddToCart = (product) => {
    dispatch(addCartItem(product));
  };

  const headerOptions = {
    method: "GET",
    redirect: "follow",
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${network.serverip}/products`,
        headerOptions
      );
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
        setError("");

        let payload = result.data.map((cat, index) => ({
          ...cat,
          id: index + 1,
          name: cat.title,
        }));
        setSearchItems(payload);

        await AsyncStorage.setItem("products", JSON.stringify(result.data));
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
      console.log("error", error);
    }
  };

  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      convertToJSON(user);

      const cachedData = await AsyncStorage.getItem("products");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        let payload = parsedData.map((cat, index) => ({
          ...cat,
          id: index + 1,
          name: cat.title,
        }));
        setSearchItems(payload);
      }

      await fetchProduct();
    };

    initializeData();
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.topBarContainer}>
        <TouchableOpacity disabled>
          <Ionicons name="menu" size={30} color={colors.muted} />
        </TouchableOpacity>
        <View style={styles.topbarlogoContainer}>
          <Image source={easybuylogo} style={styles.logo} />
          <Text style={styles.toBarText}>BuildMart360</Text>
        </View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("cart")}
        >
          {cartProducts.length > 0 && (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>
                {cartProducts.length}
              </Text>
            </View>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <SearchableDropdown
              onTextChange={(text) => console.log(text)}
              onItemSelect={(item) => handleProductPress(item)}
              defaultIndex={0}
              containerStyle={{
                borderRadius: 5,
                width: "100%",
                elevation: 5,
                position: "absolute",
                zIndex: 20,
                top: -20,
                maxHeight: 300,
                backgroundColor: colors.light,
              }}
              textInputStyle={{
                borderRadius: 10,
                padding: 6,
                paddingLeft: 10,
                borderWidth: 0,
                backgroundColor: colors.white,
              }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: colors.white,
                borderColor: colors.muted,
              }}
              itemTextStyle={{
                color: colors.muted,
              }}
              itemsContainerStyle={{
                maxHeight: "100%",
              }}
              items={searchItems.map((item) => ({ ...item, name: item.title }))}
              placeholder="Search..."
              resetValue={false}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.scanButtonText}>Scan</Text>
              <Image source={scanIcon} style={styles.scanButtonIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView nestedScrollEnabled>
          <View style={styles.promotiomSliderContainer}>
            <Carousel data={slides} roundedSize={10} />
          </View>
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>Categories</Text>
          </View>
          <View style={styles.categoryContainer}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={styles.flatListContainer}
              data={category}
              numColumns={3}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <CustomIconButton
                    text={item.title}
                    image={item.image}
                    onPress={() =>
                      navigation.jumpTo("categories", { categoryID: item })
                    }
                  />
                </View>
              )}
            />
          </View>
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButton}>
              <CustomButton
                icon="calculator"
                text={"Smart Calculator"}
                onPress={() => {
                  // handleAddToCart(product);
                }}
              />
            </View>
            <View style={styles.actionButton}>
              <CustomButton
                icon="clipboard-sharp"
                text={"Ask Quote"}
                onPress={()=>toggleDialog()}
              />
            </View>
          </View>
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>New Arrivals</Text>
          </View>
          {products.length === 0 ? (
            <View style={styles.productCardContainerEmpty}>
              <ProductSkeleton />
              <ProductSkeleton />
            </View>
          ) : (
            <View style={styles.productCardContainer}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleOnRefresh}
                  />
                }
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                data={products}
                numColumns={2}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.productCard} key={item._id}>
                    <ProductCard
                      name={item.title}
                      image={`${item.image}`}
                      price={item.price}
                      quantity={item.quantity || 0}
                      onPress={() => handleProductPress(item)}
                      onAddToCart={() => handleAddToCart(item)}
                    />
                  </View>
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
      <QuotationFormDialog isVisible={isDialogVisible} onClose={toggleDialog} />
    </View>
  );
};

const { width } = Dimensions.get("window");
const bannerHeight = 200;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  topbarlogoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  bodyContainer: {
    width: "100%",
    flexDirecion: "row",

    paddingBottom: 0,
    flex: 1,
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  secondaryText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  searchContainer: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputContainer: {
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 40,
    width: "100%",
    gap: 2,
  },
  scanButtonText: {
    fontSize: 15,
    color: colors.light,
    fontWeight: "bold",
  },
  scanButtonIcon: {
    width: 20,
    height: 20,
  },
  primaryTextContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  flatListContainer: {
    width: "100%",
    height: 150,
    marginTop: 10,
    marginLeft: 10,
  },
  promotiomSliderContainer: {
    margin: 2,
    width: "97%",
    height: 170,
    backgroundColor: colors.light,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 110,
    marginTop: 6,
    marginLeft: 10,
  },
  actionButtonsContainer: {
    marginHorizontal: 5,
    display: "flex",
    gap: 5,
    flexWrap: "nowrap",
    flexDirection: "row",
  },
  actionButton: {
    flex: 1,
    maxWidth: "50%",
  },
  emptyView: { width: 30 },
  productCardContainer: {
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginLeft: 10,
    paddingTop: 0,
    gap: 10,
  },
  productCardContainerEmpty: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 240,
    marginLeft: 10,
    paddingTop: 0,
  },
  productCardContainerEmptyText: {
    fontSize: 15,
    fontStyle: "italic",
    color: colors.muted,
    fontWeight: "600",
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
});

export default HomeScreen;
