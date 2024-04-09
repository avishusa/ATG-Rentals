import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { useRef } from 'react'
import {app} from '../firebase.js';
import {ref, getStorage, getDownloadURL, uploadBytesResumable} from 'firebase/storage'

function Profile() {
  const {currentUser} = useSelector((state)=>state.user)
  const fileRef =useRef(null);
  const [file,setFile]=useState(undefined)
  const [filePerc,setFilePerc]=useState(0)
  const [fileUploadError,setFileUploadError] =useState(false)
  const [formData,setFormData]=useState({});

  

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',(snapshot)=>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes) *100;
      setFilePerc(Math.round(progress))
    },
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>{
          setFormData({...formData,profile_pic:downloadURL})
      })
    })
  }
  return (
    <div className='p-3 gap-2 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
        <img onClick={()=>fileRef.current.click()} src={formData.profile_pic || currentUser.profile_pic} alt='Profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
       <p className='text-sm self-center'>
        {fileUploadError? (<span className='text-red-700'>Error in uploading Image (Image should be less than 2 MB)</span>) : (filePerc>0 && filePerc<100 ? (
          <span className='text-green-700'>{`Uploading.. ${filePerc}%`}</span>) : (filePerc===100?(<span className='text-green-700'>Image Successfully Uploaded</span>): "")
        )}
        </p>
        <input id='username' type='text' placeholder='username' className='border p-3 rounded-lg' />
        <input id='email' type='text' placeholder='email' className='border p-3 rounded-lg' />
        <input id='password' type='text' placeholder='password' className='border p-3 rounded-lg' />
      <button className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Signout</span>

      </div>
      </div>
  )
}

export default Profile