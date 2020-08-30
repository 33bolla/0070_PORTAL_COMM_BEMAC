/**
 * dBase CRUD basic functions library
 * 
 * rel 1.0 20200805
 * 
 * dataFromQuery(qry)
 * arrayFromRecordSet(rSet)
 *  htmlOutputBuilder(rSet)//not used
 * createNewRecord(values)
 * ----CLASS
 * CRUD basic crud Op
 * 
 * #all functions move to classes
 * 
*/

class Crud {
    //testing dBase Manager+Crud op with OOP
     
      //istanzio la classe Crud inviando un vettore con:
      /* 
         id tipo operazione (da usare in futuro)
         indirizzo del server: var address = '51.254.206.188'; //maosoft= 
         il nome dello user : var user = 'root';//maosoft=maosoft
         la password dello user: var userPwd = 'Bemac999';=
         il nome del database: var db = 'SB_MMazza';=Z_Pwd
          
      
      in sintesi:
      //var arrCrud=["idCrudOp",  "indirizzo", "userName","userPwd" 
      "dBaseName" ]; 
       */
      
      constructor(arrayCrud) {
        this.crudOperationeType =arrayCrud[0];
        this.crudServerAddress =arrayCrud[1];
        this.crudUserName=arrayCrud[2];
        this.crudUserPassword=arrayCrud[3];
        this.crudDatabaseName=arrayCrud[4];  
        console.log(this.crudServerAddress);
      }
    
      //methods
      getDatabaseName() {
        console.log(this.crudDatabaseName);
        return "Database  name:  " + this.crudDatabaseName; // mandatory
      }  
      
      setCrudConnection(){
        //setting connection
        console.log('in setCrudConnection');//test
        this.dbUrl = 'jdbc:mysql://' + this.crudServerAddress + '/' + this.crudDatabaseName;
        this.conn = Jdbc.getConnection(this.dbUrl, this.crudUserName, this.crudUserPassword);
        this.stmt = this.conn.createStatement(); //oggetto base per settings e interazione con elementi del database 
        
        // Read up to 2000 rows of data from the table and log them.      
        this.stmt.setMaxRows(2000); //it can dinamically changed and or done inside the qry  
        return this.stmt
      }
      setCrudPreparedConnection(){
        console.log('in setCrudPreparedConnection');//test
        this.dbUrl = 'jdbc:mysql://' + this.crudServerAddress + '/' + this.crudDatabaseName;
        this.conn = Jdbc.getConnection(this.dbUrl, this.crudUserName, this.crudUserPassword);
        //this.stmt = this.conn.prepareStatement(); //oggetto base per qry dinamiche
        return this.conn
      }



