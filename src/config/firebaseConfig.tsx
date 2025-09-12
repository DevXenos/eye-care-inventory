import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

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

if (window.location.host.includes("localhost")) {
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