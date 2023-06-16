import fs from 'fs';
import AWS, { S3Client, GetObjectCommand }  from 'aws-sdk'
import formidable from 'formidable';

const s3Client = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4'
}

export const initializeS3 = () => {
    const s3 = new AWS.S3(s3Client)
    return s3
}

export default async function handler(req, res){


        try {

            const {fileName} = req.body
            console.log("This is the fileName for Upload:", fileName)

            const s3 = initializeS3();

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                // Key: "sample.pdf",
                Key: fileName,
                Expires: 60,
                ContentType: 'application/pdf',
                ACL: 'public-read'

            }

            const url = await s3.getSignedUrl('putObject', params);
            const response = res.status(200).send({url: url})
            res.status(200).json(url)
            console.log("this is the response in upload:", response)
            console.log('this is the url for upload', url)

        }catch(error){
            console.log(error);
            res.status(500).json({message: error.stack}) 
        }

}