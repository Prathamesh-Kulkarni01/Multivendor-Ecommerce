import React, { useState, useEffect } from "react";
import { Modal, View, StyleSheet, ScrollView, TextInput } from "react-native";
import {
  Layout,
  Button,
  Input,
  Text,
  Select,
  SelectItem,
  Datepicker,
} from "@ui-kitten/components";
import * as yup from "yup";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { network } from "../constants";

const QuotationFormDialog = ({ isVisible, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [date, setDate] = useState(new Date());
  const [customProduct, setCustomProduct] = useState("");
  const [materials, setMaterials] = useState([]); // Store fetched materials
  const [error, setError] = useState("");

  // Fetch products function
  const fetchProducts = async () => {
    const headerOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${network.serverip}/products`,
        headerOptions
      );
      const result = await response.json();

      if (result.success) {
        setMaterials(result.data.map((product) => product.title)); // Use product titles as materials
        await AsyncStorage.setItem("products", JSON.stringify(result.data));
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchProducts(); // Fetch products when the dialog is visible
    }
  }, [isVisible]);

  const deliveryOptions = ["Pickup", "Home Delivery"];

  const handleMaterialSelect = (index) => {
    const selected = materials[index.row];
    if (!selectedMaterials.some((item) => item.name === selected)) {
      setSelectedMaterials([
        ...selectedMaterials,
        { name: selected, quantity: 1 },
      ]);
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedMaterials = [...selectedMaterials];
    updatedMaterials[index].quantity = value;
    setSelectedMaterials(updatedMaterials);
  };

  const handleDeleteMaterial = (index) => {
    const updatedMaterials = [...selectedMaterials];
    updatedMaterials.splice(index, 1);
    setSelectedMaterials(updatedMaterials);
  };

  const handleAddCustomProduct = () => {
    if (
      customProduct &&
      !selectedMaterials.some((item) => item.name === customProduct)
    ) {
      setSelectedMaterials([
        ...selectedMaterials,
        { name: customProduct, quantity: 1 },
      ]);
      setCustomProduct("");
    }
  };

  const validationSchemaStep1 = yup.object().shape({
    customProduct: yup.string().when("selectedMaterials", {
      is: (materials) => materials.length === 0,
      then: yup
        .string()
        .required("Please specify the custom product or select from the list"),
    }),
  });

  const validationSchemaStep2 = yup.object().shape({
    customerName: yup.string().required("Customer name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Enter a valid 10-digit phone number"),
    companyName: yup.string().required("Company name is required"),
    address: yup.string().required("Address is required"),
    gstNo: yup.string().required("GST number is required"),
  });

  const handleFormSubmit = (values) => {
    const requestedProducts = selectedMaterials.map((item) => ({
      name: item.name,
      quantity: item.quantity,
    }));

    if (values.customProduct) {
      requestedProducts.push({ name: values.customProduct, quantity: 1 });
    }

    console.log("Form Values:", {
      ...values,
      requestedProducts,
    });
    onClose(); // Close the dialog after submission
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <Layout style={styles.modalContent}>
          <View style={styles.header}>
            <Text category="h5" style={styles.title}>
              Quotation Request
            </Text>
            <Button
              appearance="ghost"
              status="basic"
              onPress={() => onClose()}
              accessoryLeft={() => <Ionicons name="close" size={30} />}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Formik
            initialValues={{
              customerName: "",
              email: "",
              phone: "",
              companyName: "",
              address: "",
              gstNo: "",
              deliveryOption: "",
              date: new Date(),
              customProduct: "",
            }}
            validationSchema={
              step === 1 ? validationSchemaStep1 : validationSchemaStep2
            }
            onSubmit={handleFormSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <ScrollView>
                {step === 1 && (
                  <View>
                    <Select
                      style={styles.input}
                      label="Select Materials"
                      placeholder="Select material"
                      onSelect={handleMaterialSelect}
                      value="Select material"
                    >
                      {materials.map((material, index) => (
                        <SelectItem key={index} title={material} />
                      ))}
                    </Select>
                    {selectedMaterials.length > 0 && (
                      <ScrollView
                        style={styles.table}
                        contentContainerStyle={styles.tableContent}
                      >
                        {selectedMaterials.map((item, index) => (
                          <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{item.name}</Text>
                            <Input
                              style={styles.quantityInput}
                              value={`${item.quantity}`}
                              onChangeText={(value) =>
                                handleQuantityChange(index, value)
                              }
                              keyboardType="numeric"
                            />
                            <Button
                              // style={styles.deleteButton}
                              appearance="ghost"
                              status="danger"
                              onPress={() => handleDeleteMaterial(index)}
                              accessoryLeft={() => (
                                <Ionicons name="trash" size={32} />
                              )}
                            />
                          </View>
                        ))}
                      </ScrollView>
                    )}

                    <View style={styles.customProductContainer}>
                      <View style={styles.customProductRow}>
                        <Input
                          style={styles.customProductInput}
                          placeholder="Specify custom product"
                          value={customProduct}
                          onChangeText={setCustomProduct}
                        />
                        <Button
                          style={styles.addButton}
                          onPress={handleAddCustomProduct}
                          disabled={customProduct.length < 3}
                        >
                          <Ionicons name="add" />
                        </Button>
                      </View>
                    </View>

                    <View style={styles.buttonContainer}>
                      <Button style={styles.button} onPress={() => setStep(2)}>
                        Next
                      </Button>
                    </View>
                  </View>
                )}

                {step === 2 && (
                  <View>
                    <Input
                      style={styles.input}
                      label="Customer Name"
                      placeholder="Enter customer name"
                      value={values.customerName}
                      onChangeText={handleChange("customerName")}
                      onBlur={handleBlur("customerName")}
                      status={
                        touched.customerName && errors.customerName
                          ? "danger"
                          : "basic"
                      }
                      caption={
                        touched.customerName && errors.customerName
                          ? errors.customerName
                          : ""
                      }
                    />

                    <Input
                      style={styles.input}
                      label="Email"
                      placeholder="Enter email"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      status={
                        touched.email && errors.email ? "danger" : "basic"
                      }
                      caption={
                        touched.email && errors.email ? errors.email : ""
                      }
                    />

                    <Input
                      style={styles.input}
                      label="Phone"
                      placeholder="Enter phone number"
                      value={values.phone}
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      keyboardType="phone-pad"
                      status={
                        touched.phone && errors.phone ? "danger" : "basic"
                      }
                      caption={
                        touched.phone && errors.phone ? errors.phone : ""
                      }
                    />

                    <Input
                      style={styles.input}
                      label="Company Name"
                      placeholder="Enter company name"
                      value={values.companyName}
                      onChangeText={handleChange("companyName")}
                      onBlur={handleBlur("companyName")}
                      status={
                        touched.companyName && errors.companyName
                          ? "danger"
                          : "basic"
                      }
                      caption={
                        touched.companyName && errors.companyName
                          ? errors.companyName
                          : ""
                      }
                    />

                    <Input
                      style={styles.input}
                      label="Address"
                      placeholder="Enter address"
                      value={values.address}
                      onChangeText={handleChange("address")}
                      onBlur={handleBlur("address")}
                      status={
                        touched.address && errors.address ? "danger" : "basic"
                      }
                      caption={
                        touched.address && errors.address ? errors.address : ""
                      }
                    />

                    <Input
                      style={styles.input}
                      label="GST Number"
                      placeholder="Enter GST number"
                      value={values.gstNo}
                      onChangeText={handleChange("gstNo")}
                      onBlur={handleBlur("gstNo")}
                      status={
                        touched.gstNo && errors.gstNo ? "danger" : "basic"
                      }
                      caption={
                        touched.gstNo && errors.gstNo ? errors.gstNo : ""
                      }
                    />

                    <Select
                      style={styles.input}
                      label="Delivery Option"
                      placeholder="Select delivery option"
                      selectedIndex={values.deliveryOption}
                      onSelect={(index) => {
                        setFieldValue("deliveryOption", index);
                      }}
                    >
                      {deliveryOptions.map((option, index) => (
                        <SelectItem key={index} title={option} />
                      ))}
                    </Select>

                    <Datepicker
                      label="Date"
                      date={date}
                      onSelect={setDate}
                      style={styles.input}
                    />

                    <View style={styles.buttonContainer}>
                      <Button style={styles.button} onPress={handleSubmit}>
                        Submit
                      </Button>
                      <Button style={styles.button} onPress={() => setStep(1)}>
                        Back
                      </Button>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </Formik>
        </Layout>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  input: {
    marginVertical: 10,
  },
  table: {
    marginVertical: 10,
  },
  tableContent: {
    paddingBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
  },
  quantityInput: {
    width: "20%",
  },
  deleteButton: {
    width: "10%",
  },
  customProductContainer: {
    marginVertical: 10,
  },
  customProductRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customProductInput: {
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default QuotationFormDialog;
