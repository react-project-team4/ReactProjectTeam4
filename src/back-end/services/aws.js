import AWS from "aws-sdk";
/* global resolve reject */

const ACCESS_KEY = "AKIA6JJJK6QXAEEE3TZX";
const SECRET_ACCESS_KEY = "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";
const REGION = "ap-northeast-2";
const S3_BUCKET = "myreactproject04";
const FOLDER_NAME = "Images";

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export const uploadImageFile = (image, setImage) => {
  return new Promise((resolve, reject) => {
    const params = {
      ACL: "public-read",
      Body: image,
      Bucket: S3_BUCKET,
      Key: FOLDER_NAME + "/" + image.name,
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setTimeout(() => {
          setImage(null);
        }, 3000);
      })
      .send((err) => {
        if (err) {
          console.log("image upload error", err);
          reject(err); // 이미지 업로드 실패 시 reject
        } else {
          const imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${FOLDER_NAME}/${image.name}`;
          resolve(imageUrl); // 이미지 업로드 성공 시 resolve
        }
      });
  });
};
