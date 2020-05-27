// Product: Google Apps Script
// Copyrights: © GSheets.com
// About the Script: This Script can be used to:
// 1. Move Row From Sheet1 To Sheet2 When The Value in Some Specific Column is true and 
// 2. To Move Back Row from Sheet2 to Sheet1 (i.e Undo Move).

// How To Use It:
// Goto https://script.google.com/home
// Make A new Script
// Paste Following Script In Your Script
// Change Global Variables as per your requirements.

// =====================================================================
// Global Variables (Change These Variables As Per Your Requirement)
// =====================================================================

  var sourceSheetName = 'SHEET1-NAME';
  var sourceSheetColumnToCheck = 'COLUMN-NAME1';
   var sourceSheetColumnTriggerValue = true;

  var targetSheetName = 'SHEET2-NAME';
  var targetSheetColumnToCheck = 'COLUMN-NAME2';
   var targetSheetColumnTriggerValue = true;

// ====================================================================
// Main Script (Don't Change Following Code Unless You Know GAS Coding)
// ====================================================================

function onEdit(event) {  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = event.source.getActiveSheet();
  var r = event.source.getActiveRange();
  var header = s.getRange('1:1').getValues().reduce(function(p,n){return p.concat(n)});
  var sourceSheetColIndex = header.indexOf(sourceSheetColumnToCheck)+1;
  var targetSheetColIndex = header.indexOf(targetSheetColumnToCheck)+1;
  
  if(s.getName() == sourceSheetName && r.getColumn() == sourceSheetColIndex && r.getValue() == sourceSheetColumnTriggerValue) {
    var row = r.getRow();
    var numColumns = s.getLastColumn()-1;
    var targetSheet = ss.getSheetByName(targetSheetName);
    var lastRow = Math.max.apply(0, targetSheet.getRange('A:A').getValues().map(function(v,i){if(v!=''){return i} else {return 0}}))+2;
    targetSheet.getRange(lastRow, 1,1, numColumns).setValues(s.getRange(row, 1, 1, numColumns).getValues());
    s.deleteRow(row);
  } else if(s.getName() == targetSheetName && r.getColumn() == targetSheetColIndex && r.getValue() == targetSheetColumnTriggerValue) {
    var row = r.getRow();
    var numColumns = s.getLastColumn()-1;
    var targetSheet = ss.getSheetByName(sourceSheetName);
    var lastRow = Math.max.apply(0, targetSheet.getRange('A:A').getValues().map(function(v,i){if(v!=''){return i} else {return 0}}))+2;
    targetSheet.getRange(lastRow, 1,1, numColumns).setValues(s.getRange(row, 1, 1, numColumns).getValues());
    s.deleteRow(row);
  } 
}
