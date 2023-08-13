import { writable } from 'svelte/store';

export const canvas = writable<fabric.Canvas | null>(null);
