import { Web3Storage } from 'web3.storage';

const token: string = process.env.NEXT_PUBLIC_STORAGE_WEB3 || "";
const client = new Web3Storage({ token: token, endpoint: new URL('https://api.web3.storage') });

export function get_ipfs_link(subDomain: string, filename: string) {
    return `https://${subDomain}.ipfs.w3s.link/${filename}`;
}

const subDomainNearDateStorage: string = process.env.NEXT_PUBLIC_STORAGE_WEB3_NEARMARS || "";

export function get_ipfs_link_image(nearmars_id: string) {
    return `https://${subDomainNearDateStorage}.ipfs.w3s.link/${nearmars_id}.png`;
}


export function near_mars_get_ipfs_link_image(id: string) {
    return `/images/${id}.png`;
}


export default client;
