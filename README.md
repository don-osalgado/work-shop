# work-shop

Hi! I'm your first Markdown file in **StackEdit**. If you want to learn about StackEdit, you can read me. If you want to play with Markdown, you can edit me. Once you have finished with me, you can create new files by opening the **file explorer** on the left corner of the navigation bar.


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
    				"dynamodb:*",
    				"lambda:*",
    				"apigateway:*"
    			],
    			"Resource": "*"
    		}
    	]
    }