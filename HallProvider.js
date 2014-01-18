var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSONPure;
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
/*
    {
        "hallId":"1",
        "name": "War Room",
        "alias":"",
        "capabilities": ["TV","ceiling mic","room speaker","projector","Mac machine"],
        "locationHint": "Near support team",
        "occupancy":    {
                            "status":"occupied", //or vacant
                            "occupiedBy": "Sivakumar",
                            "team": "Edge",
                            "purpose": "QA Sync Up meeting", 
                            "timeRange" : "900:1030"
                        },
        "bookQueue":    [
                            {
                                "name": "Balasubramanian",
                                "team":"LinGo",
                                "purpose": "Sprint Kick-off meeting",
                                "timeRange": "1030:1300"
                            },
                            {
                                "name": "Xavier",
                                "team":"Platform",
                                "purpose": "Spring Review meeting",
                                "timeRange": "1400:1600"
                            }
                        ]
    }
*/
var connection_string = '127.0.0.1:27017/gehallkeeper';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
var globalDB = null;
function getDB() {
    MongoClient.connect('mongodb://' + connection_string, function (err, db) {
        if (err) throw err;
        console.log('connected db');
        var collection = db.collection('halls'); // .find().toArray(function (err, docs) {
        collection.count(function (err, count) {
            if (err) {
                console.log("no docs in halls collection");
                collection.drop();
            }
        });
        globalDB = db;
    });
};
HallProvider = function () {
    getDB();
};

HallProvider.prototype.getHallCollection = function (callback) {
    if (!globalDB) getDB();
    globalDB.collection('halls', function (error, hall_collection) {
        if (error) callback(error);
        else callback(null, hall_collection);
    });
};

HallProvider.prototype.getPlayers = function (callback) {
    this.getPlayerCollection(function (error, player_collection) {
        player_collection.find().sort({playerNumber:1}).toArray(function (error, results) {
            if (error) callback(error);
            else callback(null, results);
        });
    })
};

HallProvider.prototype.updateProfilePic = function (playerNo, imageSources, callback) {
    this.getPlayerCollection(function (error, players) {
        if (error) callback(error);
        else {
            players.findOne({ playerNumber: parseInt(playerNo) }, function (findError, playerToUpdate) {
                if (findError)
                    console.log('find error');
                else {
                    //console.log(playerToUpdate);
                    players.update({ _id: new ObjectId(playerToUpdate._id.toString()) }, { $set: { profileImages: imageSources} }, { multi: false, safe: true }, function (updateError, result) {
                        if (!updateError) {
                            console.log("imageSources updated for player" + playerNo);
                            console.log('affected ' + result + " docs");
                            callback();
                        }
                        else
                            console.log(updateError);
                    });
                }
            });
        }
    });
};


HallProvider.prototype.updateScore = function (playerNo, score, callback) {

    this.getPlayerCollection(function (error, players) {
        if (error) callback(error);
        else {
            players.update({ playerNumber: parseInt(playerNo) }, { $set: { points: score} }, { multi: false, safe: true }, function (err, result) {
                if (err) { console.log("error updating image source"); callback(err); }
                else {
                    console.log("points updated for player" + playerNo);
                    callback(null, result);
                }
            });

        }
    });
};

HallProvider.prototype.updatePlayerName = function (playerNo, _name,_type, callback) {
    this.getPlayerCollection(function (error, players) {
        if (error) callback(error);
        else {
            players.update({ playerNumber: parseInt(playerNo) }, { $set: { name: _name, type:_type} }, { multi: false, safe: true }, function (err, result) {
                if (err) { console.log("error updating player name: " + err); callback(err); }
                else {
                    console.log('player name updated for player' + playerNo);
                    callback(null, result);
                }
            });
        }
    });
};


var defaultPlayers = [
    {
        playerNumber: 1,
        name: "Home",
        type:"single",  //or double
        profileImages: ["/images/men.jpg"],
        points: 0
    },
    {
        playerNumber: 2,
        name: "Away",
        type:"single",
        profileImages: ["/images/men.jpg"],
        points: 0
    }
];


HallProvider.prototype.resetPlayers = function (callback) {
    this.getPlayerCollection(function (error, players) {
        if (error) console.log(error);
        else {
            players.drop();
            players.insert(defaultPlayers, { safe: true,multi:true }, function (err, result) {
                if (err) { console.log("couldn't reset player"); callback(err); }
                else {
                    console.log("resetted players ");
                    callback(null, result)
                }
            });
        }
    });

};

HallProvider.prototype.resetScores = function (callback) {
    this.getPlayerCollection(function (error, players) {
        if (error) { console.log('[resetScores function] error to getCollection: ' + error); }
        else {
            players.update({}, { $set: { points: 0} }, { multi: true, safe: true }, function (err, result) {
                if (err) { console.log('error resetting scores: ' + err); callback(err); }
                else {
                    console.log('resetted scores');
                    callback(null, result);
                }
            });
        }
    });
}

exports.HallProvider = HallProvider;