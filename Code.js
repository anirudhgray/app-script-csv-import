function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('CSV')
    .addItem('Import CSV File', 'showImportDialog')
    .addToUi();
}

function showImportDialog() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('import_dialog.html')
    .setWidth(400)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Import CSV File');
}

function importCSV(overwrite, csvData, headerRow, transformations) {
  console.log('in app script!');
  var csvRows = csvData.split('\n');

  var sheet = SpreadsheetApp.getActiveSheet();
  var existingData = sheet.getDataRange().getValues();
  var lastRow = existingData.length;

  if (overwrite) {
    // Clear the existing data if overwrite mode is selected
    sheet.clearContents();
    lastRow = 0;
  }

  var headerRow = csvRows[0].split(',');
  for (var j = 0; j < headerRow.length; j++) {
    sheet.getRange(lastRow + 1, j + 1).setValue(headerRow[j]);
  }
  lastRow++;

  for (var i = 1; i < csvRows.length; i++) {
    var rowData = csvRows[i].split(',');

    for (var j = 0; j < rowData.length; j++) {
      var column = headerRow[j];
      var transformationType = transformations[j];
      var transformedValue = applyTransformation(
        rowData[j],
        transformationType
      );

      sheet.getRange(lastRow + 1, j + 1).setValue(transformedValue);
    }

    lastRow++;
  }
}

function applyTransformation(value, transformationType) {
  if (transformationType === 'DateFormat') {
    return applyDateFormatTransformation(value);
  } else if (transformationType === 'Square') {
    return applySquareTransformation(value);
  } else if (transformationType === 'DefaultIfEmpty') {
    return applyDefaultIfEmptyTransformation(value);
  } else {
    return value;
  }
}

function applyDateFormatTransformation(value) {
  var parts = value.split(' ');
  var day = parts[0];
  var month = parts[1];
  var year = parts[2];
  return month + ' ' + year;
}

function applySquareTransformation(value) {
  var number = parseFloat(value);
  console.log(typeof value);
  if (!isNaN(value)) {
    return number * number;
  } else {
    return value;
  }
}

function applyDefaultIfEmptyTransformation(value) {
  if (value.trim() === '') {
    return 'Default Value';
  }
  return value;
}

// can create more transforms
