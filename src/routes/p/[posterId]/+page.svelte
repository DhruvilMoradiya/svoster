<script lang="ts">
	import TextSec from '$components/TextSec.svelte';
	import { textElement } from '$lib/textStore';
	import { fabric } from 'fabric';
	import { Button, Spinner } from 'flowbite-svelte';
	import {
		CameraFotoOutline,
		DownloadOutline,
		PlusSolid,
		TrashBinSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { canvas } from '$lib/canvasStore';

	export let data: PageData;
	const date = new Date(data.time.seconds * 1000);
	let fileSelected = false;
	let loading = true;
	let selectedImg: fabric.Image;
	console.log(data);
	let copied = false;

	$: {
		if (copied) {
			setInterval(() => {
				copied = false;
			}, 2000);
		}
	}

	onMount(() => {
		const canvasObj = new fabric.Canvas('canvas', {
			preserveObjectStacking: true
		});

		canvas.set(canvasObj);

		fetch(data.posterUrl)
			.then((result) => result.blob())
			.then((blob) => {
				loading = false;
				const url = URL.createObjectURL(blob);
				fabric.Image.fromURL(url, function (img) {
					img.set({ evented: false });
					img.scaleX = $canvas?.getWidth()! / data.height;
					img.scaleY = $canvas?.getHeight()! / data.height;
					img.selectable = false;
					$canvas?.add(img);
					// $canvas?.sendToBack(img);
				});
			});
		$canvas?.on('selection:created', () => {
			console.log($canvas?.getActiveObject()?.type);
			if ($canvas?.getActiveObject() && $canvas?.getActiveObject()?.type === 'i-text') {
				textElement.set({
					isVisible: true,
					element: $canvas?.getActiveObject() as fabric.IText
				});
				console.log('fired');
			}
		});
		$canvas?.on('selection:cleared', () => {
			if ($textElement) {
				textElement.set({ isVisible: false, element: null });
			}
		});
		$canvas?.on('selection:updated', () => {
			if ($canvas?.getActiveObject()?.type !== 'i-text') {
				textElement.set({ isVisible: false, element: null });
			}
			if ($canvas?.getActiveObject()?.type === 'i-text') {
				textElement.set({ isVisible: true, element: $canvas?.getActiveObject() as fabric.IText });
			}
		});
	});

	function handleChange(e: Event) {
		const file = (e.target as HTMLInputElement).files![0];
		if (!file) return;
		fileSelected = true;
		const fileObjURL = URL.createObjectURL(file);
		fabric.Image.fromURL(fileObjURL, (img) => {
			selectedImg = img;
			$canvas?.add(selectedImg);
			const ratio =
				selectedImg.width! > selectedImg.height!
					? $canvas?.getWidth()! / selectedImg.width!
					: $canvas?.getHeight()! / selectedImg.height!;

			selectedImg.scaleX = ratio;
			selectedImg.scaleY = ratio;
			selectedImg.set({
				originX: 'center',
				originY: 'center',
				top: $canvas?.getHeight()! / 2,
				left: $canvas?.getWidth()! / 2
			});
			$canvas?.sendToBack(selectedImg);
		});
	}

	function download() {
		let link = document.createElement('a');
		link.download = 'poster.jpeg';
		link.href = $canvas?.toDataURL() || '';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function addTextHandler(): void {
		const text = new fabric.IText('Add your text');

		$canvas?.add(text);
		$canvas?.setActiveObject(text);
		textElement.set({ isVisible: true, element: $canvas?.getActiveObject() as fabric.IText });
	}

	function deleteTextHandler(e: MouseEvent): void {
		$canvas?.remove(selectedImg);
		fileSelected = false;
	}

	function shareClickHandler() {
		if (navigator.share) {
			navigator
				.share({
					title: data.posterName,
					text: data.posterName,
					url: window.location.href
				})
				.then(() => console.log('Successful share'))
				.catch((error) => console.log('Error sharing', error));
		} else {
			alert('Your browser do not support sharing');
		}
	}

	function copyClickHandler() {
		navigator.clipboard.writeText(window.location.href);
		copied = true;
	}
</script>

<svelte:head>
	<title
		>{data.posterName.length > 20 ? `${data.posterName.slice(0, 30)}...` : data.posterName} | Svoster</title
	>
</svelte:head>

{#if loading}
	<div class="fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-slate-500">
		<Spinner />
	</div>
{/if}

<div class="flex flex-col items-center justify-center-center w-[90%] mx-auto">
	<div class="flex flex-col items-center my-10">
		<h2 class="text-3xl font-semibold">{data.posterName}</h2>
		{#if data.posterDesc.length > 100}
			<p class="text-gray-500 text-md text-center w-11/12">{data.posterDesc.slice(0, 100)}...</p>
		{/if}
		<p class="text-sm">by {data.username}</p>
		<p class="mt-2">
			{data.supporters} supporters || {date.getDate()}-{date.getMonth()}-{date.getFullYear()}
		</p>
		<div class="mt-2">
			<Button outline size="xs" on:click={shareClickHandler}>Share</Button>
			<Button outline size="xs" on:click={copyClickHandler}
				>{copied ? 'Copied' : 'Copy link'}</Button
			>
		</div>
	</div>

	<canvas id="canvas" width="360" height="360" style="border: 1px solid black;" />
	<div class="w-full pt-5">
		{#if !fileSelected}
			<input type="file" on:change={handleChange} id="file-input" hidden accept="image/*" />
			<label
				for="file-input"
				class="text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-5 py-2.5 text-lg text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg w-full"
			>
				<CameraFotoOutline class="pr-2" size="lg" /> Choose Photo</label
			>
		{:else if $textElement.isVisible}
			<TextSec />
		{:else}
			<div class="flex mb-4">
				<Button class="text-lg w-full mr-3" outline on:click={addTextHandler}
					><PlusSolid size="lg" class="pr-2" /> Add text</Button
				>
				<Button on:click={deleteTextHandler}>
					<TrashBinSolid />
				</Button>
			</div>
			<Button on:click={download} class="text-lg w-full "
				><DownloadOutline class="pr-2" size="lg" /> Download</Button
			>
		{/if}
	</div>
</div>
