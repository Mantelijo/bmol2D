/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SECONDARY_STRUCTURE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
