/**
 * Libreria di funzioni Back End specifiche   per 0072_ACQ01_PA_BEMAC
 *                  --------by maoSoft()---------
 *
 *  ---------------------------------------------------------------- -------------------
 *   R01.001| 20200823| emissione per 0072_ACQ01_PA_BEMAC 
 *   R01.002| 20200830| emissione per 0070_COMM_BEMAC 
 *  ------------------------------------------------------------------------------------ 
 *                function list (last in first out)
 * 
 *#gsPaCreate(appValues,idappFolder,templates) 
 *-lancia createRecord() che crea il record del processo nel database 
 *-lancia gsCreateAppFolder() che crea il folder del processo (con i files template) su gDrive
 * +copia da template i documenti standard di processo e li registra sul folder di processo
 * +modifica i documenti standard con i dati del processo
 *-crea le sottocartelle standard del processo
 *-crea la bozza della mail da inviare per notificare la attivazione del processo
 *#getNewFolderCode(idParentFolder) // trick che si basa su due funzioni be di libreria
 *-per ottenere il nuovo codice del processo da utilizzare e inserire nella creazione del nuovo folder PA
 *
*/




/**
 * 
 * 
 * 
 * 
 * _getSheetUrl //trick per ottenere la url del file indicato dal chiamante
 * _getFolderUrl //trick per ottenere la url del folder  da aprire nel browser (relativo al game selezionato)
 * _gsArrayReadTable(qry)//lancia la query specificata nel database maoAmm
 * _gsUpdateRecord(db, table, values)//aggiornamento di tabella
 * _gsGameCreate (gameValues,idAppFolder, templates)//creazione di Game su gDrive e su database
 */
function gsPaCreate(appValues, idAppFolder, templates){
  /**
   * create a new game record on table 'ACQ_PA' and, after,
   * create a new folder with copy templates files inside
   * edit new generated files (current date, first row etc..)
   * create standard subFolders
   * create draft mail for oACQ (portal ACQ_IMP update)
   * 
   * @param appValues (arr) array con i dati del nuovo game (app)
   * @param idAppFolder (str) id del folder che contiene i games
   * @param templates (arr) array con gli id dei template da utilizzare
   * i dati per la creazione del folder e la copia dei files template sono 
   * hard coded nella funzione coniugata lato fe (feAppLogic).
   * i dati per l'accesso al database e alla tabella di lavoro sono hc nella funzione
  */
  //init&test
  console.log('in gsPaCreate func');//test
  console.log('dati trasmessi 1'+appValues+' 2'+idAppFolder+ ' 3'+templates);
  
  //fase 1: crea nuovo record su tabella db specificata
  //inizializza connessione al database istanziando la Classe Crud
  let arrDbaseAccess=[0,'51.254.206.188','root','Bemac999','SB_MMazza'];//param,ip,user.pwd.dbase.....
  let dbObj=new Crud(arrDbaseAccess);//using db maosoft classes!
  
  //utilizza il metodo della classe Crud per nuovo record  con valori appValues sulla tabella specificata
  let flagCreateOpStatus=dbObj.createRecord('ACQ_PA', appValues); //status operazione di creazione record
  console.log (flagCreateOpStatus);
  //gestione errori creazione record
  //--- da fare
  
  
  //fase 2: crea folder e carica template
  //building folder name
  let nomeCompletoFolder='PA00'+appValues[0]+'_'+appValues[1];// to improve for automatic PA00xx to PA01xx an so on
  
  //create folder & load templates
  let results=gsCreateAppFolder(idAppFolder, nomeCompletoFolder, templates);
  console.log (results);
  //gestione errori creazione folder
  
  //modifica il nome del PA creato sul folder(da rivedere completamente)
  let nomeFilePa='PA00'+appValues[0];
  let filePa=DriveApp.getFileById(results[2]);//horrible, but works just fine
  filePa.setName(nomeFilePa);

  //Crea le sottocartelle standard  sul folder
  let paFolder=DriveApp.getFolderById(results[0]);
  paFolder.createFolder('01_PA_PropostaApprovvigionamento');
  paFolder.createFolder('02_RO_RichiestaOfferta');
  paFolder.createFolder('03_OF_Offerta');
  paFolder.createFolder('04_OR_ORdine');
  paFolder.createFolder('05_CO_ConfermaOrdine');
  paFolder.createFolder('06_DDT');

  //Prepara la bozza di eMail da inviare ad oACQ mediante template html
  let recipient='mara.m@bemac.it';
  let subject='nuovo Pa:  '+ nomeCompletoFolder;

  //uso il template mail
  let eMailMsg=HtmlService.createHtmlOutputFromFile('vMailApriPaPortal').getContent();
  
  //valori attuali per il template mail
  let codGame=appValues[10];
  let numeroPa=nomeCompletoFolder;
  let codNote=appValues[2];
  let responsabile='Maurizio Mazzanti';
  let categoria='Richiesta di offerta';
  
  //modifico il template mail con i valori attuali
  eMailMsg=eMailMsg.replace('#CODGAME', codGame);
  eMailMsg=eMailMsg.replace('#NUMEROPA', numeroPa);
  eMailMsg=eMailMsg.replace('#CODNOTE', codNote);
  eMailMsg=eMailMsg.replace('#RESPONSABILE', responsabile);
  eMailMsg=eMailMsg.replace('#CATEGORIA', categoria);
  
  //creo la bozza della mail
  GmailApp.createDraft(recipient, subject,'',{
    htmlBody: eMailMsg
  });

  //end function
  let resultValues =[results,flagCreateOpStatus];
  console.log('out gsPaCreate function');
  console.log(resultValues);
  return resultValues
}




