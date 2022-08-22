import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as APIGateway from "aws-cdk-lib/aws-apigateway";
import * as Lambda from "aws-cdk-lib/aws-lambda";
import * as Path from "path";

export class AwsCdkLearnStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // This one is for defining an API for APIGateway.

    const userAPI = new APIGateway.RestApi(this, "UserAPI", {
      description: "This API is responsible to fetch the users information",
      deployOptions: {
        stageName: "development", // This can come from an environment variable
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["GET", "POST", "DELETE", "PATCH"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"], // This can also come from an environment variables.
      },
    });

    new cdk.CfnOutput(this, "UserAPIURL", { value: userAPI.url });

    // Declare the Lambda for the above API Gateway created.

    const getUserLambda = new Lambda.Function(this, "get-user-lambda", {
      runtime: Lambda.Runtime.NODEJS_16_X,
      handler: "index.user",
      code: Lambda.Code.fromAsset(Path.join(__dirname, "../src/lambdas/user")),
    });

    // add a ToDo resource.

    const users = userAPI.root.addResource("users");

    // Add a GET method
    users.addMethod(
      "GET",
      new APIGateway.LambdaIntegration(getUserLambda, { proxy: true }),
    );

    // Get one ToDo

    const getUserById = new Lambda.Function(this, "get-one-user-lambda", {
      runtime: Lambda.Runtime.NODEJS_16_X,
      handler: "index.userById",
      code: Lambda.Code.fromAsset(
        Path.join(__dirname, "../src/lambdas/userById"),
      ),
    });

    const getUser = users.addResource("{userId}");

    getUser.addMethod("GET", new APIGateway.LambdaIntegration(getUserById));
  }
}
