// Script to upload all mock-data/*.json files to Firestore collections
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Path to your Firebase service account key
const serviceAccount = require('./functions/lib/serviceAccountKey.json'); // <-- Place your service account key here

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const mockDataDir = path.join(__dirname, 'mock-data');

// Set to true to clean up collections before uploading
const CLEAN_BEFORE_UPLOAD = true;

async function deleteAllDocs(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  if (!snapshot.empty) {
    await batch.commit();
    console.log(`Deleted all documents in ${collectionName}`);
  }
}

async function uploadCollection(fileName) {
  const collectionName = fileName.replace('.json', '');
  const filePath = path.join(mockDataDir, fileName);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!Array.isArray(data)) {
    console.error(`${fileName} does not contain an array.`);
    return;
  }

  if (CLEAN_BEFORE_UPLOAD) {
    await deleteAllDocs(collectionName);
  }

  const batch = db.batch();
  data.forEach((item) => {
    // Flatten 'fields' into the root object if present
    const flatItem = item.fields ? { id: item.id, ...item.fields } : item;
    const docRef = flatItem.id
      ? db.collection(collectionName).doc(flatItem.id.toString())
      : db.collection(collectionName).doc();
    batch.set(docRef, flatItem);
  });
  await batch.commit();
  console.log(`Uploaded ${data.length} documents to ${collectionName}`);
}

async function main() {
  const files = fs.readdirSync(mockDataDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    await uploadCollection(file);
  }
  console.log('All mock data uploaded!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 