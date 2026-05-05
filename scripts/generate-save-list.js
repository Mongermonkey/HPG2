// Script Node.js per generare saves/list.json con la lista dei file .json presenti in saves/
const fs = require('fs');
const path = require('path');


const savesDir = path.join(__dirname, '../saves');
const outputFile = path.join(__dirname, 'savelist.json');

fs.readdir(savesDir, (err, files) => {
  if (err) {
    console.error('Errore nella lettura della cartella saves:', err);
    process.exit(1);
  }
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  fs.writeFileSync(outputFile, JSON.stringify(jsonFiles, null, 2));
  console.log('Creato saves/list.json:', jsonFiles);
});
