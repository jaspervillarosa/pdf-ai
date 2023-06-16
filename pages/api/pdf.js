import multer from 'multer';
import pdfjsLib from 'pdfjs-dist';


const storage = multer.memoryStorage();
const upload = multer({ storage }).single('pdfFile');

export default async function handler(req, res) {

    if(req.method === 'GET'){
        res.status(200).json({message: 'No data yet'})
    }

    else if(req.method === 'POST'){
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
              return res.status(500).json({ message: err.message });
            } else if (err) {
              return res.status(500).json({ message: 'Unexpected error occurred by Jasper' });
            }
        
            if (!req.file) {
              return res.status(400).json({ message: 'No file uploaded' });
            }
        
            try {
              const data = req.file.buffer;
              const pdf = await pdfjsLib.getDocument(data).promise;
              const textContent = await pdf.getPage(1).then(page => page.getTextContent());
              const text = textContent.items.map(item => item.str).join(' ');
              
              // You can send the extracted text as a response or perform any other desired actions
              return res.status(200).json({ text });
            } catch (error) {
              return res.status(500).json({ message: 'Failed to extract text from PDF' });
            }
          });
    }
 
}
