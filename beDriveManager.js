/* drive manager v. 001 del 20200710
@@@@@@@@@ da rivedere tutto @@@@@@@@@
lista funzioni
(da trasformare in classi)
#createAppFolder()
#copyTemplateFileToFolder


*/

/* parametri per la App*/
//var idAppFolder='1YEXZ0gnniChHPtwvaJ4d1zsfjQTxzLiu';

function gsGetFoldersList(){
  console.log('in gsGetFolders');
  
  let idAppFolder='1YEXZ0gnniChHPtwvaJ4d1zsfjQTxzLiu';
  let parFolder=DriveApp.getFolderById(idAppFolder);
  let folders =parFolder.getFolders();
  foldersList=[];
  
  while (folders.hasNext()) {
    folder=folders.next();
    let folderName=folder.getName();
    foldersList.push(folderName);   
  }
  console.log(foldersList);
  return foldersList
}


function gsCreateAppFolder(idAppFolder, folderName, templates) {
    /** 
   * lanciata dalla funzione be  gsObjCreate (coniugata con objCreate libreria feLibrary);
   * #crea un nuovo folder con nome folderName nella cartella parent (idAppFolder),
   * #carica nel folder creato i files copiandoli dai templates (array di id in templates)
   * #inizializza i file gSheet (data corrente e prima riga di log (ove presente))
   * 
   * @param {string} idAppFolder id del Folder padre
   * @param {string } folderName nome da attribuire al folder
   * @param {array} templates str id dei files da caricare nel folder alla sua creazione
   * @returns {array}
   */
  
    //init & test
  console.log('in gsCreateAppFolder');
  console.log(templates[0]);
  console.log(templates[1]);

    //retrieve parent folder url from function  Arguments
  let parentFolder = DriveApp.getFolderById(idAppFolder);

    //Assuming the folder doesn't exist (it's always so)
  let newFolder = parentFolder.createFolder(folderName);//folder obj
  let idTargetFolder= newFolder.getId();//not used by now

  


    //building return values (new folder url and list of template files url created)
  let result=[newFolder.getId()];
  console.log ('out of gsCreateAppFolder');//test
  return result;

  /*make it a better function*/ 
    //verify if folder exists.
    //error management
}

