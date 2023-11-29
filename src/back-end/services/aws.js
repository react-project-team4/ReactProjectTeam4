import AWS, { S3 } from "aws-sdk";
/* global resolve reject */

const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_REGION;
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
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

export const deleteImageFromS3 = (imageUrl) => {
  const key = imageUrl.split(`https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/`)[1];

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
  };

  return new Promise((resolve, reject) => {
    myBucket.deleteObject(params, (err, data) => {
      if (err) {
        console.log("Error deleting image from S3", err);
        reject(err);
      } else {
        console.log("Image delete from S3", data);
        resolve(data);
      }
    })
  })


}