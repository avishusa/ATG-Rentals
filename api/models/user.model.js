import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        unique : true,
    },

    email : {
        type : String,
        required : true,
        unique : true,
    },

    password : {
        type : String,
        required : true,
    },
    profile_pic : {
        type : String,
        default :"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fprofile-picture&psig=AOvVaw2P9w-3TidXgmQ57M8Isdaf&ust=1712636863424000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMjy69PjsYUDFQAAAAAdAAAAABAJ.png"
    }

}, {timestamps: true});

const User = mongoose.model('User',userSchema);

export default User;