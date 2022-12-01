import { writable } from 'svelte/store';

const Cache = writable(new Map<string, any>());

export default Cache;