// Currently, DynamoDB is supported
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb"

type Record = {
    id: string
    url: string
    timestamp: number
}

export class Database {
    client: DynamoDBClient
    tableName: string

    constructor() {
        this.client = new DynamoDBClient({
            region: process.env.AWS_DEFAULT_REGION || "us-east-1"
        })
        this.tableName = process.env.DYNAMO_TABLE_NAME || "url-press"
    }

    async put(record: Omit<Record, 'timestamp'>) {
        const dbParams = {
            TableName: this.tableName,
            Item: {
                id: { S: record.id },
                url: { S: record.url },
                timestamp: { N: (Date.now() / 1000).toString() },
            },
        }
        await this.client.send(new PutItemCommand(dbParams))
    }

    async get(id: string): Promise<Record | undefined> {
        const dbParams = {
            TableName: this.tableName,
            Key: { id: { S: id } }
        }
        const result = await this.client.send(new GetItemCommand(dbParams))
        if (result.Item?.url?.S) {
            return {
                id: result.Item.id.S!,
                url: result.Item.url.S!,
                timestamp: Number(result.Item.timestamp.N!)
            }
        }
    }
}
