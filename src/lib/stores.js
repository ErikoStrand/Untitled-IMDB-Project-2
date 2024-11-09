import { writable } from 'svelte/store';
import { persist, createSessionStorage } from '@macfja/svelte-persistent-store';

export let uploaded = persist(writable(false), createSessionStorage(), 'uploaded');
export let loading = writable(false);
