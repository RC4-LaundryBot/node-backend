import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { url } from 'inspector';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);

export const writeData = functions.https.onRequest((request, response) => {
    var houseid: String = request.body["floor"];
    var data:String = request.body["data"];

    // error checking (only accepts 3 status)
    for (var i = 0; i < 4; i++) {
        if (data.charCodeAt(i) < 48  || data.charCodeAt(i) > 50) {
            response.send(400)
        } 
    }

    

    admin.firestore().collection("levels").doc(houseid.toString()).update(
        {
            "washer1": data.charCodeAt(0) - 48,
            "washer2": data.charCodeAt(1) - 48,
            "dryer1": data.charCodeAt(2) - 48,
            "dryer2": data.charCodeAt(3) - 48,
        }
    ).then(() => response.send(200));

});

export const readData = functions.https.onRequest((request, response) => {
    var houseid: String = request.url.substr(1);

    admin.firestore().collection("levels").doc(houseid.toString()).get().then(
        (snapshot) => {
            if (!snapshot.exists) {
                response.send(404)
            }

            var map = {
                "washer1": snapshot.get("washer1"),
                "washer2": snapshot.get("washer2"),
                "dryer1": snapshot.get("dryer1"),
                "dryer2": snapshot.get("dryer2"),
            }

            response.send(map)
        }
    )
});
