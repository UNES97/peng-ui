const mode = import.meta.env.DEV;
export const BASE_URL = mode ? 'http://localhost:4000/' :  `${window.location.origin}/`;