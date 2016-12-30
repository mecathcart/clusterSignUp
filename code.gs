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

//for the dropdown lists and autocomplete
var clusterList = [];
var studentList = [];

//makes javascript objects out of the sheets
var clusterSheetRange = clusterSheet.getRange(1, 1, clusterSheet.getMaxRows(), clusterSheet.getMaxColumns());
var clusterObjects = getRowsData(clusterSheet, clusterSheetRange);

var studentSheetRange = studentSheet.getRange(1, 1, studentSheet.getMaxRows(), studentSheet.getMaxColumns());
var studentObjects = getRowsData(studentSheet, studentSheetRange);

//retrieves the list of clusters
function getClusterList() {
  for (var i = 1; i < clusterObjects.length; ++i) {
    var rowData = clusterObjects[i];
    var clusterName = rowData.clusterName + " " + rowData.time;
    clusterList[i] = clusterName;
  }
  clusterList.shift();
  return clusterList;
}

//retrieves the list of students
function autoComplete() {
  for (var i = 1; i < studentObjects.length; ++i) {
    var rowData = studentObjects[i];
    studentList[i] = rowData.studentName;
  }
  return studentList;
}


//retrieves student's email
function getStudentEmail(form) {
  var nameBox = form.studentName.toString();
  //loops through the students
  for (var i = 1; i < studentObjects.length; ++i) {
    var rowData = studentObjects[i];
    var nn = rowData.studentName.indexOf(nameBox);
    //if nameBox and studentName are the same than n will equal 1, if not it will equal -1
    if (nn === -1) {
      continue;
    }
    var studentEmail = rowData.email;
  }
  return studentEmail;
}

//checks the level of student and sees whether the students are eligible for the cluster they want to take
function checkLevel(form){
  var clusterBox = form.clusterName;
  clusterBox = clusterBox.slice(0,clusterBox.indexOf(" "));
  var nameBox = form.studentName.toString();
  var levelVer = false;
  //loops through the students
  for (var i = 1; i < studentObjects.length; ++i) {
    var rowData = studentObjects[i];
    var nn = rowData.studentName.indexOf(nameBox);
    //if nameBox and studentName are the same than n will equal 1, if not it will equal -1
    if (nn === -1) {
      continue;
    }
   //retrieving student levels
    var lsLevel = rowData.lsLevel;
    var rwLevel = rowData.rwLevel;   
    //converts levels into numbers
     lsLevel = numberLevel(lsLevel);
     rwLevel = numberLevel(rwLevel);   
    //loops through clusters
    for (var i = 1; i < clusterObjects.length; ++i) {
      var rowDataCluster = clusterObjects[i];
      var clusterNN = rowDataCluster.clusterName.indexOf(clusterBox);
       if (clusterNN === -1) {
        continue;
      }    
     //determines cluster level
      var lsClusterLevel = rowDataCluster.lsLevel;
      var rwClusterLevel = rowDataCluster.rwLevel;      
      //verifies whether student is a high enough level  
      if(lsLevel >= lsClusterLevel && rwLevel >= rwClusterLevel) {
      levelVer = true;
      }else{
      levelVer = false;
      }//closes if clause
    }//closes cluster loop
  }//closes student loop
  return levelVer;
}


//checks whether cluster is full or not and adds student to roster if the class is availible
function checkAvailibility(form){
Logger.log("blah blah blah");
var clusterBox = form.clusterName;
//clusterBox = clusterBox.slice(0,clusterBox.indexOf(" "));
var clusterAvailible = false;  
  //loops through clusters
  for (var i = 1; i < clusterObjects.length; ++i) {
    var rowData = clusterObjects[i];
    var clusterNameAndTime = rowData.clusterName + " " + rowData.time;
    var nn = clusterNameAndTime.indexOf(clusterBox); 
    if (nn === -1) {
      continue;
    }
//    Logger.log("adfkjas;dfkajf;");
    var clusterSize = rowData.size;
    if(clusterSize < 6){
      clusterSize++;   
    //  var columnSize = rowData.indexOf(size);
    //  Logger.log(columnSize);
      var sizeCell = clusterSheet.getRange(i+1,8);
      Logger.log(sizeCell.value);
      sizeCell.setValue(clusterSize);
      var roster = rowData.roster;
      if(roster === undefined){
        roster = [];
      }else{
         roster = roster.split();
      }
      roster.push(form.studentName);
      roster = roster.toString();
      Logger.log(roster);
      var rosterCell = clusterSheet.getRange(i+1,9);
      rosterCell.setValue(roster);      
      clusterAvailible = true;
    }else{
      clusterAvailible = false;
    }  
  }//closes for loop
return clusterAvailible;
}


//retrieves student's tutoring schedule
function getTutors(form){
  var nameBox = form.studentName;
  for (var i = 1; i < studentObjects.length; ++i) {
    var rowData = studentObjects[i];
    var nn = rowData.studentName.indexOf(nameBox);
    //if nameBox and studentName are the same than n will equal 1, if not it will equal -1
    if (nn === -1) {
      continue;
    }
      //cleans data
      rowData.day1 = spellDay(rowData.day1);
      rowData.day2 = spellDay(rowData.day2);
      rowData.time1 = extractTime(rowData.time1);
      rowData.time2 = extractTime(rowData.time2);
       //compiles tutors
      var tutor1 = [rowData.t1name, rowData.time1, rowData.day1];
      var tutor2 = [rowData.t2name, rowData.time2, rowData.day2];
      tutor1 = tutor1.toString();
      tutor2 = tutor2.toString();
      tutor1 = tutor1.replace(/,/g, "");
      tutor2 = tutor2.replace(/,/g, "");
     //puts both tutors ino an array
      var tutorArray = [tutor1, tutor2]; 
  }//closes for loop
  return tutorArray;
}


//spells out days of the week.      
function spellDay(day) {
  switch (day) {
    case "-":
      day = "-";
      break;
    case "M":
      day = "Monday";
      break;
    case "T":
      day = "Tuesday";
      break;
    case "W":
      day = "Wednesday";
      break;
    case "R":
      day = "Thursday";
      break;
    case "MW":
      day = "Monday and Wednesday";
      break;
    case "TR":
      day = "Tuesday and Thursday";
      break;

  }
  var on = " on ";
  day = on.concat(day);
  return day;
};


//function extracts time  
function extractTime(time) {

  if (time === "-") {
    time = "-";
  } else {
    var hour = time.getHours();
 //   hour = hour - 3;
    var minute = time.getMinutes();
    if (minute === 0) {
      minute = minute.toString();
      minute = minute.concat("0pm");
    } else {
      minute = minute.toString();
      minute = minute.concat("am");
    }
    time = hour.toString().concat(":").concat(minute);
  };
  
  var at = " at ";
  time = at.concat(time);
  return time;
};


function tutorDrop(tutorDrop){
  Logger.log("I got clicked");
  
  }




function numberLevel(level) {
  switch (level) {
    case "Pre-I A":
      level = "0";
      break;
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