      createRecord(table, appValues){
        /**
         * create a new record with passed values on specified table
         * 
         * @param table (str) tabella sulla quale creare il nuovo record
         * @param appValues (arr) array con i dati del nuovo record 
         * 
         * i dati per l'accesso al database e alla tabella di lavoro sono hc nella funzione
         * ***ATTENZIONE non usare la keywor limit (o altre keyword sql come nome dei campi; jdbc segnala errori in maniera non chiara)
        */
        
        console.log('in createRecord'); //test
        console.log ('valori trasmessi '+appValues);//test

        //connessione al database 
        this.dbUrl = 'jdbc:mysql://' + this.crudServerAddress + '/' + this.crudDatabaseName;
        this.conn = Jdbc.getConnection(this.dbUrl, this.crudUserName, this.crudUserPassword);
        console.log('connessione stabilita');//test
        
        //acquisizione tabella db e valori del nuovo record
        this.table=table;
        this.values=appValues;
      
        //switch case to select insert qry related to current db table 
 
        switch (this.table) {
          case 'ACQ_PA':
            
            //questa query va parametrizzata o modificata per ogni singola tabella o Join
            this.qry = "INSERT INTO "+this.table+"(cod, descrizione, note_interne, note_fornitore, "
            +"fkOperatore, fkRichiedente, start, limite, end, terminata, fkGame, "
            +"fkOfferta, fkLavorazione, fkStatoPa, path) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            console.log(this.qry);
            break;
          
          case 'ACQ_PR':
            // qry building 
            break;
          
          default:
            console.log("No value found");
        }       
        
        // //questa query va parametrizzata o modificata volta per volta....
        // this.qry = "INSERT INTO "+this.table+"( IdGame, nomeBreve, "
        // +"fkOperatore, fkRichiedente, start, limit, end, terminata, fkGame, "
        // +"fkOfferta,fkLavorazione, fkStatoPa, path) values (?, ?, ?, ?, ?, ?)";
        // console.log(this.qry);
        //this.conn.prepareStatement(this.qry);  // da capire se 
        //this.stmt=this.conn.prepareStatement(this.qry)    
        this.stmt = this.conn.prepareStatement(this.qry);


        this.stmt.setString(1, this.values[0]);
        this.stmt.setString(2, this.values[1]);
        this.stmt.setString(3, this.values[2]);
        this.stmt.setString(4, this.values[3]);
        this.stmt.setString(5, this.values[4]);
        this.stmt.setString(6, this.values[5]);
        this.stmt.setString(7, this.values[6]);
        this.stmt.setString(8, this.values[7]);
        this.stmt.setString(9, this.values[8]);
        this.stmt.setString(10, this.values[9]);
        this.stmt.setString(11, this.values[10]);
        this.stmt.setString(12, this.values[11]);
        this.stmt.setString(13, this.values[12]);
        this.stmt.setString(14, this.values[13]);
        this.stmt.setString(15, this.values[14]);

        this.results = this.stmt.execute();//set create op flag
        console.log(this.results);
        console.log('out from  createRecord method');
        return this.results
        
        /*developer notes*/
        /** execute method can be used with any type of SQL statements and it returns a boolean.
         * A true indicates that the execute method returned a result set object which can be 
         * retrieved using getResultSet method. false indicates that the query returned an 
         * int value or void.
        */
        //x adesso ritorna false. Non so come ottenere il nr di record inseriti!!
      }
      
      updateDataFromValues(table, values){
        //it works both games and offerte tables.
        //set qry and jdbc statement based on passed table
        //maybe it can be improved!!!
        
        console.log('in updateDataFromQuery');
        console.log ('valori trasmessi '+values);
        this.values=values;
        this.table=table
        
        //connessione al database e preparazione
        this.dbUrl = 'jdbc:mysql://' + this.crudServerAddress + '/' + this.crudDatabaseName;
        this.conn = Jdbc.getConnection(this.dbUrl, this.crudUserName, this.crudUserPassword);
        
        
        // qry and statament  area
        
        //games case --- da qui****
        if (this.table=='Comm_Offerte'){
          this.qry = "update `SB_MMazza`.`ACQ_PA` set  cod=? , descrizione=? , "
          +"note_interne=? , note_fornitore=? , fkOperatore=? , fkRichiedente=? , "
          +"start=? , limite=? , end=? , terminata=? , fkGame=? , "
          +"fkOfferta=? , fkLavorazione=? , fkStatoPa=? , path=? where id=?";
          console.log(this.qry);
          this.stmt = this.conn.prepareStatement(this.qry);
          
          this.stmt.setString(1, this.values[1]);
          this.stmt.setString(2, this.values[2]);
          this.stmt.setString(3, this.values[3]);
          this.stmt.setString(4, this.values[4]);
          this.stmt.setString(5, this.values[5]);
          this.stmt.setString(6, this.values[6]);
          this.stmt.setString(7, this.values[7]);
          this.stmt.setString(8, this.values[8]);
          this.stmt.setString(9, this.values[9]);
          this.stmt.setString(10, this.values[10]);
          this.stmt.setString(11, this.values[11]);
          this.stmt.setString(12, this.values[12]);
          this.stmt.setString(13, this.values[13]);
          this.stmt.setString(14, this.values[14]);
          this.stmt.setString(15, this.values[15]);

          this.stmt.setLong  (16, this.values[0]);
        
        }else if (this.table=='offerte') {
          this.qry = "update `cmaTec`.`offerte` set  codOfferta=? , subCodOfferta=? , "
          +"tipoOfferta=? , nomeBreve=? , oggetto=? , note=? , cliente=? , stato=? , "
          +"link=? , respOfferta=? where id=?";
          
          console.log(this.qry);
          console.log('valore di id ='+this.values[0]);
          this.stmt = this.conn.prepareStatement(this.qry);
        
          this.stmt.setString(1, this.values[1]);
          this.stmt.setString(2, this.values[2]);
          this.stmt.setString(3, this.values[3]);
          this.stmt.setString(4, this.values[4]);
          this.stmt.setString(5, this.values[5]);
          this.stmt.setString(6, this.values[6]);
          this.stmt.setString(7, this.values[7]);
          this.stmt.setString(8, this.values[8]);
          this.stmt.setString(9, this.values[9]);
          this.stmt.setString(10, this.values[10]);

          this.stmt.setLong  (11, this.values[0]);
        } else {
          console.log ('big big trouble!!');
        }
       
        this.rowsAffected =this.stmt.executeUpdate();
        return this.rowsAffected;
        console.log('out da updateDataFromQuery');
      }
    
