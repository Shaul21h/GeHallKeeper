var mongoose = require('mongoose');
var schema = mongoose.Schema;
var hallSchema = new schema({
    hallId:String,
    name:String,
    alias:String,
    capabilities:[String],
    locationHint:String,
    occupancy: {
        occupied: Boolean,
        occupiedBy:String,
        team: String,
        purpose: String,
        timeRange: {
            from:Date,
            to:Date
        }
    },
    bookQueue:[
        {
            name:String,
            team:String,
            purpose:String,
            timeRange:{
                from:Date,
                to:Date
            }
        }
    ]

},{collection:'halls'});
hallSchema.statics.findAvailableHalls = function(callback){
    return this.find({"occupancy.occupied": "false"},callback);
};

mongoose.model('Hall',hallSchema);
/*
schema:

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

[
{
  
  "alias": "",
  "bookQueue": [],
  "capabilities": [
    "ceiling mic",
    "room speaker",
  ],
  "hallId": 1,
  "locationHint": "Near support team",
  "name": "War Room",
  "occupancy": {
    "occupied": "false",
    "occupiedBy": "",
    "purpose": "",
    "team": "",
    "timeRange": {
      "from": 1.380740924752E12,
      "to": 1.380740924752E12
    }
  }
}
,
{
  
  "alias": "",
  "bookQueue": [],
  "capabilities": [
    "ceiling mic",
    "room speaker",
    "projector",
    "Mac machine"
  ],
  "hallId": 2,
  "locationHint": "Near support team",
  "name": "Conference Hall",
  "occupancy": {
    "occupied": "false",
    "occupiedBy": "",
    "purpose": "",
    "team": "",
    "timeRange": {
      "from": 1.380740924752E12,
      "to": 1.380740924752E12
    }
  }
}
,
{
  
  "alias": "",
  "bookQueue": [],
  "capabilities": [
    "ceiling mic",
    "room speaker",
    "projector"
  ],
  "hallId": 3,
  "locationHint": "Near Edge Team",
  "name": "Training room",
  "occupancy": {
    "occupied": "false",
    "occupiedBy": "",
    "purpose": "",
    "team": "",
    "timeRange": {
      "from": 1.380740924752E12,
      "to": 1.380740924752E12
    }
  }
}
,
{
  
  "alias": "",
  "bookQueue": [],
  "capabilities": [
    "ceiling mic",
    "room speaker",
    "TV"
  ],
  "hallId": 4,
  "locationHint": "Near front office",
  "name": "Front Office Discussion room",
  "occupancy": {
    "occupied": "false",
    "occupiedBy": "",
    "purpose": "",
    "team": "",
    "timeRange": {
      "from": 1.380740924752E12,
      "to": 1.380740924752E12
    }
  }
}
,
{
  
  "alias": "",
  "bookQueue": [],
  "capabilities": [
    "ceiling mic",
    "room speaker",
    "TV"
  ],
  "hallId": 5,
  "locationHint": "Near Xavier's cabin",
  "name": "Mini Discussion Room 1",
  "occupancy": {
    "occupied": "false",
    "occupiedBy": "",
    "purpose": "",
    "team": "",
    "timeRange": {
      "from": 1.380740924752E12,
      "to": 1.380740924752E12
    }
  }
}
,
{
  
  "alias": "",
  "bookQueue": [],
  "capabilities": [
    "ceiling mic",
    "room speaker",
    "TV"
  ],
  "hallId": 6,
  "locationHint": "Opposite to conference room",
  "name": "Mini Discussion Room 2",
  "occupancy": {
    "occupied": "false",
    "occupiedBy": "",
    "purpose": "",
    "team": "",
    "timeRange": {
      "from": 1.380740924752E12,
      "to": 1.380740924752E12
    }
  }
}
,
{
  
  "alias": "Nappy",
  "bookQueue": [],
  "capabilities": [
    "Bunk beds",
    "bean bags",
    "pillows"
  ],
  "hallId": 7,
  "locationHint": "Opposite to conference room",
  "name": "Nap room",
  "occupancy": {
    "occupied": "false",
    "occupiedBy": "",
    "purpose": "",
    "team": "",
    "timeRange": {
      "from": 1.380740924752E12,
      "to": 1.380740924752E12
    }
  }
}
]
*/
