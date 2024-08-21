import {
  StyleSheet,
  Text,
  Image,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import header_logo from "../../assets/logo/logo.png";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
// import InternetConnectionAlert from "react-native-internet-connection-alert";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const SignupScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    isVendor: false,
    shopName: "",
    ownerName: "",
    gstNumber: "",
    phoneNumber: "",
    address: "",
    latitude: null,
    longitude: null,
    pincode: "",
    city: "",
    error: "",
    udyamCertificate: null,
    shopLogo: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });

  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setFormData((prev) => ({
        ...prev,
        error: "Permission to access location was denied",
      }));
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setFormData((prev) => ({
      ...prev,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: "Selected Location",
    }));
    setMarkerCoordinate({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
    setFormData((prev) => ({ ...prev, error: "" }));
  };

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    ...formData
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  //method to post the user data to server for user signup using API call
  const signUpHandle = () => {
    if (currentStep === 3 || !formData.isVendor) {
      const {email,name,password,confirmPassword }=formData
      if (email == "") {
        return setError("Please enter your email");
      }
      if (name == "") {
        return setError("Please enter your name");
      }
      if (password == "") {
        return setError("Please enter your password");
      }
      if (!email.includes("@")) {
        return setError("Email is not valid");
      }
      if (email.length < 6) {
        return setError("Email is too short");
      }
      if (password.length < 5) {
        return setError("Password must be 6 characters long");
      }
      if (password != confirmPassword) {
        return setError("password does not match");
      }
      fetch(network.serverip + "/register", requestOptions) // API call
      .then((response) => response.json())
      .then((result) => {
        if (result.data["email"] == email) {
          navigation.navigate("login");
        }
      })
      .catch((error) => {
        console.log("error",error)
        setError(error.message)
      });
    }
  };

  const handleSelectLocation = () => {
    setFormData((prev) => ({
      ...prev,
      address: "Selected Location",
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude,
    }));
    setModalVisible(false);
  };

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    (async () => await getLocation())();
  }, []);

  
  return (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar />
        <View style={styles.TopBarContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back-circle-outline"
              size={30}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicatorContainer}>
          {Array.from({ length: 4 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.stepIndicator,
                currentStep >= index && styles.activeStep,
              ]}
            />
          ))}
        </View>

        <ScrollView style={styles.scrollContainer}>
          {currentStep === 0 && (
            <>
              <View style={styles.welconeContainer}>
                <Image style={styles.logo} source={header_logo} />
              </View>
              <View style={styles.screenNameContainer}>
                <Text style={styles.screenNameText}>Sign Up</Text>
              </View>
            </>
          )}
          <View style={styles.formContainer}>
            <CustomAlert message={formData.error} type={"error"} />
            {currentStep === 0 && (
              <>
                <CustomInput
                  value={formData.name}
                  setValue={(value) => updateFormData("name", value)}
                  placeholder={"Name"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <CustomInput
                  value={formData.email}
                  setValue={(value) => updateFormData("email", value)}
                  placeholder={"Email"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <CustomInput
                  value={formData.password}
                  setValue={(value) => updateFormData("password", value)}
                  secureTextEntry
                  placeholder={"Password"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <CustomInput
                  value={formData.confirmPassword}
                  setValue={(value) => updateFormData("confirmPassword", value)}
                  secureTextEntry
                  placeholder={"Confirm Password"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <TouchableOpacity
                  style={styles.vendorCheckbox}
                  onPress={() => updateFormData("isVendor", !formData.isVendor)}
                >
                  <Ionicons
                    name={formData.isVendor ? "checkbox" : "checkbox-outline"}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.vendorText}>Sign up as a Vendor</Text>
                </TouchableOpacity>
              </>
            )}
            {currentStep === 1 && formData.isVendor && (
              <>
                <CustomInput
                  value={formData.shopName}
                  setValue={(value) => updateFormData("shopName", value)}
                  placeholder={"Shop Name"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <CustomInput
                  value={formData.ownerName}
                  setValue={(value) => updateFormData("ownerName", value)}
                  placeholder={"Owner Name"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <CustomInput
                  value={formData.gstNumber}
                  setValue={(value) => updateFormData("gstNumber", value)}
                  placeholder={"GST Number"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <CustomInput
                  value={formData.phoneNumber}
                  setValue={(value) => updateFormData("phoneNumber", value)}
                  placeholder={"Phone Number"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
              </>
            )}
            {currentStep === 2 && (
              <>
                <CustomInput
                  value={formData.city}
                  setValue={(value) => updateFormData("city", value)}
                  placeholder={"Store City"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <CustomInput
                  value={formData.address}
                  setValue={(value) => updateFormData("address", value)}
                  placeholder={"Store Address"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <CustomInput
                  value={formData.pincode}
                  setValue={(value) => updateFormData("pincode", value)}
                  placeholder={"Pincode"}
                  placeholderTextColor={colors.muted}
                  radius={5}
                />
                <MapView
                  style={styles.mini_map}
                  initialRegion={{
                    latitude: formData.latitude || 0,
                    longitude: formData.longitude || 0,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  <Marker coordinate={markerCoordinate} />
                </MapView>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.locationButtonText}>
                    Choose Address from Map
                  </Text>
                </TouchableOpacity>
                {formData.address && (
                  <Text style={styles.certificateText}>
                    Address: {formData.address} (Lat: {formData.latitude}, Long:{" "}
                    {formData.longitude})
                  </Text>
                )}
              </>
            )}
            {currentStep === 3 && (
              <>
                <Text style={styles.finalStepText}>
                  Upload your documents and review your information.
                </Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() =>
                    pickImage((uri) => updateFormData("shopLogo", uri))
                  }
                >
                  <View className={styles.uploadIcon}>
                    <Ionicons
                      name={
                        formData.shopLogo
                          ? "checkmark-done-circle-sharp"
                          : "cloud-upload-outline"
                      }
                      size={35}
                      color={formData.shopLogo ? "green" : colors.muted}
                    />
                  </View>
                  <Text style={styles.uploadButtonText}>Upload Shop Logo</Text>
                </TouchableOpacity>
                {formData.shopLogo && (
                  <Text style={styles.certificateText}>
                    Logo Uploaded: {formData.shopLogo}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() =>
                    pickImage((uri) => updateFormData("udyamCertificate", uri))
                  }
                >
                  <View className={styles.uploadIcon}>
                    <Ionicons
                      name={
                        formData.udyamCertificate
                          ? "checkmark-done-circle-sharp"
                          : "cloud-upload-outline"
                      }
                      size={35}
                      color={formData.udyamCertificate ? "green" : colors.muted}
                    />
                  </View>
                  <Text style={styles.uploadButtonText}>
                    Upload Udyam Certificate
                  </Text>
                </TouchableOpacity>
                {formData.udyamCertificate && (
                  <Text style={styles.certificateText}>
                    Uploaded: {formData.udyamCertificate.split("/").pop()}
                  </Text>
                )}
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              text={(currentStep === 3||!formData.isVendor) ? "Sign Up": "Next"}
              onPress={(currentStep === 3||!formData.isVendor) ? signUpHandle : handleNextStep}
              type="PRIMARY"
            />
          </View>
        </ScrollView>

        {/* Map Modal */}
        <Modal animationType="slide" visible={modalVisible}>
          <View style={styles.modalContainer}>
            <MapView
              style={styles.fullScreenMap}
              initialRegion={{
                latitude: formData.latitude || 0,
                longitude: formData.longitude || 0,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              onPress={(e) => {
                const coordinate = e.nativeEvent.coordinate;
                setMarkerCoordinate(coordinate);
              }}
            >
              <Marker coordinate={markerCoordinate} />
            </MapView>
            <Pressable
              style={styles.closeButton}
              onPress={handleSelectLocation}
            >
              <Text style={styles.closeButtonText}>Select This Location</Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    // </InternetConnectionAlert>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  TopBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 20,
    margin: "auto",
    marginVertical: 20,
  },
  stepIndicator: {
    width: 20,
    height: 10,
    borderRadius: 10,
    backgroundColor: colors.light,
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  welconeContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  screenNameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  screenNameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    marginBottom: 20,
  },
  vendorCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  vendorText: {
    marginLeft: 5,
    fontSize: 16,
  },
  mini_map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  locationButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  locationButtonText: {
    color: colors.white,
  },
  certificateText: {
    marginTop: 10,
    color: colors.muted,
  },
  finalStepText: {
    fontSize: 16,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: colors.primary_light,
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  uploadIcon: {
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: colors.muted,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  uploadButtonText: {
    color: colors.dark,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  fullScreenMap: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.white,
  },
});

export default SignupScreen;
