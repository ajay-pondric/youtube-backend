import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const {fullName, userName, email, password} = req.body;
  if([fullName, userName, email, password].some((filed) => filed?.trim() === '')) {
    throw new ApiError(400, 'All filed are required')
  }


   const existedUser = user.findOne({
    $or: [{userName}, {email}]
   })

 if(existedUser) {
  throw new ApiError(409, 'User with email or username already exist')
 }

 const avatarLocalPath = req?.files?.avatar[0]?.path;
 const coverImageLocalPath = req?.files?.coverImage?.path;

 if(!avatarLocalPath) {
  throw new ApiError('400', "avatar image is required");
}

 const avatar = await uploadOnCloudinary(avatarLocalPath);
 const coverImage = await uploadOnCloudinary(coverImageLocalPath);

 if(!avatar) {
  throw new ApiError('400', 'avatar image is required');
 }
 
 const user = await user.create({
  fullName,
  userName: userName.toLowerCase(),
  email,
  avatar: avatar?.url,
  coverImage: coverImage?.url || "",
  password
 });

 const createdUser = await user.findById(user._id).select("-password -refreshToken");

 if(!createdUser) {
  throw new ApiError(500, "something went wrong while registering the user")
 }

});



export default registerUser;
