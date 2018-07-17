// Initialize Firebase - replace with your own config object!
var config = {
    apiKey: "AIzaSyD9TOO00wPTqITqegWEbLrpYFqzi77SanE",
    authDomain: "wootwoot-1b575.firebaseapp.com",
    databaseURL: "https://wootwoot-1b575.firebaseio.com",
    projectId: "wootwoot-1b575",
    storageBucket: "wootwoot-1b575.appspot.com",
    messagingSenderId: "215610072393"
};
firebase.initializeApp(config);
const db = firebase.database();
/*******************************/
console.log(db)
var name = "";
var destination = "";
var start = 0;
var rate = 0;
var $table = $("#data")
// When a user clicks submit button
$("#submit-button").on("click", function () {
    event.preventDefault(); // Prevent page reload

    // Get data from input fields in our html
    var name = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var start = $("#first-train").val().trim();
    var rate = $("#frequency").val().trim();

    //Initialize moment
    var firstTimeConverted = moment(start, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % rate;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = rate - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    //convert moment to number
    var numTilTrain = nextTrain.toString()
    var nextTrainTime = tMinutesTillTrain.toString()

    // Push that data to our database in the form of an object; this will trigger "child_added" below
    firebase.database().ref().push({
        name: name,
        destination: destination,
        start: start,
        rate: rate, 
        numTilTrain: numTilTrain,
        nextTrainTime: nextTrainTime
    });
});
// Append entire row to hold data from database
db.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val())

    appendRow(snapshot.val().name, snapshot.val().destination, snapshot.val().numTilTrain, snapshot.val().rate, snapshot.val().nextTrain, snapshot.val().nextTrainTime);
});

// create elements and and data points from firebase
function appendRow(nameStr, destinationStr, numTilTrainStr, rateStr, nextTrainTimeStr){
    var name = $("<td>");
    name.text(nameStr);

    var destination = $("<td>")
    destination.text(destinationStr)

    var numTilTrain = $("<td>")
    numTilTrain.text(moment(numTilTrainStr).format("hh:mm"))

    var rate = $("<td>")
    rate.text(rateStr)

    var nextTrainTime = $("<td>")
    nextTrainTime.text(nextTrainTimeStr)
    
    //New tr tag
    var newRow = $("<tr>");
    //Append all td's to tr
    newRow.append(name, destination, numTilTrain, rate, nextTrainTime)
    // Append tr tag to table
    $table.append(newRow)
}