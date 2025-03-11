import { createAuth0Client } from '@auth0/auth0-spa-js';

const auth0Client = await createAuth0Client({
    domain: 'dev-2d67b8khfvv4gi3r.us.auth0.com',
    client_id: 'Gy7RxKFNqwvEGBBHhiZZvBTNtVODGPB5',
    redirect_uri: 'https://shadowzone.netlify.app/callback.html',
    cacheLocation: 'localstorage'
});

export default auth0Client; 