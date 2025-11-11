import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator, Database } from 'firebase/database';

const firebaseConfig = {
	apiKey: "AIzaSyCL5LM_4fIAJZPHzE2rixydyHRjgbQ22bQ",
	authDomain: "eye-care-dela-luna.firebaseapp.com",
	projectId: "eye-care-dela-luna",
	storageBucket: "eye-care-dela-luna.firebasestorage.app",
	messagingSenderId: "100294651871",
	appId: "1:100294651871:web:43f1abcab9aa54f7fd1e6a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
// const database = (() => {
// 	const err = new Error();
// 	const stack = err.stack?.split("\n").slice(2).join("\n"); // skip first 2 lines for clarity
// 	throw new Error(
// 		`Realtime Database is disabled! Please convert to Firestore.\nAccessed from:\n${stack}`
// 	);
// })() as Database;

const useEmulator = process.env.REACT_APP_USE_EMULATOR === 'true';

if (useEmulator) {
	connectAuthEmulator(auth, 'http://localhost:8001', {disableWarnings: true});
	connectFirestoreEmulator(firestore, 'localhost', 8002);
	connectDatabaseEmulator(database, 'localhost', 8003);
}

export {
	app,
	auth,
	firestore,
	database
}