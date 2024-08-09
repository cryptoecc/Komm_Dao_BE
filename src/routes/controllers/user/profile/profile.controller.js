const { UserInfo } = require("../../../../../models");
const path = require("path");
const fs = require("fs");

// 프로필 정보 가져오기 컨트롤러
const getProfile = async (req, res) => {
  const { walletAddress } = req.params;

  console.log("Received request for wallet address:", walletAddress);

  try {
    const user = await UserInfo.findOne({
      where: { wallet_addr: walletAddress },
    });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.user_name,
      email: user.email_addr,
      walletAddress: user.wallet_addr,
      bio: user.bio,
      expertise: user.expertise,
      membershipNft: user.membership_nft,
      stayUpdated: user.stay_updated === "Y",
      profileImage: user.user_image_link,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 프로필 업데이트 컨트롤러
const updateProfile = async (req, res) => {
  const { walletAddress } = req.params;
  const { name, email, bio, expertise, membershipNft, stayUpdated } = req.body;

  console.log("Received update request for wallet address:", walletAddress);

  try {
    const user = await UserInfo.findOne({
      where: { wallet_addr: walletAddress },
    });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    let profileImageUrl = user.user_image_link;
    if (req.file) {
      // 기존 이미지 삭제
      if (profileImageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "../../../../assets/uploads",
          path.basename(profileImageUrl)
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old profile image:", err);
          } else {
            console.log("Old profile image deleted:", oldImagePath);
          }
        });
      }
      profileImageUrl = `uploads/${req.file.filename}`;
    }

    await UserInfo.update(
      {
        user_name: name,
        email_addr: email,
        bio: bio,
        expertise: expertise,
        user_image_link: profileImageUrl,
        membership_nft: membershipNft,
        stay_updated: stayUpdated === "Y" ? "Y" : "N",
      },
      {
        where: { wallet_addr: walletAddress },
      }
    );

    res.json({
      message: "Profile updated successfully",
      profileImage: profileImageUrl,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
