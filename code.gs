//this function creates the html
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('ClusterSignUp')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


//identifies spreadsheet
var ss = SpreadsheetApp.openById('1TqcXN0mufW1KlRP8NeJuQVOE-ZPZHxAfhPM5WxwuZgY');
var clusterSheet = ss.getSheets()[1];
var studentSheet = ss.getSheets()[0];

var clusterList = [];
var studentList = [];

var clusterSheetRange = clusterSheet.getRange(1, 1, clusterSheet.getMaxRows(), clusterSheet.getMaxColumns());
var clusterObjects = getRowsData(clusterSheet, clusterSheetRange);

var studentSheetRange = studentSheet.getRange(1, 1, studentSheet.getMaxRows(), studentSheet.getMaxColumns());
var studentObjects = getRowsData(studentSheet, studentSheetRange);


//retrieves the list of clusters
function getClusterList() {
  for (var i = 1; i < clusterObjects.length; ++i) {
    var rowData = clusterObjects[i];
    clusterList[i] = rowData.clusterName;
  }
  clusterList.shift();
  // Logger.log(clusterList);
  return clusterList;
}

//retrieves the list of students
function autoComplete() {
  for (var i = 1; i < studentObjects.length; ++i) {
    var rowData = studentObjects[i];
    studentList[i] = rowData.studentName;
  }
  //Logger.log(studentList);
  return studentList;
}


//retrieves student's email
function getStudentEmail(form) {
  var nameBox = form.studentName.toString();

  for (var i = 1; i < studentObjects.length; ++i) {
    var rowData = studentObjects[i];


    var nn = rowData.studentName.indexOf(nameBox);
    //if nameBox and studentName are the same than n will equal 1, if not it will equal -1
    if (nn === -1) {
      continue;
    }

    var studentEmail = rowData.email;
  }
  Logger.log(studentEmail);

  return studentEmail;
}


function checkLevel(form){
  var clusterBox = form.clusterName;
  var nameBox = form.studentName.toString();
  var levelVer = false;


   for (var i = 1; i < studentObjects.length; ++i) {
    var rowData = studentObjects[i];


    var nn = rowData.studentName.indexOf(nameBox);
    //if nameBox and studentName are the same than n will equal 1, if not it will equal -1
    if (nn === -1) {
      continue;
    }

    var lsLevel = rowData.lsLevel;
    var rwLevel = rowData.rwLevel;
    
   
     lsLevel = numberLevel(lsLevel);
     rwLevel = numberLevel(rwLevel); 
     Logger.log("lsLevel is " +lsLevel);
    for (var i = 1; i < clusterObjects.length; ++i) {
      var rowDataCluster = clusterObjects[i];
    
      var clusterNN = rowDataCluster.clusterName.indexOf(clusterBox);
    
       if (clusterNN === -1) {
        continue;
      }
    
      var lsClusterLevel = rowDataCluster.lsLevel;
      var rwClusterLevel = rowDataCluster.rwLevel;
      Logger.log("lsClusterLevel is " + lsClusterLevel);
      
      if(lsLevel >= lsClusterLevel && rwLevel >= rwClusterLevel) {
      levelVer = true;
      }else{
      levelVer = false;
      }
  }
    
  }






  return levelVer;
}







function checkAvailibility(form){
var clusterBox = form.clusterName;
var clusterAvailible = false;  
  for (var i = 1; i < clusterObjects.length; ++i) {
    var rowData = clusterObjects[i];
    
    var nn = rowData.clusterName.indexOf(clusterBox);
    
    if (nn === -1) {
      continue;
    }

    var clusterSize = rowData.size;
    if(clusterSize < 6){
      clusterSize++;
      var sizeCell = clusterSheet.getRange(i,8);
      Logger.log(sizeCell.getValue());
      sizeCell.setValue(clusterSize);
      clusterAvailible = true;
    }else{
      clusterAvailible = false;
    }
    
  }





return clusterAvailible;
}



function numberLevel(level) {
  switch (level) {
    case "I":
      level = "1";
      break;
   case "II":
      level = "2";
      break;
   case "III":
      level = "3";
      break;   
   case "IV":
      level = "4";
      break;  
   case "V":
      level = "5";
      break;
   case "VI":
      level = "5";
      break;
  }
  return level;
};






//////////////////////////////////////////////////////////////////////////////////////////
//
// The code below is reused from the 'Reading Spreadsheet data using JavaScript Objects'
// tutorial.
//
//////////////////////////////////////////////////////////////////////////////////////////

// getRowsData iterates row by row in the input range and returns an array of objects.
// Each object contains all the data for a given row, indexed by its normalized column name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range; 
// Returns an Array of objects.
function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  //Logger.log(numColumns);
  var headersRange = sheet.getRange(1, 1, 1, sheet.getMaxColumns());
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}

// For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

// Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}

// Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

// Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}

// Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

// Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}