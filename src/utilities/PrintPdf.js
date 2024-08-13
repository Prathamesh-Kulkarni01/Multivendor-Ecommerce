import React from 'react';
import { View, StyleSheet, Button, Platform, Text } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

// Company details
const companyDetails = {
  name: 'BuildMart360',
  address: '1234 Construction St, Bengaluru, Karnataka, 560001',
  contact: '+91 98765 43210',
  gstNo: '29ABCDE1234F1Z5'
};

// Dummy data for invoice and quotation
const invoiceData = {
  invoiceNo: 'INV-001',
  date: '2024-08-14',
  customerName: 'John Doe',
  items: [
    { description: 'Cement', quantity: 10, unitPrice: 50, total: 500 },
    { description: 'Bricks', quantity: 200, unitPrice: 1, total: 200 },
  ],
  discount: 50,
  tax: 40,
  gst: 90,
  deliveryCharge: 20,
  gstExemption: 'None',
  notes: 'Thank you for your business!'
};

const quotationData = {
  quotationNo: 'QUOT-001',
  date: '2024-08-14',
  customerName: 'Jane Smith',
  items: [
    { description: 'Sand', quantity: 5, unitPrice: 100, total: 500 },
    { description: 'Steel', quantity: 20, unitPrice: 150, total: 3000 },
  ],
  discount: 100,
  tax: 200,
  gst: 360,
  deliveryCharge: 50,
  gstExemption: 'None',
  notes: 'This quotation is valid for 30 days.'
};

const createInvoiceHtml = () => {
  const itemsHtml = invoiceData.items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.unitPrice}</td>
      <td>${item.total}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
          }
          .company-info {
            width: 50%;
          }
          .invoice-info {
            width: 50%;
            text-align: right;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid #000;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h2>${companyDetails.name}</h2>
            <p>${companyDetails.address}</p>
            <p>Contact: ${companyDetails.contact}</p>
            <p>GST No: ${companyDetails.gstNo}</p>
          </div>
          <div class="invoice-info">
            <h2>Invoice</h2>
            <p>Invoice No: ${invoiceData.invoiceNo}</p>
            <p>Date: ${invoiceData.date}</p>
            <p>Customer: ${invoiceData.customerName}</p>
          </div>
        </div>
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <h3>Summary</h3>
        <p>Discount: ${invoiceData.discount}</p>
        <p>Tax: ${invoiceData.tax}</p>
        <p>GST: ${invoiceData.gst}</p>
        <p>Delivery Charge: ${invoiceData.deliveryCharge}</p>
        <p>GST Exemption: ${invoiceData.gstExemption}</p>
        <p>Notes: ${invoiceData.notes}</p>
      </body>
    </html>
  `;
};

const createQuotationHtml = () => {
  const itemsHtml = quotationData.items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.unitPrice}</td>
      <td>${item.total}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
          }
          .company-info {
            width: 50%;
          }
          .quotation-info {
            width: 50%;
            text-align: right;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid #000;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h2>${companyDetails.name}</h2>
            <p>${companyDetails.address}</p>
            <p>Contact: ${companyDetails.contact}</p>
            <p>GST No: ${companyDetails.gstNo}</p>
          </div>
          <div class="quotation-info">
            <h2>Quotation</h2>
            <p>Quotation No: ${quotationData.quotationNo}</p>
            <p>Date: ${quotationData.date}</p>
            <p>Customer: ${quotationData.customerName}</p>
          </div>
        </div>
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <h3>Summary</h3>
        <p>Discount: ${quotationData.discount}</p>
        <p>Tax: ${quotationData.tax}</p>
        <p>GST: ${quotationData.gst}</p>
        <p>Delivery Charge: ${quotationData.deliveryCharge}</p>
        <p>GST Exemption: ${quotationData.gstExemption}</p>
        <p>Notes: ${quotationData.notes}</p>
      </body>
    </html>
  `;
};

export default function PrintPdf() {
  const [selectedPrinter, setSelectedPrinter] = React.useState();

  const print = async (html) => {
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  }

  const printToFile = async (html) => {
    const { uri } = await Print.printToFileAsync({
      html
    });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  }

  return (
    <View>
      <Button title='Print Invoice' onPress={() => print(createInvoiceHtml())} />
      <View style={styles.spacer} />
      <Button title='Print Quotation' onPress={() => print(createQuotationHtml())} />
      <View style={styles.spacer} />
      <Button title='Print Invoice to PDF file' onPress={() => printToFile(createInvoiceHtml())} />
      <View style={styles.spacer} />
      <Button title='Print Quotation to PDF file' onPress={() => printToFile(createQuotationHtml())} />
      {Platform.OS === 'ios' &&
        <>
          <View style={styles.spacer} />
          <Button title='Select printer' onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text> : undefined}
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  spacer: {
    margin: 5,
  },
  printer: {
    textAlign: 'center',
    marginTop: 10,
  },
});