function gsGetNewFolderCode(idParentFolder){
  /*  --- Utility function --- 
  get all subfolders (PAXXXXX of the parent Folder
  put their properties in an array */
  
  //init &log
  console.log('in getNewFolderCode');
  let parFoldersData=getFoldersDataList(idParentFolder);//gDrive Library

  //select last folder Name of the folders array
  let lastFolderName=getLastFolderName(parFoldersData);//gDrive Library
  
  //building new Folder Code based on last folder name
  let strLastNumber = lastFolderName.substr(2, 5);//5=number of char in substr
  let intLastNumber= parseInt(strLastNumber);
  
  console.log('out of gsGetNewFolderCode');
  return intLastNumber+1;
}

function getSheetUrl(codicePa, folderId, fileNameValue, sheetName){

  //get with a trick the specified file url
  
  //vedi la funzione getFolderUrl 
  //fileName=nome del file da aprire
  //------- vedi test4 
  // recupera id del folder relativo al game con codice == codiceGame  
    //init
  console.log('in getSheetUrl');
  console.log('codice Pa = '+codicePa);
  let folderPa=DriveApp.getFolderById(folderId);
  let folders=folderPa.getFolders();
  
  //loop 1 ricerca folder
  while (folders.hasNext()) {
    var folder = folders.next();
    let folderName=folder.getName();
    let folderId=folder.getId();
    let folderUrl=folder.getUrl();
    //console.log(folderId+' la url relativa e '+folderUrl);//test
    //test on codiceGame  and action
    let inizioNomePa = folderName.substring(2, 7);//5 caratteri 00xxx del nome del folder desiderato
    
    if(inizioNomePa==codicePa){
      let folderPaId=folderId;
      console.log (folderUrl);
      console.log('trovato folder '+folderName+'url= '+folderUrl);
      // break; perchè perde il valore di folderUrl se esco dal ciclo???      
      //codice aggiuntivo per ricerca url del file da usare
      let files=folder.getFiles();
      
      //loop 2 ricerca files
      while (files.hasNext()) {
        var file = files.next();
        let fileName=file.getName();
        console.log('nome del file in esame '+fileName);
        //seleziono il file 'controlloProcesso'
        if (fileName==fileNameValue){
          let fileUrl=file.getUrl();
          let ss=SpreadsheetApp.openByUrl(fileUrl);
          let ssUrl=ss.getUrl();
          console.log('ssurl =  '+ssUrl); 

        //choosing  sheet doesn't work up to now
          if (sheetName=='log&todo'){   
            ss.setActiveSheet(ss.getSheets()[0]);  
            return ssUrl;
          }else if (sheetName=='gestioneDoc'){
            ss.setActiveSheet(ss.getSheets()[1]); 
            return ssUrl; 
          }   //end 2nd if condition       
        return ssUrl;
        } //end 1st if condition    
    
   
      }//end while loop 2 (internal)
    }
  //vorrei tornare la funzione da qui, ma da errore!! 
  }//end while loop 1 

//semplifica con getFolderUrl!! e attiva la apertura dello ss sullo ssheet indicato

}

 /********************/
