import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sharp(path.join(__dirname, '../public/assets/pngwing.com.png'))
  .resize(1024, 1024, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .toFile(path.join(__dirname, '../public/assets/pngwing.com-large.png'))
  .then(() => console.log('Icon resized successfully!'))
  .catch(err => console.error('Error resizing icon:', err)); 