import { AddressInfo } from 'net';
import app from './app.js';

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    const port = (server.address() as AddressInfo)?.port;
    console.log(`🚀 server is listening to requests on http://localhost:${port}`)
});
