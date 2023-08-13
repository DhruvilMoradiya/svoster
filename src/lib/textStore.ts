import { writable } from 'svelte/store';

export const textElement = writable<{ isVisible: boolean; element: fabric.IText | null }>({
	isVisible: false,
	element: null
});

export const color = writable('#ff0000');
