import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, '../storage');

// Ensure the storage directory exists
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

const transcodeTo480p = (sourceName: string, sourcePath: string) => {
  const outputName = sourceName.replace('.mp4', '_480p.mp4');
  const outputPath = path.join(storagePath, outputName);

  console.log(`🎬 Starting background transcode to 480p for: ${sourceName}`);

  ffmpeg(sourcePath)
    .output(outputPath)
    .videoCodec('libx264')
    .size('854x480')
    .videoBitrate('1000k')
    .audioCodec('aac')
    .audioBitrate('128k')
    .on('end', () => {
      console.log(`✅ successfully transcoded variant: ${outputName}`);
    })
    .on('error', (err) => {
      console.error(`❌ FFmpeg pipeline error processing variant:`, err.message);
    })
    .run();
};

export const handleChunkUpload = async (req: Request, res: Response): Promise<any> => {
  console.log('Incoming request query:', req.query);

  const chunkNumber = parseInt(req.query.chunkNumber as string);
  const totalChunks = parseInt(req.query.totalChunks as string);
  const fileName = req.query.fileName as string;

  if (isNaN(chunkNumber) || isNaN(totalChunks) || !fileName) {
    console.error('Validation failed:', { chunkNumber, totalChunks, fileName });
    return res.status(400).json({ 
      error: 'Missing or invalid parameters', 
      details: { chunkNumber, totalChunks, fileName } 
    });
  }

  const chunkDir = path.join(storagePath, `chunks_${fileName}`);
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const chunkPath = path.join(chunkDir, `chunk_${chunkNumber}`);
  const writeStream = fs.createWriteStream(chunkPath);

  req.on('data', (data) => writeStream.write(data));
  req.on('end', async () => {
    writeStream.end();

    const uploadedChunks = fs.readdirSync(chunkDir).length;
    if (uploadedChunks === totalChunks) {
      const finalFileName = `${Date.now()}-${fileName}`;
      const finalFilePath = path.join(storagePath, finalFileName);
      const mainWriteStream = fs.createWriteStream(finalFilePath);

      for (let i = 0; i < totalChunks; i++) {
        const currentChunkPath = path.join(chunkDir, `chunk_${i}`);
        if (fs.existsSync(currentChunkPath)) {
            const buffer = fs.readFileSync(currentChunkPath);
            mainWriteStream.write(buffer);
            fs.unlinkSync(currentChunkPath);
        }
      }
      mainWriteStream.end();
      fs.rmdirSync(chunkDir);

      console.log(`🚀 Binary integration complete: ${finalFileName}`);
      transcodeTo480p(finalFileName, finalFilePath);

      return res.json({ message: 'Upload complete & reassembly finalized', completed: true });
    }

    res.json({ message: `Chunk ${chunkNumber} stored securely`, completed: false });
  });
};