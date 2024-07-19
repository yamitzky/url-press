# URL Press - URL Shortener for Team

![demo](https://media.giphy.com/media/xULW8PFcF2A7zAAOQw/giphy.gif)

URL Press is a URL shortener designed for teams, similar to bit.ly, tinyurl.cc, goo.gl, etc. It's intended for use by groups of trusted individuals and should be deployed in a private, protected network environment.

## Features

- Super simple GUI
- Named URL and randomized URL options
- Ability to update existing URLs
- DynamoDB backend for data storage

## Installation

To use URL Press in your project, install it via npm:

```bash
npm install url-press
```

## Usage

Here's a basic example of how to use URL Press:

```javascript
const URLPress = require('url-press');

// Initialize URLPress with your DynamoDB configuration
const urlPress = new URLPress({
  region: 'your-aws-region',
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
  tableName: 'your-dynamodb-table-name'
});

// Create a short URL
urlPress.createShortURL('https://example.com', 'custom-alias')
  .then(shortURL => console.log('Short URL:', shortURL))
  .catch(error => console.error('Error:', error));

// Retrieve the original URL
urlPress.getOriginalURL('custom-alias')
  .then(originalURL => console.log('Original URL:', originalURL))
  .catch(error => console.error('Error:', error));
```

## API Reference

- `createShortURL(originalURL: string, customAlias?: string): Promise<string>`
- `getOriginalURL(shortCode: string): Promise<string>`
- `updateShortURL(shortCode: string, newOriginalURL: string): Promise<void>`

## Development Setup

To set up the project for development:

1. Clone the repository:
   ```bash
   git clone https://github.com/yamitzky/url-press.git
   cd url-press
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   AWS_DEFAULT_REGION=your-aws-region
   DYNAMO_TABLE_NAME=your-dynamodb-table-name
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

Note: You'll need to set up a DynamoDB table before running the service. Make sure you have AWS credentials configured on your machine.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
