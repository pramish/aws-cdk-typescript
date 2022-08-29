import { DynamoDB } from "aws-sdk";

export const user = async () => {
  const params = {
    TableName: "users-catalog",
  };

  const dynamoDB = new DynamoDB.DocumentClient();

  const data = await dynamoDB.scan(params).promise();

  if (!data.Items) {
    return {
      body: JSON.stringify([]),
      statusCode: 500,
    };
  }

  // return fileName(a) have this inside the util or common folder.

  return {
    body: JSON.stringify(data.Items),
    statusCode: 200,
  };
};
