//----------------------------------//
//----------------------------------//
//----- start of beSpinning.js -----//
//----------------------------------//
//----------------------------------//

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

var screenSmall = false;
var screenWidth = $(window).width();

var slices = arrayObjWheel.length;
var sliceDeg = 360/slices;
var deg = rand(0, 360);
var speed = 0;
var slowDownRand = 0;
var ctx = canvas.getContext('2d');
ctx.canvas.width = 300;
ctx.canvas.height = 300;
var isStarted = false; //boolean - if the wheel should start turning
var isStopped = false; //boolean - if the wheel should stop
var lock = false;
var cookieVisits; //int - how many times the user has visited the site
var cookieWheelTurned; //boolean - has the user turned the wheel before?
var cookieWheelClosedByUser; //boolean - has the wheel been closed by the user?
var aiTemp = 0; //is used for arrow tick
var logoScale = 90;

var logo = new Image();

logo.src = 'img/logo.svg';

//-----------------------------
//----- resize for mobile -----
//-----------------------------

// max width of text in wheel (110 is standard for width/height 300)
var maxTextWitdth = 105;
// text position in wheel (140 is standard for width/height 300)
var textPosition = 140;
// text size in wheel (30 is standard for width/height 300)
var wheelFontSize = wheelFontSizeDesktop;

// function for setting size of wheel and modal if the screen size is under 550 px
if(screenWidth < 550){
  //set wheel size to mobile
  ctx.canvas.width = 230;
  ctx.canvas.height = 230;
  //set wheel shadow size to mobile
  $(".wheelShadow").css({'width':'230px', 'height':'230px'});
  // set max text width in wheel to mobile
  var maxTextWitdth = 72;
  // set text position in wheel to mobile
  textPosition = 105;
  //set text size in wheel to mobile
  wheelFontSize = wheelFontSizeMobile;
  //set width of modal to resizable to fit mobile. The modal is now left+right=15px and bottom=0
  $(".popupContent").css({'width':'auto', 'right':'15px'});
  //set text size in start/stop button mobile
  $(".btnStop").css('font-size', '14px');
}

//------------------------------------
//----- end of resize for mobile -----
//------------------------------------

var width = canvas.width;  // size of wheel
var center = width/2;      // center of wheel

function deg2rad(deg) {
  return deg * Math.PI/180;
}

function drawSlice(deg, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(center, center);
  ctx.arc(center, center, (width/2) - 8, deg2rad(deg), deg2rad(deg+sliceDeg));
  ctx.lineTo(center, center);
  ctx.fill();
}

function drawBlackBg() {
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.moveTo(center, center);
  ctx.arc(center, center, width/2, 0, 360);
  ctx.fill();
}

function drawDot(deg) {
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.arc(center + (Math.cos(deg2rad(deg)) * ((width/2) - 4)), center + (Math.sin(deg2rad(deg)) * ((width/2) - 4)), 3, 0, 360);
  ctx.fill();
}

function drawText(deg, text, color) {
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(deg2rad(deg));
  ctx.textAlign = "right";
  ctx.fillStyle = color;
  ctx.font = 'bold ' + wheelFontSize + 'px sans-serif';
  ctx.fillText(text, textPosition, 10, maxTextWitdth);
  ctx.restore();
}

function drawLogo() {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.moveTo(center, center);
  ctx.arc(center, center, 30, 0, 360);
  ctx.fill();
  ctx.drawImage(logo, center - ((logoScale * 0.55) / 2), center - ((logoScale * 0.37) / 2), logoScale * 0.5, logoScale * 0.37);
}

function drawImg() {
  ctx.clearRect(0, 0, width, width);
  drawBlackBg();
  for(var i=0; i<slices; i++){
    drawSlice(deg, arrayObjWheel[i].sliceColor);
    drawDot(deg);
    drawText(deg+sliceDeg/2, arrayObjWheel[i].sliceText, arrayObjWheel[i].sliceTextColor);
    deg += sliceDeg;
  }
  drawLogo();
}

//-----------------------
//----- start wheel -----
//-----------------------

