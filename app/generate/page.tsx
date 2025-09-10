'use client';

import React, { ChangeEvent, useState } from 'react';

export default function GeneratePage() {
    const [prompt,setPrompt] = useState<string>('');
    const [generatedCode,setGeneratedCode] = useState<string>('');

    const generateCode = async () => {
        try {
            
            const res = await fetch('/api/ai-generator',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt}),
            });

            if (!res.ok)
                throw new Error("Failed to generate code : "+ res.statusText);

            const data:{code:string} = await res.json();
            setGeneratedCode(data.code);

        } catch (error) {
            console.error("Error generating code:", error);
            setGeneratedCode("Error generating code. Please try again.");
        };

        
    }

    const onPromptChange = (e: ChangeEvent<HTMLTextAreaElement>)=>{
        setPrompt(e.target.value);
    };

    return(
        <div>
            <h1>Generate AI  Code</h1>
            <textarea 
             rows={4}
             value={prompt}
             onChange={onPromptChange}
             placeholder='Enter your prompt here...'
             style={{width: '100%'}}
            >
            </textarea>
            <button onClick={generateCode}>Generate</button>


            {
                generatedCode && (
                    <div style={{marginTop: '20px'}}>
                        <h2>Generated Code Preview:</h2>
                        <pre style={{backgroundColor: '#eee',padding: '10px', whiteSpace:'pre-wrap'}} >{generatedCode}</pre>

                        {/* Link to preview page and code to edit */}
                         <a href={`/generate/preview?code=${encodeURIComponent(generatedCode)}`}>Preview</a>

                    </div>
                )
            }


        </div>
    )

}