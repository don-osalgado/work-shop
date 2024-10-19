import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

interface Contact {
  name: string;
  phoneNumber: string;
}

const dynamoDBClient = new DynamoDBClient({});
const tableName = process.env.TABLE_NAME_CONTACTS ?? '';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body ?? '{}') as Contact;
    const { email } = event.pathParameters as { email: string };

    const { name, phoneNumber } = body;

    if (!email?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email is required' })
      };
    }

    if (!name?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Name is required' })
      };
    }

    if (!phoneNumber?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Phone number is required' })
      };
    }

    const params = {
      TableName: tableName,
      Key: marshall({ email: email.toLowerCase() })
    };

    const queryCommand = new GetItemCommand(params);

    const response = await dynamoDBClient.send(queryCommand);

    if (!response?.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not exists' })
      };
    }

    const responseUpdate = await dynamoDBClient.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: marshall({ email: email.toLowerCase() }),
        UpdateExpression:
          'SET #name = :nameValue, #phoneNumber = :phoneNumberValue',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#phoneNumber': 'phoneNumber'
        },
        ExpressionAttributeValues: marshall({
          ':nameValue': name,
          ':phoneNumberValue': phoneNumber
        }),
        ReturnValues: 'ALL_NEW'
      })
    );

    const data = responseUpdate.Attributes;

    return {
      statusCode: 200,
      body: JSON.stringify(unmarshall(data ?? {}))
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal error server' })
    };
  }
};
