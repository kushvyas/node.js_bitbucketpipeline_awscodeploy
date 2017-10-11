# Deploy Node.js Code From Bitbucket Using AWS CodeDeploy

Atlassian Bitbucket support for AWS CodeDeploy, so you can now push code to Amazon EC2 instances directly from the Bitbucket UI. This is a great example of simplifying deployments, especially if you prefer “a-human-presses-a-button” control over your deployments. Next Step We will Automate this with BitBucket Pipelines so that No push of button is required.

## Getting Started

These instructions will get you a to deploy given sample Node.js Code Hello World that will run on **Port 3000** file on your ec2 Instance from directly bitbucket with push of a button.

In Next Step (below) we will set up trigger to deploy as soon as code is pused to a given branch.(In Our Case master)

### Prerequisites

1) AWS Account, You can [Create free account](https://aws.amazon.com/)

2) BitBucket Account

3) We’ll need a sample Node.js application in Bitbucket. Included in Repository.

### Set Up BitBucket

Install the [CodeDeploy add-on](https://marketplace.atlassian.com/plugins/bitbucket-aws-codedeploy/cloud/overview) through the Settings menu in Bitbucket. Then, under your repository, choose CodeDeploy Settings to configure CodeDeploy.

Bitbucket needs the ability to stage your code artifacts in an Amazon S3 bucket for CodeDeploy to pull, so step one of this setup process is to create an AWS Identity and Access Management (IAM) role with the following policy:

`{"Version": "2012-10-17","Statement": [{"Effect": "Allow","Action":
["s3:ListAllMyBuckets","s3:PutObject"],"Resource":
"arn:aws:s3:::*"},{"Effect": "Allow","Action":
["codedeploy:*"],"Resource": "*"}]}`

The setup will ask for the ARN of the IAM role so Atlassian can assume a role in your account, push code to your S3 bucket on your behalf, and do a deployment using CodeDeploy.

Once you’ve provided the role ARN, you’ll also be able to tell Bitbucket which S3 bucket to use for storing deployment artifacts and which CodeDeploy application to deploy to.

### Set Up AWS CodeDeploy 

Step one is to make sure you have an EC2 instance running the [CodeDeploy Agent](http://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations.html#how-to-run-agent-install-linux). Make sure you tag the instance with something that is identifiable, because tags are one way that CodeDeploy identifies the instances it should add to the deployment group. 
Once you have an instance running, sign in to the CodeDeploy console and choose [Create New Application.](http://docs.aws.amazon.com/codedeploy/latest/userguide/applications-create.html) In CodeDeploy, an application is a namespace that AWS CodeDeploy uses to correlate attributes, such as what code should be deployed and from where.

After you’ve created your application, you can specify a [deployment group](http://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-groups-create.html), which is a collection of EC2 instances that CodeDeploy will execute on for each deployment.

Now that the basics for CodeDeploy are configured, we need to tell CodeDeploy how to deploy to our instances by using an [appspec.yml](http://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html) file.

## Deployment

Now we’re ready to push code to our deployment group. From within our repo’s “master” branch, We can simply choose `Deploy to AWS`.
Now We can check on the status of the deployment in the CodeDeploy console and finally, see if the deployment was successful by viewing the DNS address of our instance in a browser.

So there you have it—a simple mechanism for pushing code directly to EC2 instances by using Atlassian Bitbucket and AWS CodeDeploy.

## Testing

Assuming Everything Goes Right you would be able to see the hello world if you hit the URL http://ec-2-instanceDNS:3000/test as we have used get method for demo.

## AWS Sample Integrations for Atlassian Bitbucket Pipelines

You can easily enable Bitbucket Pipelines on a Bitbucket repository by choosing a new icon in the menu bar.  The commits page in your repository will also have a new column called “Builds” where you can see the result of the Pipelines actions that were run on that commit. The Pipelines page shows further information about the commits.

Once you enable Bitbucket Pipelines, you’ll need to include a YAML configuration file called bitbucket-pipelines.yml that details the actions to take for your branches. The configuration file describes a set of build steps to take for each branch in Bitbucket. It provides the flexibility to limit build steps to certain branches or take different actions for specific branches. For example, you might want a deployment to AWS Lambda step to be taken only when a commit is made on the “master” branch.

Under the hood, Bitbucket Pipelines uses a Docker container to perform the build steps.One thing to note is that creating your own Docker image with all required tools and libraries for your build steps helps speed up build time.

The build steps specified in the configuration file are nothing more than shell commands that get executed on the Docker image.To support the launch of Bitbucket Pipelines, AWS has published sample scripts, using Python and the boto3 SDK, that help you get started on integrating with several AWS services, including AWS Lambda, AWS Elastic Beanstalk, AWS CodeDeploy, and AWS CloudFormation

# Deploy to AWS CodeDeploy
An example script and configuration for updating an existing [AWS CodeDeploy](https://aws.amazon.com/codedeploy/) application with BitBucket Pipelines. This example deploys a Hello World application to an existing AWS CodeDeploy Application Deployment Group.

## How To Use It
* Optional:  [Create an S3 bucket](http://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html) to hold application revisions if you do not currently have one.
* Optional:  [Setup a demo application](http://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-walkthrough.html) with AWS CodeDeploy if you do not already have one.
* Add the required Environment Variables below in Build settings of your Bitbucket repository.
* Copy `codedeploy_deploy.py` to your project.
* Copy `bitbucket-pipelines.yml` to your project.
    * Or use your own, just be sure to include all steps in the sample yml file.
* If you followed the Getting Started guide above and are using the sample application included in this repository, copy the `scripts` files , `appspec.yml` file, and `index.js` file to your project.

## Required Permissions in AWS
It is recommended you [create](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) a separate user account used for this deploy process.  This user should be associated with a group that has the `AWSCodeDeployFullAccess` and `AmazonS3FullAccess` [AWS managed policy](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html) attached for the required permissions to upload a new application revision and execute a new deployment using AWS CodeDeploy.

Note that the above permissions are more than what is required in a real scenario. For any real use, you should limit the access to just the AWS resources in your context.

## Required Environment Variables
* `AWS_SECRET_ACCESS_KEY`:  Secret key for a user with the required permissions.
* `AWS_ACCESS_KEY_ID`:  Access key for a user with the required permissions.
* `AWS_DEFAULT_REGION`:  Region where the target AWS CodeDeploy application is.
* `APPLICATION_NAME`: Name of AWS CodeDeploy application.
* `DEPLOYMENT_CONFIG`: AWS CodeDeploy Deployment Configuration (CodeDeployDefault.OneAtATime|CodeDeployDefault.AllAtOnce|CodeDeployDefault.HalfAtATime|Custom).
* `DEPLOYMENT_GROUP_NAME`: Name of the Deployment group in the application.
* `S3_BUCKET`:  Name of the S3 Bucket where source code to be deployed is stored.

## Authors

* **Kush Vyas** - *Initial work* - [Twitter](https://twitter.com/kushvyas),
                                   [StackOverflow](https://stackoverflow.com/users/6077057/kush-vyas)
# License
Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Note: Other license terms may apply to certain, identified software files contained within or distributed with the accompanying software if such terms are included in the directory containing the accompanying software. Such other license terms will then apply in lieu of the terms of the software license above.

## Acknowledgments

Code Used from:
[awslabs](https://bitbucket.org/account/user/awslabs/projects/BP)

Reference Links : 

[Announcing Atlassian Bitbucket Support for AWS CodeDeploy](https://aws.amazon.com/blogs/apn/announcing-atlassian-bitbucket-support-for-aws-codedeploy/)

[AWS Sample Integrations for Atlassian Bitbucket Pipelines](https://aws.amazon.com/blogs/apn/aws-sample-integrations-for-atlassian-bitbucket-pipelines/)