import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

const dummyUrls = [
  {
    _id:"1",
    originalUrl:"https://www.amazon.com/SAMSUNG-Android-Durability-Included-Moonstone/dp/B0D851Z6NQ/ref=sr_1_3?_encoding=UTF8&content-id=amzn1.sym.a64ac9fc-2717-4051-ae96-b2a9a2a6b039&dib=eyJ2IjoiMSJ9.N15R0K0fgf3FqJmznjUNERL6jw9JZ3VgS6K31Nb9VDK7W1RJ0Q8h2lJfHYxoaVLn1_Xur16qWFQvUCX1wLTeci1onZ6xyXtQMY-byYJ3MzsCBjUw7UuHOox_VaiiZ5DecVSoo8WX7KFAtgrAtjpQfLrY9sKYuX-n2231A6b-P6IhRBB2xJbRrryq_O2CFK5siCSjTJijExp1qioWnRw4nNp985Of8TGlgMkxNRwoZBs.xLUw5FHVNOqiFBP19SdmCDk0HrQqSCCjj_cljEK1mXs&dib_tag=se&keywords=electronics%2Btablets&pd_rd_r=a7687d42-35cf-40ce-aa70-eaa222ec8f88&pd_rd_w=GtG86&pd_rd_wg=B1Szo&qid=1791634938&sr=8-3&th=1",
    shortCode:"IUFSD",
    clicks:9
  },
    {
    _id:"2",
    originalUrl:"https://www.amazon.com/SAMSUNG-Android-Durability-Included-Moonstone/dp/B0D851Z6NQ/ref=sr_1_3?_encoding=UTF8&content-id=amzn1.sym.a64ac9fc-2717-4051-ae96-b2a9a2a6b039&dib=eyJ2IjoiMSJ9.N15R0K0fgf3FqJmznjUNERL6jw9JZ3VgS6K31Nb9VDK7W1RJ0Q8h2lJfHYxoaVLn1_Xur16qWFQvUCX1wLTeci1onZ6xyXtQMY-byYJ3MzsCBjUw7UuHOox_VaiiZ5DecVSoo8WX7KFAtgrAtjpQfLrY9sKYuX-n2231A6b-P6IhRBB2xJbRrryq_O2CFK5siCSjTJijExp1qioWnRw4nNp985Of8TGlgMkxNRwoZBs.xLUw5FHVNOqiFBP19SdmCDk0HrQqSCCjj_cljEK1mXs&dib_tag=se&keywords=electronics%2Btablets&pd_rd_r=a7687d42-35cf-40ce-aa70-eaa222ec8f88&pd_rd_w=GtG86&pd_rd_wg=B1Szo&qid=1791634938&sr=8-3&th=1",
    shortCode:"IUFSD",
    clicks:5
  },
    {
    _id:"3",
    originalUrl:"https://www.amazon.com/SAMSUNG-Android-Durability-Included-Moonstone/dp/B0D851Z6NQ/ref=sr_1_3?_encoding=UTF8&content-id=amzn1.sym.a64ac9fc-2717-4051-ae96-b2a9a2a6b039&dib=eyJ2IjoiMSJ9.N15R0K0fgf3FqJmznjUNERL6jw9JZ3VgS6K31Nb9VDK7W1RJ0Q8h2lJfHYxoaVLn1_Xur16qWFQvUCX1wLTeci1onZ6xyXtQMY-byYJ3MzsCBjUw7UuHOox_VaiiZ5DecVSoo8WX7KFAtgrAtjpQfLrY9sKYuX-n2231A6b-P6IhRBB2xJbRrryq_O2CFK5siCSjTJijExp1qioWnRw4nNp985Of8TGlgMkxNRwoZBs.xLUw5FHVNOqiFBP19SdmCDk0HrQqSCCjj_cljEK1mXs&dib_tag=se&keywords=electronics%2Btablets&pd_rd_r=a7687d42-35cf-40ce-aa70-eaa222ec8f88&pd_rd_w=GtG86&pd_rd_wg=B1Szo&qid=1791634938&sr=8-3&th=1",
    shortCode:"IUFSD",
    clicks:6
  },
]

function App() {

  const [urls, setUrls] = useState(dummyUrls);
  const [inputValue, setInputValue] = useState("");
  const [currentUrl, setCurrentUrl] = useState(null);


  async function fetchUrls() {

    const response = await axios.get("http://localhost:5173/api/url");

    const responseData = response.data

    setUrls(responseData.data.urls);

  }

  
  async function createShortUrl() {
    const response = await axios.post("http://localhost:5173/api/url",{
      url: inputValue
    })

    setCurrentUrl({
      originalUrl:response.data.data.originalUrl,
      shortCode: response.data.data.shortCode
    }) 

    fetchUrls();

  }


  async function deleteUrl(id) {
    await axios.delete(`http://localhost:5173/api/url/${id}`);

    fetchUrls();
  }

//count get updated in frontend 
  useEffect(() => {
  fetchUrls();
  
  const interval = setInterval(() => {
    fetchUrls();
    }, 2000);

  return () => clearInterval(interval);
  }, []);



async function copyUrl(shortCode) {
  const shortUrl = `http://localhost:3000/${shortCode}`;

  try {
    await navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied successfully!");
  } catch (error) {
    console.error("Failed to copy URL:", error);
  }
}



  useEffect(() => {
    fetchUrls();
  }, [])

  
  

  return (
   <main className='p-10 flex flex-col gap-4'>

    <div className='w-full max-w-4xl p-2 flex gap-2'>
      <input
      placeholder='Enter long Url'
      className='border rounded w-full p-2'
      type='text'
      value={inputValue}
      onChange={(e)=>{setInputValue(e.target.value)}}
      />
      <button
      className='rounded p-2 bg-orange-600 text-white cursor-pointer'
      onClick={createShortUrl}
      >Shorten</button>
    </div>

    <div className='w-full max-w-4xl p-2'></div>

    <div className=' w-full max-w-4xl p-2 flex flex-col gap-2'>
      {
        urls.map(url=>{
          return (
            <div className='border border-neutral-200 p-2 flex justify-evenly gap-9 items-center '>
              <a href={`http://localhost:3000/${url.shortCode}`} target='_blank'>{url.shortCode}</a>
              <p className='truncate' >{url.originalUrl}</p>
              <p>{url.clicks}</p>
              <div className='flex gap-5 '>
                <button onClick={()=>copyUrl(url.shortCode)}
                 className='cursor-pointer p-2 rounded bg-orange-500 '>Copy</button>
                <button onClick={()=>deleteUrl(url._id)}
                className='cursor-pointer p-2 rounded bg-red-500 '>Delete</button>
              </div>
            </div>
          )
        })
      }
    </div>
   </main>
  )
}

export default App
