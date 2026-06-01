import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiRespone } from '../utils/ApiResponse.js'
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, password, email } = req.body;
  console.log("email:", email);

  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "This username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload an Avatar");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Please upload an Avatar");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await user
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiRespone(200,  createdUser, "User Registered Successfully!")
  )
});

export { registerUser };

//first get the details of the user through a form in frontend -- done
//process the details of the user -- done
// collect username,email,password,fullname, avatar -- done
// check if the username,email,password are valid min chars, unique,actaully a mail etc -- done
// check if the user already exists in a database if yes prompt them to log in instead -- done

//if user is actually valid and new then begin the registration process
// check for images and check for avtar if available then upload to cloud -- done
// create a user object and put them in the database == done
// check if user is successfully created -- done
// if user is successfully created then return a response without password and refresh token -- done

// redirect the user to home page to continue their session as logged in
//if the user is not new then log them in
// check if the user actually exists
// compare username or email and password to the one in the database
// if match then log them in and provide them with a session token so that they can freely visit log in exlucsive pages as themselves
// else throw them a mismatch error
