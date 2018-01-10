# URL Press - URL Shortener for Team

![demo](https://media.giphy.com/media/xULW8PFcF2A7zAAOQw/giphy.gif)

This library is to generate shortened URL, like bit.ly, tinyurl.cc, goo.gl, etc.

It was made to be used by "team", which means a group of honest people who know each other.
Therefore, it might be "vulnerable" to attackers and should be deployed to a private and protected network.

## Feature

- Super simple GUI
- Named URL and randomized URL
- Updating existing URL
- DynamoDB backend
- [Docker support](https://hub.docker.com/r/yamitzky/url-press/) 🐳

## Build Setup

```
git clone git@github.com:yamitzky/url-press.git
cd url-press
docker-compose up
```

You might have to create DynamoDB table before starting up the service.
