import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
    cleanup();
});

if (!globalThis.localStorage) {
    globalThis.localStorage = {
        getItem: vi.fn() as unknown as Storage['getItem'],
        setItem: vi.fn() as unknown as Storage['setItem'],
        removeItem: vi.fn() as unknown as Storage['removeItem'],
        clear: vi.fn() as unknown as Storage['clear'],
        length: 0,
        key: vi.fn() as unknown as Storage['key'],
    } as unknown as Storage;
}
