<script lang="ts">
	import { goto } from '$app/navigation';
	import Authcheck from '$components/Authcheck.svelte';
	import { db, storage, user } from '$lib/firebase';
	import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import { Button, Fileupload, Helper, Input, Label, Textarea } from 'flowbite-svelte';

	let img: HTMLImageElement;
	let file: File;
	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		img = new Image();
		if (!input.files) {
			return;
		}
		file = input.files[0];
		const objectUrl = URL.createObjectURL(file);
		img.src = objectUrl;
	}

	async function handleUpload(posterId: string) {
		const storageRef = ref(storage, `posters/${posterId}/poster.png`);
		const result = await uploadBytes(storageRef, file);
		const url = await getDownloadURL(result.ref);
		return url;
	}

	async function handleSubmit(e: Event) {
		if (!e.target) return alert('Something went wrong. Please try again later.');
		const formData = new FormData(e.target as HTMLFormElement);
		const posterName = formData.get('posterName');
		const posterDesc = formData.get('posterDesc');
		if (!posterName) return alert("Poster Title Can't be empty.");
		if (!img || !file) return alert('Please select image');
		if (file.size > 2 * 1024 * 1024) return alert('Please select file that is less than 2 MB.');
		if (img.width !== img.height) return alert('Please select square image');
		const posterRef = doc(collection(db, 'posters'));
		const url = await handleUpload(posterRef.id);
		await setDoc(posterRef, {
			userUid: $user?.uid,
			username: $user?.displayName,
			userPfp: $user?.photoURL,
			posterName,
			posterDesc,
			posterUrl: url,
			time: serverTimestamp(),
			supporters: 0,
			height: img.height
		});
		console.log(url);
		goto(`/p/${posterRef.id}`);
	}
</script>

<Authcheck>
	<div class="w-[90%] mx-auto my-auto">
		<form class="mt-32" on:submit|preventDefault={handleSubmit}>
			<div class="mb-6">
				<Label for="posterName" class="mb-2">Write your poster title</Label>
				<Input
					id="posterName"
					name="posterName"
					color={'base'}
					placeholder="Poster Name"
					required={true}
				/>
			</div>
			<div class="mb-6">
				<Label for="posterDesc" class="mb-2">Write description about your poster (optional)</Label>
				<Textarea name="posterDesc" id="posterDesc" rows="4" placeholder="Poster Description" />
			</div>
			<div>
				<Label for="posterImage" class="mb-2">Add Image</Label>
				<Fileupload id="posterImage" accept="image/png" on:change={handleFileSelect} />
				<Helper>Only SQUARE PNG (.png) files are allowed.(Ex. 500x500, 1080x1080 etc...)</Helper>
			</div>
			<div class="flex w-full justify-end mt-5">
				<Button type="submit" class="text-md">Create</Button>
			</div>
		</form>
	</div>
</Authcheck>