      getArrayDataFromQuery(qry){
        console.log('in getArrayDataFromQuery');
        this.stmt=this.setCrudConnection();
        console.log('connessione stabilita');
        //test di accesso alle tabelle del database
        this.qry=qry;
        this.results = this.stmt.executeQuery(this.qry);
        console.log('lettura dati da esecuzione query '+this.results)
        this.arrMetadata=this.getMetadataFromQry(this.results);
        
        //get table row by row and create a 2D array  
        this.element=''; //generic string 
        this.rsValues=[]; //initializing recordSet 2D array
        while (this.results.next()) {
          //console.log(this.results[0]);
          this.rowData=[]; //initializing rowData for each record of rs.
          //building each rsValues element
          for (this.col = 1; this.col < this.numCols+1; this.col++) {      
            // console.log(this.col);
            this.element=this.results.getString(this.col);
            //console.log(this.element);
            this.rowData.push(this.element); // each value of rowData array is a string!
          }  
          //building dataset as an array 2D (each element of array is an array. -> (ie array of arrays))
          this.rsValues.push(this.rowData);

        }
        console.log('exit from getArrayDataFromQuery');
         return this.rsValues;
        //   return arrResults;  // se invio questo ho anche i nomi delle colonne (fields names) 
      }
    
      getDataFromQry(qry){
        //string data from qry... obsolete/test
        console.log('in getReaDataFromQry');  
        this.stmt=this.setCrudConnection();
        //test di accesso alle tabelle del database
        this.qry=qry;
        //this.qry='SELECT * FROM SB_MMazza.AMM_Operations;';//---da passare come argomento
        this.results = this.stmt.executeQuery(this.qry);
        this.arrMetadata=this.getMetadataFromQry(this.results);
        
        //formatta JdbcResultSet come array di stringhe
        this.arrRecordSet =[]; //array che contiene una stringa formattata come record per ogni elemento
      
        while (this.results.next()) {
          
          this.rowString = '';
          this.numRow= this.results.getRow();
          for (this.col = 0; this.col < this.numCols; this.col++) {
            this.rowString += this.results.getString(this.col + 1) + '\t'; //t as tab; building a row string as result to output  
          }
          this.arrRecordSet.push(this.rowString);
        }
        
        //output data
        return this.arrRecordSet;
      }
    
