import { createContext } from '@lit/context';

export interface FiltersContext {
	locations: Set<string>;
	industries: Set<string>;
	types: Set<string>;
}

export const filtersContext = createContext<FiltersContext>('filtersContext');
