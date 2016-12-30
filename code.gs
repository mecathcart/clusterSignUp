<!DOCTYPE html>
<html>
<head>
  <base target="_top">
</head>
<body>
  Cluster Sign Up
  <br>
  <br>
  <form>
  
  <div id = "studentName">
    Please write your name as it appears on your yellow sheet. 
    <br>
    <br>
      Family Name, First Name: <input type="text" value=" " name ="studentName" list="studentName-datalist" id = "studentName"/>
      <datalist id="studentName-datalist"></datalist>

      <input type="submit" onClick="formSubmitName(event)" value = "Submit"/> <p> 
  </div>
    
  <div id="studentEmail">
  </div>

  <div id="radioEmail" hidden= "hidden">
      <input type="radio" name="email" id ="radioYes" value="yes"> yes<br>
      <input type="radio" name="email" id = "radioNo" value="no"> no<br>
      <input type="submit" onClick="formSubmitEmail(event)" value = "Submit"/> <p>
  </div>  
    
    
  <div id = "clusterSignUp" hidden= "hidden">
      <select id="selectCluster" name ="clusterName" >
        <option value="" disabled selected>Please select a cluster</option> 
      </select>
      <input type="submit" onClick="formSubmitCluster(event)" value = "Submit"/> <p>
  </div>
    
    
  <div id = "clusterVerification" hidden= "hidden">
  </div>
   
<div id="tutorDrop" hidden= "hidden">
  <br>
       <select id="selectTutor" name ="selectTutor" >
        <option value="" disabled selected>Please select a tutor</option> 
      </select>
      <input type="submit" onClick="formSubmitTutorDrop(event)" value = "Submit"/> <p>
  </div> 



  



  </form>

  <img src="http://app.lingsync.org/images/loading-spinner.gif" width="20" hidden=hidden id ="spinner" />




  <script  type="text/javascript">
    
    
  //displays dropdown menu of clusters
   function onSuccessCluster(clusterList) { 
     var dropdown = document.getElementById("selectCluster");
    // Loop through the array
    for (var i = 0; i < clusterList.length; ++i) {
     //Append the element to the end of Array list
     dropdown[dropdown.length] = new Option(clusterList[i], clusterList[i]);
     }     
   }   
 
 //displays student autocomplete
 function onSuccessStudents(studentList){ 
  var dataList = document.getElementById('studentName-datalist');
  var input = document.getElementById('studentName');    
    // Loop through the array
    for (var i = 0; i < studentList.length; ++i) {
     // Append the element to the end of Array list
     var option = document.createElement('option');
      // Set the value using the item in the JSON array.
      option.value = studentList[i];
      // Add the <option> element to the <datalist>.
      dataList.appendChild(option);
    }  
  }
  
  //Asks the user if their email is correct
  function onSuccessEmail(studentEmail){

   var div = document.getElementById("studentEmail");
   div.innerHTML =  "Is this your email? " +studentEmail;
   
   var spinner = document.getElementById("spinner");
   spinner.setAttribute("hidden", "hidden");
   
   var radio = document.getElementById("radioEmail");
   radio.removeAttribute("hidden");
 }
 
 //determines whether cluster is availible and calls tutor drop function
 function onSuccessSize(clusterAvailible){
    var clusterVer = document.getElementById("clusterVerification");
    clusterVer.removeAttribute("hidden");
     if(clusterAvailible === true){
    
        clusterVer.innerHTML =  "Great! Which tutor would you like to drop?";
        google.script.run.withSuccessHandler(onSuccessGetTutor).getTutors(document.forms[0]);
    
    }else{
      var clusterVer = document.getElementById("clusterVerification");
      clusterVer.removeAttribute("hidden");
      clusterVer.innerHTML =  "I'm sorry but the cluster you've selected is full. Please select another cluster.";
   }
 }
 
//asks students which tutor they want to drop 
 function onSuccessGetTutor(tutorArray){
  // var studentName = document.getElementById("studentName");
  // studentName.setAttribute("hidden", "hidden");
   
  // var clusterSignUp = document.getElementById("clusterSignUp");
  // clusterSignUp.setAttribute("hidden", "hidden");
 
  // if(tutorArray[0].indexOf("-") === 0){
    //    console.log(tutorArray[1].indexOf("-")); 
  // }
  
   var tutorDrop = document.getElementById("tutorDrop");
      tutorDrop.removeAttribute("hidden");
  
     var tutorDropdown = document.getElementById("selectTutor");
    // Loop through the array
    for (var i = 0; i < tutorArray.length; ++i) {
     //Append the element to the end of Array list
     tutorDropdown[tutorDropdown.length] = new Option(tutorArray[i], tutorArray[i]);
     }
 
 }
 
 function onSuccessTutorDrop(){
 console.log("I got clicked");
 }
 
 //displays results of level check and calls cluster availibility function
 function onSuccessLevel(levelVer){
 
   var spinner = document.getElementById("spinner");
   spinner.setAttribute("hidden", "hidden");
   
   var radio = document.getElementById("radioEmail");
   radio.setAttribute("hidden", "hidden");
   
   if(levelVer === true){
   google.script.run.withSuccessHandler(onSuccessSize).checkAvailibility(document.forms[0]);
   }else{
   console.log("Bummer!");
    var clusterVer = document.getElementById("clusterVerification");
    clusterVer.removeAttribute("hidden");
    clusterVer.innerHTML =  "I'm sorry but you are not the right level for this cluster. Please select another cluster.";
   } 
 }
 
 //retrieves student and cluster lists
 google.script.run.withSuccessHandler(onSuccessCluster).getClusterList();
 google.script.run.withSuccessHandler(onSuccessStudents).autoComplete();

//runs when student submits their name and calls the get Email function
 function formSubmitName(event) {
  if (event) {
    event.preventDefault();
  }
  
  var spinner = document.getElementById("spinner");
  spinner.removeAttribute("hidden");
  google.script.run.withSuccessHandler(onSuccessEmail).getStudentEmail(document.forms[0]);
}

//runs when students submit their email and pulls up cluster list
function formSubmitEmail(event) {
  if (event) {
    event.preventDefault();
  }
  
    var studentEmail = document.getElementById("studentEmail");
     studentEmail.setAttribute("hidden", "hidden");
     
     var radio = document.getElementById("radioEmail");
     radio.setAttribute("hidden", "hidden");
    var radioValue = document.querySelector('input[name = "email"]:checked').value;
     
     if(radioValue === "yes"){
        var clusterSignUp = document.getElementById("clusterSignUp");
        clusterSignUp.removeAttribute("hidden");
    }
    if(radioValue === "no"){
       var div = document.createElement('div');
       document.body.appendChild(div);  
       div.innerHTML =  "Sorry that wasn't you! Please write your name in again!";
   }
 }

//runs when cluster is submitted and calls the check level function
 function formSubmitCluster(event) {
  if (event) {
    event.preventDefault();
   }
  
  var spinner = document.getElementById("spinner");
  spinner.removeAttribute("hidden");
  
  var radio = document.getElementById("radioEmail");
  radio.setAttribute("hidden", "hidden");
   
  var studentEmail = document.getElementById("studentEmail");
  studentEmail.setAttribute("hidden", "hidden");
  
  google.script.run.withSuccessHandler(onSuccessLevel).checkLevel(document.forms[0]);
 }


function formSubmitTutorDrop(event){
  if (event) {
    event.preventDefault();
  }
    google.script.run.withSuccessHandler(onSuccessTutorDrop).tutorDrop(document.forms[0]);


}





  </script>

</body>
</html>