      getMetadataFromQry(results){
        //reading metadata from JdbcResultSets
        this.results=results;
        console.log('in getMetadataFromQry method '+results);
        
        //obtaining number of query columns
        this.numCols = this.results.getMetaData().getColumnCount(); //get number of query fields  
        
        //obtaining name of fields
        this.colNames=[];
        for (var k =1; k<this.numCols+1; k++){
            this.colName = this.results.getMetaData().getColumnName(k);
            this.colNames.push(this.colName);
        }
        //building output array
        this.arrMetadata =[this.numCols,this.colNames];
        //console.log(this.arrMetadata);
        console.log('exit getMetadataFromQuery');
        return this.arrMetadata     
      }


    }//end class wrapper
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function arrayDataFromQuery(qry) {
        //reading all data from table, setting data in a 2d array
        //maybe is still a bit slow for JDBC technology own performances....
        
        //******* to be generalized **********
        
        //database connection
        var arrConnection = openConnection(); //openConnection defined in dBaseManager module. Static database connection  
        var conn=arrConnection[0];
        var stmt=arrConnection[1];   
        
        
        
        //get results
        var results=execQuery(qry); //launching query on database
        //var arrayResults =arrayFromRecordSet(results);//esegue la qry (modulo dbase)
        
        //get  metadata 
        var metaData=results.getMetaData();
        
        //get number of columns in results
        var numCols=metaData.getColumnCount(); 
        
        //get table headers (column names)  and store in an array (colNames)
        var colNames=[];
        for (var k =1; k<numCols+1; k++){
            var colName = results.getMetaData().getColumnName(k);
            colNames.push(colName);
        }
        
        Logger.log(colNames); //test
        
        
        //get table row by row and create a 2D array  
        var element=''; //generic string 
        var rsValues=[]; //initializing recordSet 2D array
        while (results.next()) {
          
          var rowData=[]; //initializing rowData for each record of rs.
          //building each rsValues element
          for (var col = 1; col < numCols+1; col++) {      
            element=results.getString(col);
            rowData.push(element) // each value of rowData array is a string!
          }  
          //building dataset as an array 2D (each element of array is an array. -> (ie array of arrays))
          rsValues.push(rowData);
    //      Logger.log (rsValues);
        }
    //   var arrResults=[colNames,rsValues]; 
       return rsValues;
    //   return arrResults;  // se invio questo ho anche i nomi delle colonne (fields names)
    }
    
    
    
    function dataFromQuery(qry) {
        //server side function, called from Client side by google.script.run + on success method 
        //connecting to database (Jdbc google method)
        //executing standard query as result
        //return results as an array
        //param seleziona  operazione su file di output 
        
        
    //    var arrConnection = openConnection();    
    //    var conn=arrConnection[0];
    //    var stmt=arrConnection[1]    
        
        var results=execQuery(qry); //launching query on database; results is a recordSet you can't use string or array methods on it
        var arrayResults =arrayFromRecordSet(results);
       
        //closeConnection(results,stmt,conn); 
        return arrayResults; //send array results to client
    }
    
    function arrayFromRecordSet(results){
        //called from Crud function
        //return a 2d rset from query result
        //you may use it also with doc and sheet!!!
        
        var arrMetadata=metadataFromQuery(results);
        var numCols=arrMetadata[0];
        var colNames=arrMetadata[1];
    
        var arrRecordSet =[]; //array che contiene una stringa formattata come record per ogni elemento
      
        while (results.next()) {
          
          var rowString = '';
          var numRow= results.getRow();
          for (var col = 0; col < numCols; col++) {
            rowString += results.getString(col + 1) + '\t'; //t as tab; building a row string as result to output  
          }
          arrRecordSet.push(rowString);
        }
       
        console.log('da arrayFromRecordSet '+arrRecordSet);
        return arrRecordSet;
    }
    
    
    
    
    
    
    
    function htmlOutputBuilder(results){
        // build a rowString from results as an array from a recordSet
        // not used by now 
        // var row=0; //why this?!?!?! it works fine...
           
        while (results.next()) {
          row++;
          var rowString = '';
          var numRow= results.getRow();
          for (var col = 0; col < numCols; col++) {
            rowString += results.getString(col + 1) + '\t'; //building a row string as result to output  
          }
        }
        arrRecordSet.push(rowString);
        return (arrRecordSet);
    
    }
    