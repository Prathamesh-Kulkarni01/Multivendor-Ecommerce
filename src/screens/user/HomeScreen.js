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
      _id: "62fe246858f7aa8230817f8c",
      title: "TMT Bars",
      image: require("../../assets/icons/grocery.png"),
    },
    {
      _id: "62fe246858f7aa8230817f8c",
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
  
    const convertToJSON = (obj) => {
      try {
        setUserInfo(JSON.parse(obj));
      } catch (e) {
        setUserInfo(obj);
      }
    };
  
    const handleProductPress = (product) => {
      navigation.navigate("productdetail", { product: product });
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
        const response = await fetch(`${network.serverip}/products`, headerOptions);
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
          <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate("cart")}>
            {cartProducts.length > 0 && (
              <View style={styles.cartItemCountContainer}>
                <Text style={styles.cartItemCountText}>{cartProducts.length}</Text>
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
                containerStyle={styles.searchDropdownContainer}
                textInputStyle={styles.searchDropdownTextInput}
                itemStyle={styles.searchDropdownItem}
                itemTextStyle={styles.searchDropdownItemText}
                itemsContainerStyle={styles.searchDropdownItemsContainer}
                items={searchItems}
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
                renderItem={({ item, index }) => (
                  <View style={styles.categoryItem} key={index}>
                    <CustomIconButton
                      text={item.title}
                      image={item.image}
                      onPress={() => navigation.jumpTo("categories", { categoryID: item })}
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
                  onPress={() => {
                    // handleAddToCart(product);
                  }}
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
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}
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
      </View>
    );
  };
  
  const { width } = Dimensions.get("window");
  const bannerHeight = 200;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    topBarContainer: {
      flexDirection: "row",
      padding: 10,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "space-between",
    },
    topbarlogoContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    logo: {
      height: 50,
      width: 50,
      resizeMode: "contain",
      marginRight: 10,
    },
    toBarText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.white,
    },
    cartIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    cartItemCountContainer: {
      backgroundColor: colors.red,
      borderRadius: 10,
      paddingHorizontal: 5,
      paddingVertical: 2,
      position: "absolute",
      top: -5,
      right: -10,
    },
    cartItemCountText: {
      color: colors.white,
      fontWeight: "bold",
    },
    bodyContainer: {
      flex: 1,
      padding: 10,
    },
    searchContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    inputContainer: {
      flex: 1,
      marginRight: 10,
    },
    searchDropdownContainer: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.lightGray,
    },
    searchDropdownTextInput: {
      padding: 10,
      borderRadius: 10,
    },
    searchDropdownItem: {
      padding: 10,
    },
    searchDropdownItemText: {
      fontSize: 16,
    },
    searchDropdownItemsContainer: {
      borderRadius: 10,
    },
    buttonContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    scanButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    scanButtonText: {
      color: colors.white,
      fontSize: 16,
      marginRight: 10,
    },
    scanButtonIcon: {
      height: 20,
      width: 20,
      resizeMode: "contain",
    },
    promotiomSliderContainer: {
      marginBottom: 20,
      height: bannerHeight,
    },
    primaryTextContainer: {
      marginVertical: 10,
    },
    primaryText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.black,
    },
    categoryContainer: {
      marginBottom: 20,
    },
    flatListContainer: {
      marginBottom: 20,
    },
    categoryItem: {
      marginBottom: 15,
      flex: 1,
      alignItems: "center",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: 5,
    },
    productCardContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    productCardContainerEmpty: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    productCard: {
      flexBasis: "48%",
      marginBottom: 20,
    },
  });
  
  export default HomeScreen;
  