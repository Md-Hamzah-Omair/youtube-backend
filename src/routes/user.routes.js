import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateAccountDetails,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verfiyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/change-password").post(verfiyJWT, changeCurrentPassword);
router.route("/current-user").post(verfiyJWT, getCurrentUser);
router.route("/update-account").patch(verfiyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verfiyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/coverImage")
  .patch(verfiyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verfiyJWT,getUserChannelProfile)
router.route("/history").get(verfiyJWT,getWatchHistory)

export default router;
