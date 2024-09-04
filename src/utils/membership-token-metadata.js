const { USER_MEMBERSHIP } = require("../../models/index");

async function getTokenMetadata(token_id) {
  try {
    const token = await USER_MEMBERSHIP.findOne({
      raw: true,
      where: { token_id },
    });
    const metadata = {
      name: token.name,
      description: token.description,
      image: token.image_url,
      animation_url: token.animation_url,
    };
    return metadata;
  } catch (err) {
    throw Error(err);
  }
}

module.exports = { getTokenMetadata };
