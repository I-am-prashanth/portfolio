import React, { useState } from 'react'
import "./chat.css"

function ChatBot() {
  const[response,setresonse]=useState<String>("hello, if you want to know more ask here")
  const[imgtype,setimgtype]=useState<String>("hi")
  const[question,setquestion]=useState<string>("")

  

  const makeLinksClickable = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url: string) =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${url}</a>`
  );
};
  const handelsubmit=async()=>{
    setimgtype("thinking")
    setresonse("thinking...")
    // console.log(question)
    try{
        const res = await fetch("http://localhost:5006/webhooks/rest/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "user",       // or user ID
          message: question,    // your user input
        }),
      });
      const data = await res.json();
      // console.log(data[1])
      const img = data[1]?.image ?? "cool1"; 
      setimgtype(img)
      
      
      const botText = data
  .map((m: { text?: string }) => m.text || "")
  .join("\n\n");
      // setimgtype("low1")
      console.log(botText)
      setresonse(makeLinksClickable(botText));
      
    }
    catch(e){
      console.log(e)
      setimgtype("damn")
      setresonse("sorry!... some error occured in backend / please check your internet connection")
    }
    
  }
  return (
    <div className='box'>
      <form 
      onSubmit={(e)=>{
        e.preventDefault();
        handelsubmit()
      }}>
      <input type='text' placeholder='ask any question about myself' className='input_question' value={question} onChange={
        (e)=>{setquestion(e.target.value)}}></input>
      <div className='response'>
    <img src={`/${imgtype}.webp`} className='avatar'/>  
    

    <div className='answer' dangerouslySetInnerHTML={{ __html: response }} />
    </div>
    </form>
    </div>
  )
}

export default ChatBot
