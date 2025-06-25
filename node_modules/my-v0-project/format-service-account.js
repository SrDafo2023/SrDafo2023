const fs = require('fs');

// Cambia la ruta si tu archivo JSON tiene otro nombre o ubicación
const path = './serviceAccountKey.json';

const json = JSON.parse(fs.readFileSync(path, 'utf8'));

// Reemplaza saltos de línea en la private_key por \n
json.private_key = json.private_key.replace(/\n/g, '\\n');

// Convierte todo el objeto a una sola línea
const envValue = JSON.stringify(json);

// Imprime la línea lista para pegar en .env.local
console.log(`FIREBASE_SERVICE_ACCOUNT_KEY='${envValue}'`); 

