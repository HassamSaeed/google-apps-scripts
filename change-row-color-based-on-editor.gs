/* 
Product: Google Apps Script
Copyrights: © GSheets.com
About the Script: This Script will add the sheet editor email in the last column of the specified sheet and will change the color of the row based on the user. 

How To Use It:
1. Goto https://script.google.com/home
2. Make A new Script
3. Paste the Following Script In Your Script
4. Change Global Variables(lines 29-30 below) as per your requirements.
5. Save the file
6. Refresh Your Google Sheet. After Refreshing, you will see "GSheets.com" in the menu. 
7. Click on GSheets.com in the menu and then click on "Add Trigger"
8. Authorize the script to add the trigger and you are ready to use it.
Note: All the users of the sheets will have to follow this process in order to run the script properly.

Youtube Video Tutorial on how to use this script:
https://www.youtube.com/c/GSheets/playlists

Get a Copy of the Sheet in Action at:
https://docs.google.com/spreadsheets/d/1lXo3xo2HVURquy-58GUNIujjrvuqym9ytmO0Wh4WICk/copy
*/


// =============================================================================================
// =============  Global Variables - Change this section according to your needs ===============
// =============================================================================================

const SOURCE_SHEET_NAME = "Sheet1";
const USERS_SHEET_NAME = 'USERS';


// =============================================================================================
// ==================  Script - Change it if you are sure about it =============================
// =============================================================================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  // Create a custom menu in the Google Sheets UI
  ui.createMenu('GSheets.com')
    .addItem('Add Trigger', 'addEditTrigger')
    .addItem('Remove Trigger', 'removeEditTrigger')
    .addToUi();
}

function addEditTrigger() {
  var existingTriggers = ScriptApp.getProjectTriggers();
  var triggerAlreadyExists = false;

  // Check if there is an existing onEdit trigger
  for (var i = 0; i < existingTriggers.length; i++) {
    var trigger = existingTriggers[i];
    if (trigger.getEventType() === ScriptApp.EventType.ON_EDIT &&
        trigger.getHandlerFunction() === 'editTrigger') {
      triggerAlreadyExists = true;
      break;
    }
  }

  if (!triggerAlreadyExists) {
    // Create a new onEdit trigger
    ScriptApp.newTrigger('editTrigger')
      .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
      .onEdit()
      .create();
    
    // Inform the user that the trigger has been added
    SpreadsheetApp.getUi().alert('The "onEdit" trigger has been added.');
  } else {
    // Inform the user that the trigger already exists
    SpreadsheetApp.getUi().alert('The "onEdit" trigger already exists.');
  }
}

function removeEditTrigger() {
  var existingTriggers = ScriptApp.getProjectTriggers();

  // Find and remove the onEdit trigger for "editTrigger"
  for (var i = 0; i < existingTriggers.length; i++) {
    var trigger = existingTriggers[i];
    if (trigger.getEventType() === ScriptApp.EventType.ON_EDIT &&
        trigger.getHandlerFunction() === 'editTrigger') {
      ScriptApp.deleteTrigger(trigger);
      
      // Inform the user that the trigger has been removed
      SpreadsheetApp.getUi().alert('The "onEdit" trigger has been removed.');
      return;
    }
  }
  
  // Inform the user if no trigger was found
  SpreadsheetApp.getUi().alert('No "onEdit" trigger found to remove.');
}

function editTrigger(e) {

  const USERS =  e.source.getSheetByName(USERS_SHEET_NAME).getRange('B2:C').getValues().reduce((p,c,i) => !c[0] ? p : ({...p, [c[0]]: c[1]}), {});

  let user = Session.getActiveUser().getEmail(); // Get the email address of the user
  
  if(!user) return;

  let sheet = e.source.getSheetByName(SOURCE_SHEET_NAME); // Replace with your sheet's name
  let range = e.range;

  // Get the row and column of the edited cell
  let row = range.getRow();
  let lastCol = sheet.getLastColumn();

  // Set the user's email in the last column of the edited row
  sheet.getRange(row, lastCol).setValue(user);
  sheet.getRange(row + ':' + row).setBackground(USERS[user]);
}
