export type DataMode = "local" | "live";

const envMode = import.meta.env.VITE_DATA_MODE;

export const DATA_MODE: DataMode = envMode ?? "local";
