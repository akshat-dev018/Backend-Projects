import ImageKit, {toFile} from '@imagekit/nodejs';
import config from '../src/config/config.js';

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

// upload file to imageKit
export async function uploadFiles({buffer,fileName}) {
    const response = await client.files.upload({
        file: await toFile(buffer),
        fileName:fileName,
        folder:"Snitch"
    })
    return response;
}

