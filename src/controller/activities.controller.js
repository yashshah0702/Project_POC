const { response } = require("../utils");
const { httpsStatusCodes, serverResponseMessage,globalConstants } = require("../constants");

exports.loginActivity = async (req, res) => {
    try {
  const userId = req.userId;
  const { Activity } = req.models;
  // Also track activity
  const activities = await Activity.create({ userId, type: globalConstants.enumActivity.Login , description: serverResponseMessage.ACTIVITY_LOGGED_IN , userName: req.user.name, userEmail: req.user.upn });

  return response.success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.ACTIVITY_LOGGED_IN,
      activities
    );
    
    } catch (error) {
    return response.failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
    }
}

exports.logoutActivity = async (req, res) => {

    try {
        const userId = req.userId;
  const { Activity } = req.models;
  // Also track activity
  const activities = await Activity.create({ userId, type: globalConstants.enumActivity.Logout , description: serverResponseMessage.ACTIVITY_LOGGED_OUT , userName: req.user.name, userEmail: req.user.upn });
  return response.success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.ACTIVITY_LOGGED_OUT,
      activities
    );
    } catch (error) {
    return response.failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
    }
}