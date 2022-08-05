const API_KEY = '____________'; // Its preferrable to use property service to store API key.
const COMPANY_NAME = '____________';

function firstFetchRequest() {
  PropertiesService.getScriptProperties().setProperty('next_offset','first')
  fetchRequest();
}

function fetchRequest() {
  let nextOffset = PropertiesService.getScriptProperties().getProperty('next_offset');
  if (!nextOffset) return;
  let url = `https://${COMPANY_NAME}.chargebee.com/api/v2/transactions?limit=100` + (nextOffset && nextOffset !== 'first' ? '&next_offset=' + Utilities.base64Encode(nextOffset) : '');
  let user = API_KEY;
  let password = "";

  let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Basic " + Utilities.base64Encode(user + ":" + password)
  };

  let options = {
    "method": "get",
    "headers": headers,
    "muteHttpExceptions":true,
  };
  let response = UrlFetchApp.fetch(url, options).getContentText();
  let parsedResponse = JSON.parse(response);
  postToGSheets(parsedResponse.list);
  PropertiesService.getScriptProperties().setProperty('next_offset',parsedResponse.next_offset)
  fetchRequest(parsedResponse.next_offset);
}

function postToGSheets(data) {
  let dataArr = data.map(data => {
    return [
        data.transaction.id,
        data.transaction.customer_id,
        data.transaction.date,
        data.transaction.type,
        data.transaction.payment_method,
        data.transaction.amount,
        data.transaction.status,
        data.transaction.gateway,
        data.transaction.id_at_gateway,
        data.transaction.currency_code,
        data.transaction.amount_unused,
        data.transaction.gateway_account_id
    ];
  })

  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  let lastRow = sheet.getDataRange().getLastRow()+1;
  sheet.getRange(lastRow, 1,dataArr.length, dataArr[0].length).setValues(dataArr);
}
