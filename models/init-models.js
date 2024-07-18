var DataTypes = require("sequelize").DataTypes;
var _COMMON = require("./COMMON");
var _CONTRIBUTION_INFO = require("./CONTRIBUTION_INFO");
var _DEAL_INFO = require("./DEAL_INFO");
var _DELEGATE_INFO = require("./DELEGATE_INFO");
var _KOHORT_INFO = require("./KOHORT_INFO");
var _KOHORT_MEMBERS = require("./KOHORT_MEMBERS");
var _KOMMITTEE_INFO = require("./KOMMITTEE_INFO");
var _PROJECT_INFO = require("./PROJECT_INFO");
var _PROPOSAL_INFO = require("./PROPOSAL_INFO");
var _USER_CONTRIBUTION = require("./USER_CONTRIBUTION");
var _USER_DEAL_INTEREST = require("./USER_DEAL_INTEREST");
var _USER_INFO = require("./USER_INFO");
var _USER_PROPOSAL = require("./USER_PROPOSAL");
var _USER_RATING = require("./USER_RATING");
var _WATCHLIST_INFO = require("./WATCHLIST_INFO");

function initModels(sequelize) {
  var COMMON = _COMMON(sequelize, DataTypes);
  var CONTRIBUTION_INFO = _CONTRIBUTION_INFO(sequelize, DataTypes);
  var DEAL_INFO = _DEAL_INFO(sequelize, DataTypes);
  var DELEGATE_INFO = _DELEGATE_INFO(sequelize, DataTypes);
  var KOHORT_INFO = _KOHORT_INFO(sequelize, DataTypes);
  var KOHORT_MEMBERS = _KOHORT_MEMBERS(sequelize, DataTypes);
  var KOMMITTEE_INFO = _KOMMITTEE_INFO(sequelize, DataTypes);
  var PROJECT_INFO = _PROJECT_INFO(sequelize, DataTypes);
  var PROPOSAL_INFO = _PROPOSAL_INFO(sequelize, DataTypes);
  var USER_CONTRIBUTION = _USER_CONTRIBUTION(sequelize, DataTypes);
  var USER_DEAL_INTEREST = _USER_DEAL_INTEREST(sequelize, DataTypes);
  var USER_INFO = _USER_INFO(sequelize, DataTypes);
  var USER_PROPOSAL = _USER_PROPOSAL(sequelize, DataTypes);
  var USER_RATING = _USER_RATING(sequelize, DataTypes);
  var WATCHLIST_INFO = _WATCHLIST_INFO(sequelize, DataTypes);

  USER_CONTRIBUTION.belongsTo(CONTRIBUTION_INFO, { as: "cont", foreignKey: "cont_id"});
  CONTRIBUTION_INFO.hasOne(USER_CONTRIBUTION, { as: "USER_CONTRIBUTION", foreignKey: "cont_id"});
  KOHORT_INFO.belongsTo(KOHORT_MEMBERS, { as: "kohort", foreignKey: "kohort_id"});
  KOHORT_MEMBERS.hasOne(KOHORT_INFO, { as: "KOHORT_INFO", foreignKey: "kohort_id"});
  CONTRIBUTION_INFO.belongsTo(PROJECT_INFO, { as: "pjt", foreignKey: "pjt_id"});
  PROJECT_INFO.hasMany(CONTRIBUTION_INFO, { as: "CONTRIBUTION_INFOs", foreignKey: "pjt_id"});
  DEAL_INFO.belongsTo(PROJECT_INFO, { as: "pjt", foreignKey: "pjt_id"});
  PROJECT_INFO.hasMany(DEAL_INFO, { as: "DEAL_INFOs", foreignKey: "pjt_id"});
  WATCHLIST_INFO.belongsTo(PROJECT_INFO, { as: "pjt", foreignKey: "pjt_id"});
  PROJECT_INFO.hasMany(WATCHLIST_INFO, { as: "WATCHLIST_INFOs", foreignKey: "pjt_id"});
  CONTRIBUTION_INFO.belongsTo(USER_CONTRIBUTION, { as: "ms_1", foreignKey: "ms_1_id"});
  USER_CONTRIBUTION.hasMany(CONTRIBUTION_INFO, { as: "CONTRIBUTION_INFOs", foreignKey: "ms_1_id"});
  CONTRIBUTION_INFO.belongsTo(USER_CONTRIBUTION, { as: "ms_2", foreignKey: "ms_2_id"});
  USER_CONTRIBUTION.hasMany(CONTRIBUTION_INFO, { as: "ms_2_CONTRIBUTION_INFOs", foreignKey: "ms_2_id"});
  CONTRIBUTION_INFO.belongsTo(USER_CONTRIBUTION, { as: "ms_3", foreignKey: "ms_3_id"});
  USER_CONTRIBUTION.hasMany(CONTRIBUTION_INFO, { as: "ms_3_CONTRIBUTION_INFOs", foreignKey: "ms_3_id"});
  DEAL_INFO.belongsTo(USER_DEAL_INTEREST, { as: "deal", foreignKey: "deal_id"});
  USER_DEAL_INTEREST.hasOne(DEAL_INFO, { as: "DEAL_INFO", foreignKey: "deal_id"});
  DELEGATE_INFO.belongsTo(USER_INFO, { as: "delegate_from_USER_INFO", foreignKey: "delegate_from"});
  USER_INFO.hasMany(DELEGATE_INFO, { as: "DELEGATE_INFOs", foreignKey: "delegate_from"});
  DELEGATE_INFO.belongsTo(USER_INFO, { as: "delegate_to_USER_INFO", foreignKey: "delegate_to"});
  USER_INFO.hasMany(DELEGATE_INFO, { as: "delegate_to_DELEGATE_INFOs", foreignKey: "delegate_to"});
  KOHORT_INFO.belongsTo(USER_INFO, { as: "leader_user", foreignKey: "leader_user_id"});
  USER_INFO.hasMany(KOHORT_INFO, { as: "KOHORT_INFOs", foreignKey: "leader_user_id"});
  KOMMITTEE_INFO.belongsTo(USER_INFO, { as: "user", foreignKey: "user_id"});
  USER_INFO.hasMany(KOMMITTEE_INFO, { as: "KOMMITTEE_INFOs", foreignKey: "user_id"});
  PROPOSAL_INFO.belongsTo(USER_INFO, { as: "create_user", foreignKey: "create_user_id"});
  USER_INFO.hasMany(PROPOSAL_INFO, { as: "PROPOSAL_INFOs", foreignKey: "create_user_id"});
  USER_CONTRIBUTION.belongsTo(USER_INFO, { as: "user", foreignKey: "user_id"});
  USER_INFO.hasOne(USER_CONTRIBUTION, { as: "USER_CONTRIBUTION", foreignKey: "user_id"});
  PROPOSAL_INFO.belongsTo(USER_PROPOSAL, { as: "prop", foreignKey: "prop_id"});
  USER_PROPOSAL.hasOne(PROPOSAL_INFO, { as: "PROPOSAL_INFO", foreignKey: "prop_id"});
  USER_INFO.belongsTo(USER_PROPOSAL, { as: "user", foreignKey: "user_id"});
  USER_PROPOSAL.hasOne(USER_INFO, { as: "USER_INFO", foreignKey: "user_id"});
  PROJECT_INFO.belongsTo(USER_RATING, { as: "pjt", foreignKey: "pjt_id"});
  USER_RATING.hasOne(PROJECT_INFO, { as: "PROJECT_INFO", foreignKey: "pjt_id"});

  return {
    COMMON,
    CONTRIBUTION_INFO,
    DEAL_INFO,
    DELEGATE_INFO,
    KOHORT_INFO,
    KOHORT_MEMBERS,
    KOMMITTEE_INFO,
    PROJECT_INFO,
    PROPOSAL_INFO,
    USER_CONTRIBUTION,
    USER_DEAL_INTEREST,
    USER_INFO,
    USER_PROPOSAL,
    USER_RATING,
    WATCHLIST_INFO,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
