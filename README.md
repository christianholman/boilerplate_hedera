# React-native Hedera boilerplate

## Getting started
To install the required packages run 
```
npm i -g rn-nodeify

npm i

npm run postinstall
```
You will also need to react-native link the packages. To do this use the command
```
npx react-native link
```

If you're planning to build on IOS, you will also need to install the required pods.
cd into the ios directory and run
```
pod install
```

Finally, go to App.tsx and add your own operator account credentials.

```typescript

const operatorAccount = '0.0.x'; // Your account ID here
const operatorPrivateKey = '302e020100300506032b657004220420...'; // Your account private key here.

```

The client is configured to run on testnet by default.

## Running
### IOS
```
npx react-native run-ios
```
### Android
```
npx react-native run-android
```
