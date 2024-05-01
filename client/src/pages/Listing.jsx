import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function Listing() {
    const params = useParams();
    const [lisitng,setListing]= useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError]=useState(false);
    useEffect(()=>{

        const fetchListing = async()=>{
        try {
            setLoading(true)
            const res = await fetch(`/api/listing/get/${params.listingId}`)
            const data = await res.json();
            if(data.success===false){
                setError(true)
                setLoading(false)
                return;
            }
            setListing(data)
            setLoading(false)
        } catch (error) {
            setError(true)
            setLoading(false)
        }
        }
        fetchListing()
    },[params.listingId])
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading..</p>}
        {error && <p className='text-center my-7 text-2xl'>Something Went Wrong</p>}
    </main>
  )
}

export default Listing
