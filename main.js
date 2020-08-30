/*
* main process of 0063
* by maoSoft()
* Rel 001--20191013
* This module: launch user interface
*/


//-----launching ui with one  html page!!
function doGet(e) {
  //inizializzazione pagine gestite
  var page = e.parameter['page']; 
  Logger.log(page);
  
  //verifica se per l'oggetto 'e' sono state definite pagine aggiuntive 
  if (!page) {
    Logger.log('launching index page');
    return HtmlService.createTemplateFromFile('index').evaluate(); //default  page 
  }
  //page è stato inizializzato e lancio la pagina corrispondente
  Logger.log (page);
  Logger.log (e.parameter);
  Logger.log(page);
  return HtmlService.createTemplateFromFile(page).evaluate();
}

//collection of helper functions
function include(filename){
  //including html file in html script
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getScriptUrl() {
  //funzione server side che viene chiamata da UI tramite scriptlet.... (as in php)
  var url = ScriptApp.getService().getUrl();
  return url;
}
