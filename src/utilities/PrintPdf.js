import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

// Company details
const companyDetails = {
  name: "BuildMart360",
  address: "1234 Construction St, Bengaluru, Karnataka, 560001",
  contact: "+91 98765 43210",
  gstNo: "29ABCDE1234F1Z5",
};

// Generate Invoice HTML
const createInvoiceHtml = (data) => {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr class="item">
      <td style="width:25%;">${item.productId.title}</td>
      <td style="width:10%; text-align:center;">${item.quantity}</td>
      <td style="width:10%; text-align:right;">${item.productId.price}</td>
      <td style="width:15%; text-align:right;">${item.taxRate || "0%"}</td>
      <td style="width:15%; text-align:right;">${item.taxAmount || 0}</td>
      <td style="width:15%; text-align:right;">${item.quantity * item.productId.price + (item.taxAmount || 0)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            margin: 20px;
            color: #555;
          }
          .invoice-box {
            max-width: 890px;
            margin: auto;
            padding: 10px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 14px;
            line-height: 24px;
          }
          .top_rw {
            background-color: #f4f4f4;
          }
          table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-bottom: solid 1px #ccc;
          }
          table td {
            padding: 5px;
            vertical-align: middle;
          }
          table tr td:nth-child(2) {
            text-align: right;
          }
          table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            font-size: 12px;
          }
          table tr.item td {
            border-bottom: 1px solid #eee;
          }
          table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table cellpadding="0" cellspacing="0">
            <tr class="top_rw">
              <td colspan="2">
                <h2 style="margin-bottom: 0px;">Tax invoice/Bill of Supply/Cash memo</h2>
                <span style="">Number: ${data.invoiceNumber} Date: ${new Date(data.createdAt).toLocaleDateString()}</span>
              </td>
              <td style="width:30%; margin-right: 10px;">
                PaytmMall Order Id: ${data.orderId}
              </td>
            </tr>
            <tr class="top">
              <td colspan="3">
                <table>
                  <tr>
                    <td>
                      <b>Sold By: ${companyDetails.name}</b> <br>
                      ${companyDetails.address} <br>
                      Contact: ${companyDetails.contact} <br>
                      GST No: ${companyDetails.gstNo} <br>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr class="information">
              <td colspan="3">
                <table>
                  <tr>
                    <td colspan="2">
                      <b>Shipping Address: ${data.shippingAddress.name}</b> <br>
                      ${data.shippingAddress.address} <br>
                      ${data.shippingAddress.contact} <br>
                      ${data.shippingAddress.email} <br>
                      ${data.shippingAddress.website} <br>
                    </td>
                    <td>
                      <b>Billing Address: ${data?.billingAddress?.name}</b><br>
                      ${data?.billingAddress?.companyName}<br>
                      ${data?.billingAddress?.contactPerson}<br>
                      ${data?.billingAddress?.email}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <table cellspacing="0px" cellpadding="2px">
                  <tr class="heading">
                    <td style="width:25%;">ITEM</td>
                    <td style="width:10%; text-align:center;">QTY.</td>
                    <td style="width:10%; text-align:right;">PRICE (INR)</td>
                    <td style="width:15%; text-align:right;">TAX RATE & TYPE</td>
                    <td style="width:15%; text-align:right;">TAX AMOUNT (INR)</td>
                    <td style="width:15%; text-align:right;">TOTAL AMOUNT (INR)</td>
                  </tr>
                  ${itemsHtml}
                  <tr class="item">
                    <td style="width:25%;"><b>Grand Total</b></td>
                    <td style="width:10%; text-align:center;">${data.totalQuantity}</td>
                    <td style="width:10%; text-align:right;">${data.totalPrice}</td>
                    <td style="width:15%; text-align:right;"></td>
                    <td style="width:15%; text-align:right;">${data.totalTax}</td>
                    <td style="width:15%; text-align:right;">${data.grandTotal}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr class="total">
              <td colspan="3" align="right">Total Amount in Words: <b>${data.totalAmountInWords}</b></td>
            </tr>
            <tr>
              <td colspan="3">
                <table cellspacing="0px" cellpadding="2px">
                  <tr>
                    <td width="50%">
                      <b>Declaration:</b> <br>
                      We declare that this invoice shows the actual price of the goods described above and that all particulars are true and correct. The goods sold are intended for end-user consumption and not for resale.
                    </td>
                    <td>
                      * This is a computer-generated invoice and does not require a physical signature
                    </td>
                  </tr>
                  <tr>
                    <td width="50%"></td>
                    <td>
                      <b>Authorized Signature</b>
                      <br><br>
                      ...................................
                      <br><br><br>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;
};


export default function PrintPdf({ type, data }) {
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const isInvoice = type === "invoice";

  const print = async (html) => {
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const printToFile = async (html) => {
    const { uri } = await Print.printToFileAsync({
      html,
    });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync();
    setSelectedPrinter(printer);
  };

  return (
    <View>
      {isInvoice && (
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            accessoryLeft={() => <Ionicons name="print" size={24} color="white" />}
            onPress={() => print(createInvoiceHtml(data))}
          >
            Print Invoice
          </Button>
          <Button
            style={styles.button}
            accessoryLeft={() => <Ionicons name="download" size={24} color="white" />}
            onPress={() => printToFile(createInvoiceHtml(data))}
          >
            Download Invoice
          </Button>
        </View>
      )}
      {Platform.OS === "ios" && (
        <>
          <Button
            style={styles.button}
            accessoryLeft={() => <Ionicons name="print" size={24} color="white" />}
            onPress={selectPrinter}
          >
            Select Printer
          </Button>
          {selectedPrinter && (
            <Text category="label" style={styles.printer}>
              {`Selected printer: ${selectedPrinter.name}`}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    marginRight: 5,
  },
  printer: {
    textAlign: "center",
    marginTop: 10,
  },
});
