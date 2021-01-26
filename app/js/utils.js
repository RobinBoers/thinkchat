// This file is part of ThinkChat which is released under the MIT license.
// See file LICENSE or go to https://github.com/RobinBoers/thinkchat/blob/main/LICENSE 
// for full license details.

// This document includes some utility functions used in
// other parts of the code

// Totally not copied from StackOverflow :D


// Generate random 4 digit PIN.
// Used for unique nicknames
function generatePin() {
  (min = 0), (max = 9999);
  return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-4);
}

// Create hash from string.
// Used for the random color per name thingie
function hashCode(str) {
  // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Make a interger into RGB.
// Also used for the random color per 
// name thingie
function intToRGB(i) {
  var c = (i & 0x00ffffff).toString(16).toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}


// Adjust colors. Used to prevent over-saturated
// colors as name-color
function LightenDarkenColor(col, amt) {
  var usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}