import { connect } from './connect.js';

async function createBike() {
    const db = await connect();
}

export { createBike };