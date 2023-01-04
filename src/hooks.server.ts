import cron from 'node-cron';
import { revalidate } from './routes/api/cornerstonebank/rates/+server';

console.log('initializing cache...');
await revalidate();
console.log('done.')

cron.schedule('*/30 * * * *', revalidate);
