import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import got from 'got';
import sharp from 'sharp';
import URLParse from 'url-parse';

const outputServerDir = './public/external-images';
const outputSrcDir = '/external-images';

export default async function optimizeExternalImage(
  src: string,
  width: number,
  quality = 80,
): Promise<{
  avif: string;
  webp: string;
  jpeg: string;
}> {
  const externalUrl = new URLParse(src);

  const originalServerPath = await downloadExternalImage(
    os.tmpdir(),
    externalUrl.pathname,
    src,
  );

  const [avifServerPath, avifSrcPath] = getOptimizePath(
    externalUrl.pathname,
    'avif',
  );
  const [webpServerPath, webpSrcPath] = getOptimizePath(
    externalUrl.pathname,
    'webp',
  );
  const [jpegServerPath, jpegSrcPath] = getOptimizePath(
    externalUrl.pathname,
    'jpeg',
  );

  // Create directories
  await Promise.all([
    fs.ensureFile(avifServerPath),
    fs.ensureFile(webpServerPath),
    fs.ensureFile(jpegServerPath),
  ]);

  // Optimize to AVIF
  await sharp(originalServerPath)
    .resize({
      fit: sharp.fit.contain,
      width: width,
    })
    .avif({ quality: quality })
    .toFile(avifServerPath);

  // Optimize to WebP
  await sharp(originalServerPath)
    .resize({
      fit: sharp.fit.contain,
      width: width,
    })
    .webp({ quality: quality })
    .toFile(webpServerPath);

  // Optimize to JPEG
  await sharp(originalServerPath)
    .resize({
      fit: sharp.fit.contain,
      width: width,
    })
    .jpeg({ quality: quality })
    .toFile(jpegServerPath);

  return {
    avif: avifSrcPath,
    webp: webpSrcPath,
    jpeg: jpegSrcPath,
  };
}

function getOptimizePath(
  saveName: string,
  optimizedExt: string,
): string[] {
  const optimizedSaveName = saveName.replace(
    new RegExp(`(.*)${saveName.split('.').slice(-1)}`),
    `$1${optimizedExt}`,
  );

  const serverPath = path.join(
    outputServerDir,
    optimizedSaveName,
  );
  const srcPath = path.join(
    outputSrcDir,
    optimizedSaveName,
  );

  return [serverPath, srcPath];
}

export async function downloadExternalImage(
  destDir: string,
  saveName: string,
  externalUrl: string,
): Promise<string> {
  const outputPath = path.join(destDir, saveName);
  await fs.ensureFile(outputPath);

  return new Promise((resolve, reject) => {
    try {
      const readStream = got.stream(externalUrl);
      const writeStream = fs.createWriteStream(outputPath);

      readStream.pipe(writeStream);

      writeStream.on('finish', () => {
        resolve(outputPath);
      });
    } catch (e) {
      reject(e);
    }
  });
}
