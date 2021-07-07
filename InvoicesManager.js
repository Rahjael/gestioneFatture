
class InvoicesManager {

  constructor(arrayOfObjects) {
    this.relevantXMLKeys = this.establishFormattedPaths();
    this.rawInvoices = arrayOfObjects; // This comes from XML parsing
    this.invoices = this.parseRawInvoices(this.rawInvoices);
  }

  establishFormattedPaths() {
    const relevantXMLKeys = {
      // As defined at https://fex-app.com/FatturaElettronica
      supplierPI:       "FatturaElettronicaHeader.CedentePrestatore.DatiAnagrafici.IdFiscaleIVA.IdCodice",
      supplierName:     "FatturaElettronicaHeader.CedentePrestatore.DatiAnagrafici.Anagrafica.Denominazione",
      receiverPI:       "FatturaElettronicaHeader.CessionarioCommittente.DatiAnagrafici.IdFiscaleIVA.IdCodice",
      receiverName:     "FatturaElettronicaHeader.CessionarioCommittente.DatiAnagrafici.Anagrafica.Denominazione",
      documentDate:     "FatturaElettronicaBody.DatiGenerali.DatiGeneraliDocumento.Data",
      documentNumber:   "FatturaElettronicaBody.DatiGenerali.DatiGeneraliDocumento.Numero",
      documentNet:      "FatturaElettronicaBody.DatiBeniServizi.DatiRiepilogo.ImponibileImporto",
      documentTax:      "FatturaElettronicaBody.DatiBeniServizi.DatiRiepilogo.Imposta"
    }
    for(let key in relevantXMLKeys) {
      relevantXMLKeys[key] = relevantXMLKeys[key].split('.').concat("_text");
    }
    return relevantXMLKeys;
  }

  getValueFromXML = (obj, path) => { // path is an array
    // Utility to traverse object properties
    obj = obj[Object.keys(obj)[0]]; // Get rid of parent node (format is not very predictable and I don't need it anyway)
    // path = path.split('.').concat("_text"); // "_text" is added to every node value by xml-js lib when parsing xml files
    return path.reduce( (currentPos, currentPath) => {
      return currentPos && currentPos[currentPath]; // && is failsafe for undefined paths
    }, obj);
  };

  parseRawInvoices(arrayOfObjects) {
    const defaultObjectInfo = { // TODO finish implementation
      status: 'unpaid', // or 'partial' or 'paid'
      payments: [],
      type: '' // 'received' or 'issued'
    }
    const parsedInvoices = arrayOfObjects.map( oldObj => {
      const newObj = {};
      newObj.info = JSON.parse(JSON.stringify(defaultObjectInfo)); // Add custom info used by the program
      // Populate object with relevant keys and respective values
      Object.keys(this.relevantXMLKeys).forEach( key => {
        newObj[key] = this.getValueFromXML(oldObj, this.relevantXMLKeys[key]); // (Object, Array)
      });
      return newObj;
    });
    console.log("Parsed: ", parsedInvoices); // TODO comment out or delete
    return parsedInvoices;
  }

  saveInvoicesInJSON() {
    let invoices = JSON.stringify(this.invoices);
    require('fs').writeFileSync('./invoices.json', invoices, (err) => {
      if(err) {
        console.log("Error: ", err);
      }
    });
  }

  getAllInvoices() {
    return this.invoices;
  }




}

module.exports.InvoicesManager = InvoicesManager;