import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';


const Home = () => {

    const inputFile = useRef(null)
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    
    const [file, setFile] = useState(null);
    console.log("this is file:", file)
    const [text, setText] = useState([]);

    const [url, setUrl] = useState([])



    // const inputFile = useRef(null);
    const generateResponse = async (evt) => {
        inputFile?.current?.click();
        evt.preventDefault();
        
        try {
          setResponse("");
          console.log("Getting response from OpenAI...");
          setIsLoading(true)
  
          const response = await fetch("/api/route", {
            method: "POST",
            headers: {
                       "Content-Type": "application/json",
                      },
            body: JSON.stringify(text),
              });
      
          const data = await response.json();
          setResponse(data.text);
        }catch(err){
          console.error(err.stack);
        }finally{
          setIsLoading(false)};
    }

      const handleSubmit= async (e) => {

        e.preventDefault();
        console.log("file:", file)
        const response = await axios.post(`/api/aws-upload`, {
          fileName: file.name
        });

        console.log(file.name)
        const uploadUrl = response.data.url;
        console.log("This is the response:", response)
        console.log("This is the url:", uploadUrl)
        if (!uploadUrl) {
          throw new Error('Upload URL is missing');
        }
        await axios.put(uploadUrl, file)
        console.log('File uploaded successfully');

        const response_dl = await axios.get('/api/aws-download')

        const fileContent = response_dl.data.text
        if (!fileContent) {
          throw new Error('Text is missing');
        }
        console.log("this is the fileContentType:", fileContent)

        await setText(fileContent)
        console.log('Extracted successfully');

      }
   
  return (
    <section 
        className="w-full flex-center flex-center flex-col"
    >        
                <div className="title-container text-center mt-20">
                    <span className="green_gradient head_text pt-20">
                        JasperAI
                    </span> 
                    <br className="max-md:hidden" />
                    <p className="desc text-center text-justify">
                        We will summarize any lengthy PDF file you upload..
                    </p>
              </div>

              <div>
                <form className="aws-container mt-5" onSubmit={handleSubmit}>
                  <input
                   type="file" onChange={(e)=> setFile(e.target.files[0])} accept="*/*" name="file" />
                  <button
                  className="rounded-full"
                  type='submit'>Upload</button>
                </form>
              </div>

              <form 
                  action="" 
                  className="mt-10 w-full max-w-2xl flex flex-row gap-7 glassmorphism"
              >
                  <div htmlFor="">
                    <div>   
                      <textarea
                            // type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="form_input" 
                            style={{width: "325%", height: "100px"}}
                            required
                            placeholder="upload a pdf file"
                            onKeyDown={e => e.key === 'Enter' ? generateResponse(): null}
                        />
                    </div>
                    <button
                            className="px-5 py-1.5 mt-3 text-sm outline_btn rounded-full text-white"
                            type='submit'
                            onClick={generateResponse}
                          >
                            Summarize
                    </button>
                  </div>
              </form>

            <div 
                htmlFor=""
                className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism p-10'
                >
                  <div >
                        <div>
                        {isLoading ? (
                          <div className='form_input'>Waiting for response ...</div>
                        ) : (
                          <div className='form_input'>
                                {response}
                          </div>
                        )}
                      </div>
                  </div>
            </div>
              
    </section>
  )

}

export default Home
