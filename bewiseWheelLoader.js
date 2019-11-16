var stringHtmlWheel = '<button id="myBtn" class="btnOpenModal">PRØV LYKKEN</button><div id="myModal" class="popupContainer"><div class="popupContent"><span class="closePopup">&times;</span><div class="wheelContainer"><div class="textDiv"><div class="input-effect-div input-effect"><input id="email" class="effect-21" type="text" placeholder=""><label id="labelEmail" class="latoFont">E-Mail</label><span class="focus-border"><i></i></span></div></div><div class="buttonDiv"><button id="btnStopSpin" class="btnStop">DREJ LYKKEHJULET NU</button></div><div class="checkboxContainer"><div class="checkboxDiv"><input type="checkbox" id="chckbxTerms" value=""></div><div class="checkboxTextDiv"><p class="noMargin latoFont"><small> Jeg accepterer <label id="txtSmall">vilkår og betingelser</label><span class="popuptext latoFont" id="myPopup">Soveland må kontakte dig via e-mail med tilbud, nyheder og konkurrencer. Vi behandler dine data for at sende dig så relevant information som muligt via e-mails samt målrette indhold på vores hjemmeside og sociale medier. Du kan til enhver tid afmelde dig via links i vores e-mails.</span></small></p></div></div><div class="messageDiv latoFont hidden"><p id="wheelResult"></p></div><div id="wheel"><div class="arrow"></div><canvas id="canvas"></canvas><div class="wheelShadow"></div></div></div></div></div>';


if(wheelActive){
  $(stringHtmlWheel).appendTo("body");

  // $.getScript("/images/skins/Bewise/wheel/confetti.js", function(){});
  // $.getScript("/images/skins/Bewise/wheel/bewiseWheel.js", function(){});

  $.getScript("confetti.js", function(){});
  $.getScript("bewiseWheel.js", function(){});
}
