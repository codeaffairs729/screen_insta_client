import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyCZDKj_fSUKmi_SDcu5_ao5dsVmzOtWqng",
  authDomain: "betweenus-3296e.firebaseapp.com",
  databaseURL: "https://betweenus-3296e.firebaseio.com",
  projectId: "betweenus-3296e",
  storageBucket: "betweenus-3296e.appspot.com",
  messagingSenderId: "40472663743",
  appId: "1:40472663743:web:316ffd2659492fcf0d980a",
  measurementId: "G-T7GZLRX8B5",
};

firebase.default.initializeApp(config);

export default firebase.default;
