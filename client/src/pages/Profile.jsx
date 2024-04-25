import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { app } from "../firebase.js";
import {
  ref,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import {useDispatch} from 'react-redux';
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings,setUserListings] = useState([])

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleDeleteUser = async()=>{
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method : 'DELETE',
      })
      const data = await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message));
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async()=>{
    try {
      dispatch(signoutUserStart());
      const res=await fetch("/api/auth/signout")
      const data=await res.json();
      if(data.success===false){
        dispatch(signoutUserFailure(data.message))
        return
      }
      dispatch(signoutUserSuccess(data))
    } catch (error) {
      dispatch(signoutUserFailure(data.message))
    }
  }
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profile_pic: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    console.log("--->",e.target.id)
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(formData)
      }) ;
      const data = await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  };

  const handleShowListings = async()=>{
    try {
      setShowListingsError(false)
      const res=await fetch(`/api/user/listings/${currentUser._id}`);
      const data =await res.json();
      if(data.success===false){
        setShowListingsError(true);
        return
      }
      
    } catch (error) {
      setShowListingsError(true)
    }

  }
  return (
    <div className="p-3 gap-2 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
        defaultValue={currentUser.profile_pic}
          onClick={() => fileRef.current.click()}
          src={formData.profile_pic || currentUser.profile_pic}
          alt="Profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error in uploading Image (Image should be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-green-700">{`Uploading.. ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">
              Image Successfully Uploaded !{" "}
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          id="username"
          type="text"
          onChange={handleChange}
          placeholder="username"
          className="border p-3 rounded-lg"
        />
        <input
          onChange={handleChange}
          id="email"
          defaultValue={currentUser.email}
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          onChange={handleChange}
          id="password"
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'update'}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 " to={"/create-listing"}>Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete Account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>Signout</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700"> {updateSuccess ? 'User is updated' : '' }</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingsError?'Error showing listings':''}</p>
      {userListings && userListings.length>0 && 
      <div className="flex flex-col gap-4"> 
        <h1 className="text-center mt-7 text-2xl font-semibold">Listings</h1>
        {userListings.map((listing)=>(
          <div className="border rounded-lg p-3 flex justify-between items-center gap-4" key={listing._id}>
            <Link to={`/listings/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="Listing Cover" className="h-16 w-16 object-contain"/>
            </Link>
            <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listings/${listing._id}`}>
              <p >{listing.name}</p>
            </Link>
            <div className="flex flex-col item-center">
            <button className="text-red-700">Delete</button>
            <button className="text-green-700">Edit</button>
            </div>
            </div>
      ))}
        </div>}
    </div>
  );
}

export default Profile;
