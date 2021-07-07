
function getRawJSONInvoices(path) {
  const fs = require('fs');
  const convert = require('xml-js');

  // Detect files
  let files = fs.readdirSync(path).map( file => {
    return path + '/' + file;
  });

  // Purge files not ending in .xml // TODO implement better with warnings and stuff
  files = files.filter( file => file.endsWith('.xml'));

  // Parse into JSON
  let JSONinvoices = files.map( file => {
    let content = fs.readFileSync(file, 'utf8');
    return convert.xml2js(content, {compact: true, 
                                      spaces: 1, 
                                      ignoreAttributes: true, 
                                      ignoreDeclaration: true,
                                      ignoreInstruction: true
                                    })
  });

  return JSONinvoices;
}




module.exports.getRawJSONInvoices = getRawJSONInvoices;


















// class XMLManager {
//   constructor(receivedInvoicesPath, issuedInvoicesPath) {
//     this.receivedInvoicesPath = receivedInvoicesPath;
//     this.issuedInvoicesPath = issuedInvoicesPath;
//     this.files = [];
//     this.JSONinvoices = [];
//   }

//   detectFiles() {
//     const fs = require('fs');

//     // Read both in and out folders and get every "path + filename"
//     fs.readdirSync(this.receivedInvoicesPath).forEach( file => {
//       this.files.push(this.receivedInvoicesPath + '/' + file);
//     });
//     fs.readdirSync(this.issuedInvoicesPath).forEach( file => {
//       this.files.push(this.issuedInvoicesPath + '/' + file);
//     });

//     // console.log(this.files);
//   }

//   parseFilesToObjects() {
//     const converter = require('xml-js');

//     this.files.forEach( file => {
//       let content = require('fs').readFileSync(file);
//       let tempObj = converter.xml2json(content, {compact: true, spaces: 2});
//       this.JSONinvoices.push(tempObj);
//     })

//     // this.JSONinvoices.forEach( invoice => console.log("invoice: ", invoice));
//   }

//   getJSONInvoices() {
//     return this.JSONinvoices;
//   }
// }


// module.exports.XMLManager = XMLManager;
