const { response } = require("../utils");
const { httpsStatusCodes, serverResponseMessage,globalConstants } = require("../constants");

exports.createMessage = async (req, res) => {
    try {
     const {  text } = req.body;
  const userId = req.userId;
  const { Message, Activity } = req.models;
  const message = await Message.create({ userId, text });
  // Also track activity
  await Activity.create({ userId, type: globalConstants.enumActivity.MessageSent , description: serverResponseMessage.MESSAGE_SENT });
  return response.success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.MESSAGE_CREATED,
      message
    );
    

    } catch (error) {
    return response.failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
    }
}