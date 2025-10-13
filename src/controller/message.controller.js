require('dotenv').config({ quiet: true });
const { response } = require("../utils");
const { httpsStatusCodes, serverResponseMessage, globalConstants } = require("../constants");
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');

// Your Azure Storage connection string
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
// Your container name for media
const CONTAINER_NAME = "media";

function getMimeTypeFromBase64(base64String) {
  const result = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/.exec(base64String);
  return result ? result[1] : null;
}

function getFileExtension(mimeType) {
  const {map} = globalConstants
  return map[mimeType] || null;
}

exports.createMessage = async (req, res) => {
  try {
    const { text, fileUrl } = req.body;
    const userId = req.userId;
    const { name, upn } = req.user;
    const { Message, Activity } = req.models;

    let mediaUrl = null;
    if (fileUrl) {
      // Validate file type
      const mimeType = getMimeTypeFromBase64(fileUrl);
      const allowedMimeTypes = globalConstants.allowedFileTypes;
      if (!allowedMimeTypes.includes(mimeType)) {
        return response.failure(
          res,
          httpsStatusCodes.BAD_REQUEST,
          serverResponseMessage.IMAGES_VIDEOS_ONLY,
          []
        );
      }

      // Convert base64 to buffer
      const base64Data = fileUrl.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');

      // Prepare blob info
      const extension = getFileExtension(mimeType);
      const fileName = `${userId}_${Date.now()}.${extension}`;

      // Upload to Azure Blob Storage
      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
      const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await containerClient.createIfNotExists();
      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: mimeType }
      });

      mediaUrl = blockBlobClient.url;
    }
    console.log("Media URL:", mediaUrl);

    const message = await Message.create({
      userId,
      text,
      userName: name,
      userEmail: upn,
      fileUrl:mediaUrl // Save media URL if uploaded
    });

    await Activity.create({
      userId,
      type: globalConstants.enumActivity.MessageSent,
      description: serverResponseMessage.MESSAGE_CREATED,
      userName: name,
      userEmail: upn
    });
    

    return response.success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.MESSAGE_CREATED,
      message
    );
  } catch (error) {
    console.error(error);
    return response.failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};