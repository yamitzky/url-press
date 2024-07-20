# URL Press - URL Shortener for Teams

![demo](https://media.giphy.com/media/xULW8PFcF2A7zAAOQw/giphy.gif)

URL Press is a URL shortener designed for teams, similar to bit.ly, tinyurl.cc, 
goo.gl, etc. It's intended for use by groups of trusted individuals and should 
be deployed in a private, protected network environment.

## Features

- Super simple GUI
- Named URL and randomized URL options
- Ability to update existing URLs
- DynamoDB backend for data storage

## Installation

```bash
npx url-press
```

Note: You'll need to set up a DynamoDB table before running the service. Make 
sure you have AWS credentials configured on your machine.

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

3. Set up environment variables: Create a `.env` file in the root directory with 
   the following content:
   ```
   AWS_DEFAULT_REGION=your-aws-region
   DYNAMO_TABLE_NAME=your-dynamodb-table-name
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. 
