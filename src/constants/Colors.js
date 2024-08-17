const colors = {
  primary: "#FB6831",
  primary_light: "#FFC8B2",
  primary_shadow: "#FB6A04",
  secondary: "#31C4FB",
  tertiary: "#AEE8FD",
  success: "#90ee90",
  danger: "#FF4848",
  shadow: "#E7E8EA",
  warning: "#FBD431",
  info: "#F8F9FA",
  light: "#F5F5F5",
  dark: "#343A3F",
  muted: "#707981",
  white: "#FFFFFF",
};
export default colors;
// src/custom-theme.js

import { light } from '@eva-design/eva';

export const customTheme = {
  ...light,
  'color-primary-100': '#FFC8B2',   // primary_light
  'color-primary-200': '#FB6831',   // primary
  'color-primary-300': '#FB6A04',   // primary_shadow
  'color-primary-400': '#FB6A04',   // Use the same for now
  'color-primary-500': '#FB6831',   // primary
  'color-primary-600': '#FB6A04',   // primary_shadow
  'color-primary-700': '#FB6A04',   // primary_shadow
  'color-primary-800': '#FB6831',   // primary
  'color-primary-900': '#FB6831',   // primary

  'color-secondary-100': '#AEE8FD', // tertiary
  'color-secondary-200': '#31C4FB', // secondary
  'color-secondary-300': '#31C4FB', // secondary
  'color-secondary-400': '#31C4FB', // secondary
  'color-secondary-500': '#31C4FB', // secondary

  'color-success-100': '#DFF2DF', // Lightened version of success
  'color-success-200': '#AEEFB2', // Lightened version of success
  'color-success-300': '#90ee90', // success
  'color-success-400': '#70D770', // Adjusted for a gradient
  'color-success-500': '#50C050', // Adjusted for a gradient

  'color-danger-100': '#FFB2B2',   // Lightened version of danger
  'color-danger-200': '#FF8484',   // Lightened version of danger
  'color-danger-300': '#FF4848',   // danger
  'color-danger-400': '#D73838',   // Darkened for a gradient
  'color-danger-500': '#B52828',   // Darkened for a gradient

  'color-warning-100': '#FBE8B2',  // Lightened version of warning
  'color-warning-200': '#FBD431',  // warning
  'color-warning-300': '#FBCC04',  // Darkened for a gradient
  'color-warning-400': '#EBA604',  // Darkened for a gradient
  'color-warning-500': '#D97F04',  // Darkened for a gradient

  'color-info-100': '#F8F9FA',     // info
  'color-info-200': '#D8D9DA',     // Adjusted for a gradient
  'color-info-300': '#B8B9BA',     // Adjusted for a gradient
  'color-info-400': '#98999A',     // Adjusted for a gradient
  'color-info-500': '#787979',     // Adjusted for a gradient

  'color-basic-100': '#FFFFFF',    // white
  'color-basic-200': '#F5F5F5',    // light
  'color-basic-300': '#E7E8EA',    // shadow
  'color-basic-400': '#D7D8DA',    // Adjusted for a gradient
  'color-basic-500': '#C7C8CA',    // Adjusted for a gradient
  'color-basic-600': '#707981',    // muted
  'color-basic-700': '#343A3F',    // dark
};
