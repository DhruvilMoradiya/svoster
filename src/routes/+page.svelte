<script lang="ts">
	import Authcheck from '$components/Authcheck.svelte';
	import { auth, user } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
	import { Button } from 'flowbite-svelte';

	async function Logout() {
		await signOut(auth);
	}
</script>

<Authcheck>
	<h1>Hello, {$user?.displayName}</h1>
	<Button on:click={Logout}>Logout</Button>
</Authcheck>
