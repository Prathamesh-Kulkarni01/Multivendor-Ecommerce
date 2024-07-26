import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Button,
  ScrollView,
} from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";
// import { generateInvoiceNumber } from './utils'; // Utility function to generate unique invoice numbers
const generateInvoiceNumber = () => {
  return Math.floor(Math.random() * 10);
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [client, setClient] = useState({ name: "", address: "", email: "" });
  const [currency, setCurrency] = useState("USD");
  const [orderLines, setOrderLines] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [header, setHeader] = useState("BuildMart360");
  const [footer, setFooter] = useState("Thank you for your business!");
  const [deliveryCost, setDeliveryCost] = useState(5.0);
  const [taxRate, setTaxRate] = useState(0.1); // 10%
  const [discount, setDiscount] = useState(0); // Discount in percentage
  const [paymentTerms, setPaymentTerms] = useState("Due on Receipt");
  const [dueDate, setDueDate] = useState("");

  const templates = {
    template1: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .header h1 { font-size: 24px; margin: 0; }
            .header p { margin: 5px 0; }
            .invoice-title { text-align: center; margin-top: 20px; margin-bottom: 20px; font-size: 22px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${header}</h1>
            <p>1234 Market Street</p>
            <p>City, State, 56789</p>
            <p>Email: info@buildmart360.com | Phone: (123) 456-7890</p>
          </div>
          <div class="invoice-title">
            <h2>Invoice #${invoiceNumber}</h2>
            <p>Client: ${client.name}</p>
            <p>Address: ${client.address}</p>
            <p>Email: ${client.email}</p>
            <p>Due Date: ${dueDate}</p>
            <p>Payment Terms: ${paymentTerms}</p>
          </div>
          <table>
            <tr>
              <th>Description</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
            ${orderLines
              .map(
                (line) => `
              <tr key=${line.id}>
                <td>${line.description}</td>
                <td>${line.product}</td>
                <td>${line.quantity}</td>
                <td>${currency} ${line.price}</td>
              </tr>
            `

              )
              .join("")}
            <tr>
              <td colspan="3" class="total">Subtotal</td>
              <td class="total">${currency} ${orderLines
      .reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      )
      .toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="total">Delivery</td>
              <td class="total">${currency} ${deliveryCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="total">Tax (${(taxRate * 100).toFixed(
                0
              )}%)</td>
              <td class="total">${currency} ${(
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) * taxRate
    ).toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="total">Discount</td>
              <td class="total">${currency} ${(
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) *
      (discount / 100)
    ).toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="total">Total</td>
              <td class="total">${currency} ${(
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) +
      deliveryCost +
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) *
        taxRate -
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) *
        (discount / 100)
    ).toFixed(2)}</td>
            </tr>
          </table>
          <div class="footer">${footer}</div>
        </body>
      </html>
    `,
    template2: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .header h1 { font-size: 24px; margin: 0; color: #4CAF50; }
            .header p { margin: 5px 0; }
            .invoice-title { text-align: center; margin-top: 20px; margin-bottom: 20px; font-size: 22px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            .total { font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${header}</h1>
            <p>1234 Market Street</p>
            <p>City, State, 56789</p>
            <p>Email: info@buildmart360.com | Phone: (123) 456-7890</p>
          </div>
          <div class="invoice-title">
            <h2>Invoice #${invoiceNumber}</h2>
            <p>Client: ${client.name}</p>
            <p>Address: ${client.address}</p>
            <p>Email: ${client.email}</p>
            <p>Due Date: ${dueDate}</p>
            <p>Payment Terms: ${paymentTerms}</p>
          </div>
          <table>
            <tr>
              <th>Description</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
            ${orderLines
              .map(
                (line) => `
              <tr key=${line.id}>
                <td>${line.description}</td>
                <td>${line.product}</td>
                <td>${line.quantity}</td>
                <td>${currency} ${line.price}</td>
              </tr>
            `
              )
              .join("")}
            <tr>
              <td colspan="3" class="total">Subtotal</td>
              <td class="total">${currency} ${orderLines
      .reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      )
      .toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="total">Delivery</td>
              <td class="total">${currency} ${deliveryCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="total">Tax (${(taxRate * 100).toFixed(
                0
              )}%)</td>
              <td class="total">${currency} ${(
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) * taxRate
    ).toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="total">Discount</td>
              <td class="total">${currency} ${(
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) *
      (discount / 100)
    ).toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="total">Total</td>
              <td class="total">${currency} ${(
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) +
      deliveryCost +
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) *
        taxRate -
      orderLines.reduce(
        (sum, line) =>
          sum + line.quantity * parseFloat(line.price.substring(1)),
        0
      ) *
        (discount / 100)
    ).toFixed(2)}</td>
            </tr>
          </table>
          <div class="footer">${footer}</div>
        </body>
      </html>
    `,
  };

  const generatePDF = async () => {
    setIsLoading(true);
    const html = templates[selectedTemplate];
    try {
      const { uri } = await Print.printToFileAsync({ html });
      console.log("File has been saved to:", uri);

      // Read the file as base64
      const pdfBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setPdfBase64(pdfBase64);
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      Alert.alert("Error", "An error occurred while generating the PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.quantity && newProduct.price) {
      setOrderLines([
        ...orderLines,
        {
          id: Date.now().toString(),
          product: newProduct.name,
          quantity: parseInt(newProduct.quantity, 10),
          price: `$${parseFloat(newProduct.price).toFixed(2)}`,
          description: newProduct.description,
        },
      ]);
      setNewProduct({ name: "", quantity: "", price: "", description: "" });
    } else {
      Alert.alert("Error", "Please fill all fields");
    }
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      const updatedLines = orderLines.map((line) =>
        line.id === editingProduct.id
          ? {
              ...line,
              product: newProduct.name || line.product,
              quantity: newProduct.quantity
                ? parseInt(newProduct.quantity, 10)
                : line.quantity,
              price: newProduct.price
                ? `$${parseFloat(newProduct.price).toFixed(2)}`
                : line.price,
              description: newProduct.description || line.description,
            }
          : line
      );
      setOrderLines(updatedLines);
      setEditingProduct(null);
      setNewProduct({ name: "", quantity: "", price: "", description: "" });
    }
  };

  const handleEditProduct = (item) => {
    setNewProduct({
      name: item.product,
      quantity: item.quantity.toString(),
      price: item.price.substring(1),
      description: item.description,
    });
    setEditingProduct(item);
  };

  const handleRemoveProduct = (id) => {
    setOrderLines(orderLines.filter((line) => line.id !== id));
  };

  if (isLoading) {
    return <Text>Generating PDF...</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Picker
          selectedValue={selectedTemplate}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue) => setSelectedTemplate(itemValue)}
        >
          <Picker.Item label="Template 1" value="template1" />
          <Picker.Item label="Template 2" value="template2" />
        </Picker>
        <TextInput
          placeholder="Invoice Number"
          value={invoiceNumber}
          onChangeText={setInvoiceNumber}
          style={styles.input}
        />
        <TextInput
          placeholder="Client Name"
          value={client.name}
          onChangeText={(text) => setClient({ ...client, name: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Client Address"
          value={client.address}
          onChangeText={(text) => setClient({ ...client, address: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Client Email"
          value={client.email}
          onChangeText={(text) => setClient({ ...client, email: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Currency"
          value={currency}
          onChangeText={setCurrency}
          style={styles.input}
        />
        <TextInput
          placeholder="Header"
          value={header}
          onChangeText={setHeader}
          style={styles.input}
        />
        <TextInput
          placeholder="Footer"
          value={footer}
          onChangeText={setFooter}
          style={styles.input}
        />
        <TextInput
          placeholder="Delivery Cost"
          value={deliveryCost.toString()}
          keyboardType="numeric"
          onChangeText={(text) => setDeliveryCost(parseFloat(text) || 0)}
          style={styles.input}
        />
        <TextInput
          placeholder="Tax Rate (%)"
          value={(taxRate * 100).toString()}
          keyboardType="numeric"
          onChangeText={(text) => setTaxRate(parseFloat(text) / 100 || 0)}
          style={styles.input}
        />
        <TextInput
          placeholder="Discount (%)"
          value={discount.toString()}
          keyboardType="numeric"
          onChangeText={(text) => setDiscount(parseFloat(text) || 0)}
          style={styles.input}
        />
        <TextInput
          placeholder="Payment Terms"
          value={paymentTerms}
          onChangeText={setPaymentTerms}
          style={styles.input}
        />
        <TextInput
          placeholder="Due Date"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Product Name"
          value={newProduct.name}
          onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Quantity"
          value={newProduct.quantity}
          keyboardType="numeric"
          onChangeText={(text) =>
            setNewProduct({ ...newProduct, quantity: text })
          }
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={newProduct.price}
          keyboardType="numeric"
          onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={newProduct.description}
          onChangeText={(text) =>
            setNewProduct({ ...newProduct, description: text })
          }
          style={styles.input}
        />
        {editingProduct ? (
          <Pressable style={styles.button} onPress={handleUpdateProduct}>
            <Text style={styles.text}>Update Product</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={handleAddProduct}>
            <Text style={styles.text}>Add Product</Text>
          </Pressable>
        )}
        <Pressable style={styles.button} onPress={generatePDF}>
          <Text style={styles.text}>Generate PDF</Text>
        </Pressable>
        <FlatList
          data={orderLines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productRow}>
              <Text>{item.description}</Text>
              <Text>{item.product}</Text>
              <Text>{item.quantity}</Text>
              <Text>{item.price}</Text>
              <Button title="Edit" onPress={() => handleEditProduct(item)} />
              <Button
                title="Remove"
                onPress={() => handleRemoveProduct(item.id)}
              />
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aac",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default App;
