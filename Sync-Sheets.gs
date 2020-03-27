// Product: Google Apps Script
// Copyrights: © GSheets.com
// About the Script: This Script can be used to Syncronise 2 Different Google Sheets.

// How To Use It:
// Goto https://script.google.com/home
// Make A new Script
// Paste Following Script In Your Script
// Change Global Variables as per your requirements.
// Set Trigger As Per your requirements.
// Run and then Authorise Script.

// =============================================================================================
// =============  Global Variables - Change this section according to your needs ===============
// =============================================================================================

//Write the ID of the Sheet from which you want to import data
var importFromSheetId = 'SS-ID';     // ImportRange Spreadsheet ID
var importFromSheetName = 'SS-NAME';                                           // Sheet Name of importRange sheet

//Write the Name of Sheet in the Active Spreadsheet(with which this script is attached). 
var importToSheetName = 'SS2-NAME';                                            //Sheet Name where you want to store imported data

// From the sheet which you want to import data, write down the header(title) of the columns which you want to fetch.
var requiredColumns = [
                      "COL1-NAME",
                      "COL2-NAME",
					  "COL3-NAME",  // .......ColX-NAME
                       ];


// Syncronize the Import Range Column with The Current Sheet Column
// What that means is that, you have to write down the Column Names(Header) of Active Sheet(with which this script is attached) in which you want put the imported data.
// Important: 1) Sequence must be the same   2) Number of Columns must be same

var SyncColumns = [
                    "COL1-NAME",
                    "COL2-NAME",
					"COL3-NAME",  // .......ColX-NAME
                    ]


// =============================================================================================
// ============  Time Trigger - Change it if you are sure about it =============================
// =============================================================================================

function fetchData(){
  var importFromSheet = SpreadsheetApp.openById(importFromSheetId).getSheetByName(importFromSheetName);
  var importToSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(importToSheetName);
  
  var importFromData = importFromSheet.getDataRange().getValues();
  var importFromHeader = importFromData.shift();
  var requiredColumnsNumbers = requiredColumns.map(function(v){return importFromHeader.indexOf(v)})
  
  var requiredData = importFromData.map(function(v){
    var data = [];
    requiredColumnsNumbers.forEach(function(w){
      data.push(v[w])
    });
    return data;
  });
  
  var importToHeader = importToSheet.getRange('A1:1').getValues().reduce(function(p,n){return p.concat(n)});
  var SyncColumnsNumbers = SyncColumns.map(function(v){return importToHeader.indexOf(v)});
  
  SyncColumnsNumbers.forEach(function(v,i){
    var columnData = requiredData.map(function(w){return [w[i]]});
    importToSheet.getRange(2, v+1,columnData.length,1).setValues(columnData);
  });
}