// Validation du site statique avant déploiement.
// 1) Syntaxe des <script> inline de chaque page HTML de la racine.
// 2) Résolution des liens internes href="*.html" vers des fichiers existants.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

let failed = false;

console.log(`Pages HTML détectées : ${htmlFiles.join(', ')}\n`);

// --- 1) Syntaxe JS inline ---
for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];

    scripts.forEach((match, i) => {
        try {
            new vm.Script(match[1], { filename: `${file}#script${i}` });
            console.log(`OK   ${file} [script ${i}] (${match[1].length} chars)`);
        } catch (e) {
            failed = true;
            console.error(`FAIL ${file} [script ${i}]: ${e.message}`);
        }
    });

    if (scripts.length === 0) {
        console.log(`--   ${file}: aucun script inline`);
    }
}

// --- 2) Liens internes ---
console.log('\nVérification des liens internes...');
for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const hrefs = [...html.matchAll(/href="([^"#]+\.html)(#[^"]*)?"/g)].map(m => m[1]);
    const locationHrefs = [...html.matchAll(/location\.href\s*=\s*'([^']+\.html)'/g)].map(m => m[1]);

    for (const target of [...new Set([...hrefs, ...locationHrefs])]) {
        if (!fs.existsSync(path.join(root, target))) {
            failed = true;
            console.error(`FAIL ${file}: lien brisé vers "${target}"`);
        } else {
            console.log(`OK   ${file} -> ${target}`);
        }
    }
}

if (failed) {
    console.error('\nValidation échouée.');
    process.exit(1);
}
console.log('\nValidation réussie : toutes les pages sont valides.');
