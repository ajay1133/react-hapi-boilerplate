import config from '../config';
import openSocket from 'socket.io-client';
const socket = openSocket(`${config.apiHost}`);

export function getSocket() {
return socket;
}