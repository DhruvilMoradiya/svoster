<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, user } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { Alert, Button } from 'flowbite-svelte';
	function goToLogin() {
		console.log('going to login');
		goto('/login');
	}
</script>

{#if $user}
	<slot />
{:else}
	<Alert>
		<div class="flex items-center gap-3">
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/></svg
			>
			<span class="text-lg font-medium">This is a info alert</span>
		</div>
		<p class="mt-2 mb-4 text-sm">You must be sign in to see this page</p>
		<div class="flex gap-2">
			<Button size="xs" on:click={goToLogin}
				><svg
					aria-hidden="true"
					class="-ml-0.5 mr-2 h-4 w-4"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path
						fill-rule="evenodd"
						d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
						clip-rule="evenodd"
					/></svg
				>Sign In</Button
			>
		</div>
	</Alert>
{/if}
