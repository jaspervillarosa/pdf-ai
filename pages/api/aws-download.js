import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
import { Readable } from 'stream'
import pdf from 'pdf-parse';
import fs from 'fs'
import { pipeline } from 'stream/promises';

const config = {
    region: process.env.REGION, // Replace with your desired region
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    signatureVersion: 'v4'
  };

export default async function handler(req, res) {
    try {

      const {filename} = req.body
      const client = new S3Client(config);
      const input = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Expires: 60,
        ContentType: 'application/pdf',
        ACL: 'public-read'
      };
  ``
      const command = new GetObjectCommand(input);
      const response = await client.send(command);

      const pdf_path = '/tmp/test.pdf';
      const writeStream = fs.createWriteStream(pdf_path);
  
      await pipeline(response.Body, writeStream);
  
      let dataBuffer = fs.readFileSync('/tmp/test.pdf');

      const data = await pdf(dataBuffer);
      console.log(data.text);

      res.status(200).json({ text: data.text });
      
      // res.status(200).json({binaryPages});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.stack}) 
    }
  }