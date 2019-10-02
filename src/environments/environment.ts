// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "avalon-db.firebaseapp.com",
    databaseURL: "https://avalon-db.firebaseio.com",
    projectId: "avalon-db",
    storageBucket: "avalon-db.appspot.com",
    messagingSenderId: "545284632475",
    appId: "1:545284632475:web:d18e7f31be19e779"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
