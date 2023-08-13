<script lang="ts">
	import { canvas } from '$lib/canvasStore';
	import { textElement, color } from '$lib/textStore';
	import { Button, ButtonGroup, Input } from 'flowbite-svelte';
	import { BoldSolid, ItalicSolid, TrashBinSolid, UnderlineSolid } from 'flowbite-svelte-icons';

	$: element = $textElement.element;

	$: {
		colorChangeHandler($color);
	}

	function deleteTextHandler() {
		//@ts-ignore
		$canvas?.remove(element);
	}

	function boldTextHandler() {
		if (element?.get('fontWeight') === 'bold') {
			element.set({ fontWeight: 'normal' });
		} else {
			element?.set({ fontWeight: 'bold' });
		}
		$canvas?.renderAll();
	}

	function italicTextHandler() {
		if (element?.get('fontStyle') === 'italic') {
			element.set({ fontStyle: 'normal' });
		} else {
			element?.set({ fontStyle: 'italic' });
		}
		$canvas?.renderAll();
	}

	function underlineTextHandler() {
		if (element?.get('underline')) {
			element.set({ underline: false });
		} else {
			element?.set({ underline: true });
		}
		$canvas?.renderAll();
	}

	function colorChangeHandler(color: string) {
		element?.set({ fill: color });
		$canvas?.renderAll();
	}
</script>

<div class="flex gap-4 items-center">
	<ButtonGroup>
		<Button on:click={boldTextHandler}>
			<BoldSolid />
		</Button>
		<Button on:click={italicTextHandler}>
			<ItalicSolid />
		</Button>
		<Button on:click={underlineTextHandler}>
			<UnderlineSolid />
		</Button>
	</ButtonGroup>

	<!-- <label for="color" class="w-4 h-4 bg-black text-white">Hello</label> -->
	<input
		type="color"
		id="color"
		class="w-10 h-10 [&::-webkit-color-swatch]:border-none
        [&::-webkit-color-swatch]:rounded-md"
		bind:value={$color}
	/>
</div>

<Button on:click={deleteTextHandler}>
	<TrashBinSolid />
</Button>

<style>
</style>
