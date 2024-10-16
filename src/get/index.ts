import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

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
    const { email } = event.pathParameters as { email: string };

    if (!email?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email is required' })
      };
    }

    const params = {
      TableName: tableName,
      Key: marshall({ email: email.toLowerCase() })
    };

    const queryCommand = new GetItemCommand(params);

    const response = await dynamoDBClient.send(queryCommand);

    const contact = response.Item ? unmarshall(response.Item) as Contact : null;

    if (!contact) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not exists' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(contact)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal error server' })
    };
  }
};
