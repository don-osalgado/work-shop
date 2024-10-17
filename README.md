# work-shop

Hi! I'm your first Markdown file in **StackEdit**. If you want to learn about StackEdit, you can read me. If you want to play with Markdown, you can edit me. Once you have finished with me, you can create new files by opening the **file explorer** on the left corner of the navigation bar.


## Create bucket S3
This is where we will put the github artifacts and the build result

**Bucket name:** deployment-artifacts-${AWS:AccountId}

## Create role PipelineDeploymentRole

**Trust relationships:**

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "codepipeline.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }

**Policy:** PipelineDeploymentPolicy

    {
        "Statement": [
            {
                "Action": [
                    "iam:PassRole"
                ],
                "Resource": "*",
                "Effect": "Allow",
                "Condition": {
                    "StringEqualsIfExists": {
                        "iam:PassedToService": [
                            "cloudformation.amazonaws.com",
                            "ec2.amazonaws.com"
                        ]
                    }
                }
            },
            {
                "Action": [
                    "codestar-connections:UseConnection"
                ],
                "Resource": "*",
                "Effect": "Allow"
            },
            {
                "Action": [
                    "ec2:*",
                    "cloudwatch:*",
                    "s3:*",
                    "sns:*",
                    "cloudformation:*"
                ],
                "Resource": "*",
                "Effect": "Allow"
            },
            {
                "Action": [
                    "lambda:InvokeFunction",
                    "lambda:ListFunctions"
                ],
                "Resource": "*",
                "Effect": "Allow"
            },
            {
                "Action": [
                    "cloudformation:CreateStack",
                    "cloudformation:DeleteStack",
                    "cloudformation:DescribeStacks",
                    "cloudformation:UpdateStack",
                    "cloudformation:CreateChangeSet",
                    "cloudformation:DeleteChangeSet",
                    "cloudformation:DescribeChangeSet",
                    "cloudformation:ExecuteChangeSet",
                    "cloudformation:SetStackPolicy",
                    "cloudformation:ValidateTemplate"
                ],
                "Resource": "*",
                "Effect": "Allow"
            },
            {
                "Action": [
                    "codebuild:BatchGetBuilds",
                    "codebuild:StartBuild",
                    "codebuild:BatchGetBuildBatches",
                    "codebuild:StartBuildBatch"
                ],
                "Resource": "*",
                "Effect": "Allow"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "servicecatalog:ListProvisioningArtifacts",
                    "servicecatalog:CreateProvisioningArtifact",
                    "servicecatalog:DescribeProvisioningArtifact",
                    "servicecatalog:DeleteProvisioningArtifact",
                    "servicecatalog:UpdateProduct"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "cloudformation:ValidateTemplate"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "ecr:DescribeImages"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "states:DescribeExecution",
                    "states:DescribeStateMachine",
                    "states:StartExecution"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "appsync:*"
                ],
                "Resource": "*"
            }
        ],
        "Version": "2012-10-17"
    }

## Create role CfnDeployerRole

**Trust relationships:**

    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "",
          "Effect": "Allow",
           "Principal": {
             "Service": "cloudformation.amazonaws.com"
           },
           "Action": "sts:AssumeRole"
         }
      ]
    }
  
  **Policy:** CloudFormationDeployerPolicy

      {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": [
                    "apigateway:*",
                    "cloudformation:CreateStack",
                    "lambda:*",
                    "cloudformation:UpdateStack",
                    "dynamodb:*",
                    "cloudformation:UpdateStackSet",
                    "cloudformation:CreateChangeSet",
                    "cloudformation:ExecuteChangeSet",
                    "cloudformation:CreateStackSet",
                    "iam:GetRole",
                    "iam:CreateRole",
                    "iam:DeleteRolePolicy",
                    "iam:DetachRolePolicy",
                    "iam:PutRolePolicy",
                    "iam:DeleteRole",
                    "iam:AttachRolePolicy",
                    "iam:PassRole",
                    "logs:CreateLogGroup",
                    "logs:PutRetentionPolicy"
                ],
                "Resource": "*"
            }
        ]
    }

**Policy:** GetArtifacts

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:s3:::deployment-artifacts-${AWS:AccountId}/*"
                ],
                "Action": [
                    "s3:GetObject"
                ]
            }
        ]
    }

## Update role CodebuildContactRole

**Policy:** GetArtifacts

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:s3:::deployment-artifacts-${AWS:AccountId}/*"
                ],
                "Action": [
                    "s3:PutObject",
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:GetBucketAcl",
                    "s3:GetBucketLocation"
                ]
            }
        ]
    }

## Buildspec
    version: 0.2
    phases:
    install:
        commands:
        - yarn install
    build:
        commands:
        - yarn build
        
    post_build:
        commands:
        - aws cloudformation package --template template.yml --s3-bucket $S3Bucket --output-template package.yml
    artifacts:
    files:
        - package.yml
    discard-paths: yes


## DRP
**Create bucket (US West (N. California) us-west-1):**  deployment-artifacts-${AWS:AccountId}-drp

**Update role policy:** CfnDeployerRole and CodebuildContactRole, add new bucket "deployment-artifacts-${AWS:AccountId}-drp"

**Get pipeline:** aws codepipeline get-pipeline --name MyPipelineName

**Change attribute "artifactStore" by "artifactStores"**

    {
        "us-east-1": {
            "type": "S3",
            "location": "deployment-artifacts-${AWS:accountId}",
            "us-west-1": {
            "type": "S3",
            "location": "deployment-artifacts-${AWS:accountId}-drp"
            }
        }
    }

**Execute command:** aws codepipeline update-pipeline --cli-input-json '{"pipeline": {...}}'



## Buildspec - replication to another region
    version: 0.2
    phases:
    install:
        commands:
        - yarn install
    build:
        commands:
        - yarn build
        
    post_build:
        commands:
        - aws cloudformation package --template template.yml --s3-bucket $S3Bucket --output-template package.yml
        - aws cloudformation --region us-west-1 package --template $PROJECT_DIR/template.yml --s3-bucket $S3BucketDRP --output-template package-drp.yml
    artifacts:
    files:
        - package.yml
        - package-drp.yml
    discard-paths: yes

## GitHub Actions optional

Go to URL https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/identity_providers -> Add provider.

**Option:** OpenID Connect

**Provider URL:** https://token.actions.githubusercontent.com

**Audience:** sts.amazonaws.com

Click Add provider.

Then you must assign a Role that has start code pipeline permissions.

**Policy:** StartAnyCodepipeline

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Resource": "arn:aws:codepipeline:*:${AWS:AccountId}:*"
                "Action": "codepipeline:StartPipelineExecution"
            }
        ]
    }

On GitHub, go to the **repository->Settings->Secrets and variables.**

There you must add two variables, one secret and one normal.

Secret:
- **AWS_ROLE_TO_ASSUME**: the arn of the created role associated with the identity provider must go here

Normal:
- **AWS_CONTACT_PIPELINE_NAME**: the name of the created pipeline goes here


**Post: Actions must be active for the repository**    