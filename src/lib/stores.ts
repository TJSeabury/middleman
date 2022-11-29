import { writable } from 'svelte/store';

const Cache = writable(new Map<string, string>());

export default Cache;