(function anim() {
  deg += speed;
  deg %= 360;

  // Increment speed - starts wheel
  if(isStarted && !isStopped && speed<3){
    speed = speed+1 * 0.1;
  }
  // Decrement Speed
  if(isStopped){
    if(!lock){
      lock = true;
      //sets for how long the wheel is slowing down. The lower the number the faster it stops
      slowDownRand = rand(0.99, 0.991);
    }
    speed = speed>0.2 ? speed*=slowDownRand : 0;
  }
  // Stopped!
  if(lock && !speed){
    var ai = Math.floor(((360 - deg - 90) % 360) / sliceDeg); // deg 2 Array Index
    ai = (slices+ai)%slices; // Fix negative index
    // change text to the price
    $("#wheelResult").html(arrayObjWheel[ai].winningText);
    //remove email textfield and button
    $(".buttonDiv").remove();
    $(".textDiv").remove();
    // show result above wheel
    $(".messageDiv").removeClass("hidden");
    // execute url to add discount
    $.get( stringWebshopRabatUrl + arrayObjWheel[ai].rabatkode, function( data ) {});
    //if startConfetti=true for the slice the wheel stops at, then start confetti
    if(arrayObjWheel[ai].startConfetti == true){
      confetti.start();
    }
    return
  }
  var ai = Math.floor(((360 - deg - 90) % 360) / sliceDeg); // deg 2 Array Index
  ai = (slices+ai)%slices; // Fix negative index

  // if aiTemp != ai then the arrow has entered a new slice. When this happens animate the arrow
  if(aiTemp != ai){
    $({deg: -15}).animate({deg: 45}, {
      duration: 250,
      step: function(now){
        $(".arrow").css({
          transform: "rotate(" + now + "deg)"
        });
      }
    });
  }
  aiTemp = ai;

  drawImg();
  //stop the function if wheel has been turned
  if(cookieWheelTurned){
    return;
  }
  window.requestAnimationFrame( anim );
}());

//------------------------------
//----- end of start wheel -----
//------------------------------


// wheel starts turning
function startWheel(){
  //change color of result text to green
  $result.css("color", "#65c8c7");
  //start wheel
  isStarted = true;
  //hide terms and conditions
  $(".checkboxContainer").hide();
  //change color of button and make it not-allowed
  $(".btnStop").css({
    'background-color': 'grey',
    'cursor': 'not-allowed'
  });
}

//function gets called and wheel begins to slow down until it stops
function stopWheel(){
  isStopped = true;
  // sets wheelTurned to true, so the user can't turn the wheel with other emails
  $.cookie('wheelTurned', 'true');
}

//-------------------------------
//----- start of validation -----
//-------------------------------

var $result = $("#wheelResult");

//validate email address with regex
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//if email is valid and the email is not already used,  turn the wheel
function validate() {

  var email = $("#email").val();
  var regExResponse = validateEmail(email);
  var mailchimpResponse = wheelSignup(email);
  $result.text("");

  //if the email is valid start wheel and stop wheel after value stored in secondsWheelTurns
  if (regExResponse && mailchimpResponse) {
    startWheel();
    setTimeout(function(){
      stopWheel();
    }, secondsWheelTurns);
  }
  else if (regExResponse && !mailchimpResponse) {
  } else {
    if(email != ""){
      $result.text(email + " er ikke en valid E-mail");
    }else {
      $result.text("Indtast en valid E-mail");
    }
    $result.css("color", "red");
    $(".messageDiv").removeClass("hidden");
  }
}

