import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

interface Contact {
  email: string;
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

    const { email, name, phoneNumber } = body;

    if (!email?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email is required' })
      };
    }

    if (name?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Name is required' })
      };
    }

    if (phoneNumber?.length) {
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

    if (response?.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Contact already exists' })
      };
    }

    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall({ email, name, phoneNumber })
    });

    await dynamoDBClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact created' })
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal error server' })
    };
  }
};
