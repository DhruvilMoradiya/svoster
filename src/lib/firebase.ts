import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { writable } from 'svelte/store';

const firebaseConfig = {
	apiKey: 'AIzaSyB26l23-fa7sFPr3qCuJsLfu-DCt2UdtHs',
	authDomain: 'svoster-9854a.firebaseapp.com',
	projectId: 'svoster-9854a',
	storageBucket: 'svoster-9854a.appspot.com',
	messagingSenderId: '885315172033',
	appId: '1:885315172033:web:ad5decc86b894d002ac640'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

/**
 * @returns a store with the current firebase user
 */
function userStore() {
	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn('Auth is not initialized or not in browser');
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		};
	}

	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
}

export const user = userStore();
