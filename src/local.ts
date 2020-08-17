import app from './index';
import { AddressInfo } from 'net';

const server = app.listen(3000, () => {
    if (server) {
        const address = server.address() as AddressInfo;
        console.log(`Servidor rodando em http://localhost:${address.port}`);
    } else {
        console.log(`Falha ao rodar o servidor.`);
    }
});