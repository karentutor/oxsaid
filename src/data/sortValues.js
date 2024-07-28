import { geoData } from './geoData.js';
import fs from 'fs';

// Function to sort the keys and values
function sortGeoData(data) {
  const sortedData = {};

  // Get the keys and sort them
  const keys = Object.keys(data).sort();

  // Iterate over each key
  keys.forEach(key => {
    // Sort the array values
    sortedData[key] = data[key].sort((a, b) => a.localeCompare(b));
  });

  return sortedData;
}

// Sort the geoData object
const sortedGeoData = sortGeoData(geoData);

// Convert the sorted object to a string
const sortedGeoDataString = 'export const geoData = ' + JSON.stringify(sortedGeoData, null, 2) + ';';

// Write the sorted object to a new file
fs.writeFileSync('sortedGeoData.js', sortedGeoDataString);

console.log('Sorted data has been written to sortedGeoData.js');