function wheelSignup(email) {
  var boolResponse = false;

	$.ajax({
		url: '/images/skins/Bewise/wheel/mailchimp_lykkehjul.asp',
    async: false,
		type: "GET",
		data: {'email' : email, 'list' : newsletterConfig.list, 'lname' : '', 'fname' : ''},
		complete: function(response) {
			$.cookie('newsletterDone', 1, { expires : 14 });
			// console.log(response);

      // the response contains two object printed after each other. Place them in an array and separate them with a comma
      var arrResponse = '[' + response.responseText + ']';
      var arrResponse = arrResponse.replace("}{", "},{");
      // parse string to object
      var arrResponseParsed = JSON.parse(arrResponse);

      // if the email is already in the mailchimp DB show an error message
      if(arrResponseParsed[1].title == "Member Exists"){
        $result.text(email + " er allerede tilmeldt nyhedsbrevet");
        console.log("Email already exists in db");
        $result.css("color", "red");
        $(".messageDiv").removeClass("hidden");
      }
      // if the email is not in the mailchimp DB, set boolResponse to true
      else if(arrResponseParsed[1].unique_email_id != ''){
        boolResponse = true;
      }
      // set generic error msg
      else{
        $result.text("Noget gik galt med at validere din E-mail");
        console.log("Something went wrong");
        $result.css("color", "red");
        $(".messageDiv").removeClass("hidden");
      }
		}
	});
  return boolResponse;
}

//show error message if the cookie shows the user has turned the wheel
function hasWheelBeenTurned() {
  if(cookieWheelTurned){
    $result.text("Desværre. Du har allerede drejet hjulet én gang.");
    $result.css("color", "red");
    $(".messageDiv").removeClass("hidden");
  }else {
    acceptTermsAndConditions();
  }
}

//check if the checkbox is checked (hehe)
function acceptTermsAndConditions(){
  if($('#chckbxTerms').is(":checked")){
    validate();
  }else {
    $result.text("Accepter venligst vores vilkår og betingelser");
    $result.css("color", "red");
    $(".messageDiv").removeClass("hidden");
  }
}



//start validation process on button click
// $("#btnStopSpin").on("click", hasWheelBeenTurned);
// $("#btnStopSpin").on("click", temp());
//
// function temp() {
//   isStarted = true;
//   setTimeout(function(){
//     isStopped = true;
//   }, secondsWheelTurns);
// }



//-----------------------------
//----- End of validation -----
//-----------------------------


//do not place "email" label back in textfield if it contains something
$("#email").blur(function(){
  if($("#email").val() != ""){
    $("#labelEmail").css({
      'top': '-18px',
      'left': '0',
      'font-size': '12px',
      'color': '#65c8c7'
    });
  }
});

//--------------------------------//
//--------------------------------//
//----- end of beSpinning.js -----//
//--------------------------------//
//--------------------------------//


//-------------------------------//
//-------------------------------//
//----- start of bePopup.js -----//
//-------------------------------//
//-------------------------------//

// -----------------
// ----- modal -----
// -----------------
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closePopup")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  //if the user closes the modal, don't make it appear automatically again
  $.cookie('wheelClosedByUser', 'true');
  confetti.stop();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    confetti.stop();
  }
}

// -----------------------------------------
// ----- start of terms and conditions -----
// -----------------------------------------

function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

$(".checkboxTextDiv").click(function() {
  myFunction();
});

// ---------------------------------------
// ----- end of terms and conditions -----
// ---------------------------------------


$(document).ready(function() {

  //---------------------------
  //----- Start of cookie -----
  //---------------------------

  cookieVisits = $.cookie("visits");
  cookieWheelTurned = $.cookie("wheelTurned");
  cookieWheelClosedByUser = $.cookie("wheelClosedByUser");

  if(cookieVisits == null){
    $.cookie('visits', '1');
    cookieVisits = 1;
  }else {
    cookieVisits++;
    $.cookie('visits', cookieVisits);
  }

  //show modal button after 2 visits
  if(cookieVisits > 2){
    $(btn).css('visibility', 'visible');
    //open the modal if the user has not closed it before and if the wheel has been turned
    if(!cookieWheelClosedByUser && !cookieWheelTurned){
      $(btn).click();
    }
  }

  if(cookieWheelTurned){
    btn.remove();
    modal.remove();
  }

  //-------------------------
  //----- End of cookie -----
  //-------------------------

});

//-----------------------------//
//-----------------------------//
//----- end of bePopup.js -----//
//-----------------------------//
//-----------------------------//
