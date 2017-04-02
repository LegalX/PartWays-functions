# PartWays-functions
Cloud Functions for Firebase

[Get started with Cloud Functions](https://firebase.google.com/docs/functions/get-started)

To create new function:

1. Run `firebase login` to log in via the browser and authenticate the firebase tool.
2. Go to your new Firebase project directory.
3. Run `firebase init functions`. The tool gives you an option to install dependencies with npm. It is safe to decline if you want to manage dependencies in another way.

To deploy function:
`firebase deploy --only functions`
