// import boto3 from botocore.config;
import AWS from 'aws-sdk'

const client =  new AWS.Textract ({

    region: process.env.REGION, // Replace with your desired region

})

export const initializeS3 = () => {
    const s3 = new AWS.S3(client)
    return s3
}

const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: "prologue.pdf",
    Expires: 60,
    ContentType: 'application/pdf',
    ACL: 'public-read'
}


export default async function handler(req, res){

    try{

        const s3 = initializeS3();
        const command = new s3.analyzeDocument(params);
        const data = await client.send(command)
        res.status(200).json({data});

    }catch(error){
        console.log(error);
        res.status(500).json({message: error.stack})
    }  
}





