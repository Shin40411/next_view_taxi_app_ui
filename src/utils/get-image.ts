import { ASSETS_API } from 'src/config-global';

export const getFullImageUrl = (path: string | undefined): string => {
    if (!path) return '';
    const normalizedPath = path.replace(/\\/g, '/');
    // console.log(path.startsWith('http') ? path : `${ASSETS_API}/${normalizedPath}`);
    return path.startsWith('http') ? path : `${ASSETS_API}/${normalizedPath}`;
};
