const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("./s3");

async function deleteFromS3(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  };

  await s3.send(new DeleteObjectCommand(params));
}

module.exports = deleteFromS3;