function getFolderUrl(codicePa, folderId, subFolderType){
  //get with a trick the specified game folder url
  
  //ottieni  id  del folder relativo al codiceGame passato 
  //folderId=id del folder Games hc passato dal chiamante
  //------- vedi test4 
  //init&test
  console.log('in getFolderUrl (beAppLogic), valori ricevuti   '+codicePa+' '+folderId+' '+subFolderType);
  
  // recupera id del folder relativo al game con codice == codiceGame    
  let folderPa=DriveApp.getFolderById(folderId);//parent folder
  let folders=folderPa.getFolders();
  
  while (folders.hasNext()) {
    //fetching folders values
    let folder = folders.next();
    let folderName=folder.getName();
    let folderId=folder.getId();
    let folderUrl=folder.getUrl();
    //console.log('folder Id'+folderId+' url folder   '+folderUrl);//test
    
    //test on codiceGame  and action
    let inizioNomePa = folderName.substring(2, 7);//primi  caratteri numerici del nome del folder desiderato
    //i folder iniziano con 'PA'....
    
    //console.log('inizio nome Pa '+inizioNomePa); //test
    //@@@@@@ ATTENZIONE VALE FINO A PA 00999@@@@@@@@@@@
    if(inizioNomePa==codicePa){ 
      let folderPaId=folderId;
      console.log('trovato folder '+folderName+'url= '+ folderUrl);//test
      // break; perchè perde il valore di folderUrl se esco dal ciclo???
      if (subFolderType=='0'){//non ho indicato il subFolder
        return folderUrl;
      }else{
        //seleziono il subFolder 
        if(subFolderType=='RO'){
          var subFolders=folder.getFoldersByName('02_RO_RichiestaOfferta'); 
        }else if (subFolderType=='OR'){
          var subFolders=folder.getFoldersByName('04_OR_ORdine');  
        }else if((subFolderType=='Ddt')){ 
          var subFolders=folder.getFoldersByName('06_DDT'); 
        }
        
        let subFolder = subFolders.next();//scelgo il primo subFolder con il nome selezionato.
        let subFolderUrl=subFolder.getUrl();
        return subFolderUrl;
      }
      
    }
  }
  //vorrei tornare la funzione da qui, ma da errore!!

/* developer notes*/
/*  parti di codice di questa funzione sono riusati in getSheetUrl.
-------semplificare!


*/ 

}

/* ************************* *//* ************************* */





function gsArrayReadTable(db,qry){
  /*connector to CRUD Class*/
  //init&testing
  console.log('in gsarrayReadTable func');//test
  
  let arrDbaseAccess=[0,'51.254.206.188','root','Bemac999',db];//param,ip,user.pwd.dbase.....
  let dbObj=new Crud(arrDbaseAccess);//using db maosoft classes!

  let data=dbObj.getArrayDataFromQuery(qry);
  console.log(data);
  console.log('out from gsarrayReadTable func');
  return data;
}

/* ************************* */


function gsUpdateRecord(db, table, values){
  //values[0]=id record da aggiornare

  console.log('in gsUpdateRecord func');
  console.log('dati trasmessi'+values);
  console.log('db= '+db);
  console.log('table= '+table);

  let arrDbaseAccess=[0,'51.254.206.188','root','Bemac999',db];//param,ip,user.pwd.dbase.....
  let dbObj=new Crud(arrDbaseAccess);//using db maosoft classes!
  //qry built inside method of the class

  let data=dbObj.updateDataFromValues(table, values);
  //console.log(data);
  console.log('out gsUpdateRecord func');
  return data;
}



