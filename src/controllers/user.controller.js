import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import {User} from "../models/user.models.js";


const generateAccessAndRefreshToken = async (userId) => {
  try{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateAccessToken();
  } catch(error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const {fullName, userName, email, password} = req.body;
  if([fullName, userName, email, password].some((filed) => filed?.trim() === '')) {
    throw new ApiError(400, 'All filed are required')
  }


   const existedUser = await User.findOne({
    $or: [{userName}, {email}]
   })

 if(existedUser) {
  throw new ApiError(409, 'User with email or username already exist')
 }

 const avatarLocalPath = req?.files?.avatar[0]?.path;
//  const coverImageLocalPath = req?.files?.coverImage[0]?.path;

let coverImageLocalPath;
 if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  coverImageLocalPath = req?.files?.coverImage[0]?.path;
 }



 console.log(req.files);

 if(!avatarLocalPath) {
  throw new ApiError('400', "avatar image is required");
}

 const avatar = await uploadOnCloudinary(avatarLocalPath);
 const coverImage = await uploadOnCloudinary(coverImageLocalPath);

 if(!avatar) {
  throw new ApiError('400', 'avatar image is required');
 }
 
 const user = await User.create({
  fullName,
  userName: userName.toLowerCase(),
  email,
  avatar: avatar?.url,
  coverImage: coverImage?.url || "",
  password
 });

 const createdUser = await User.findById(user._id).select("-password -refreshToken");

 if(!createdUser) {
  throw new ApiError(500, "something went wrong while registering the user")
 }

 return res.status(201).json(
  new ApiResponse(200, createdUser, "user register successfully")
 )

});

const loginUser = asyncHandler(async (req, res) => {
  const {userName, email, password, } = req.body;

  if(!userName || !email) {
    throw new ApiError(400, "username or password is required")
  }

  const user = await User.findOne({
    $or: [{email}, {userName}]
  });

  if(!user) {
    throw new ApiError(401, "invalid user credentials");
  }


  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid) {
    throw new ApiError(404, "Password is not match ")
  }

});



export { registerUser, loginUser};
