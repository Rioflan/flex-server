import mongoose = require("mongoose");
import Places from "./models/place";
import credentials from "./credentials_LOCAL.json";
import { domainToASCII } from "url";

process.stdout.write("IMPORTING....\n");
/**
 * PLACES
 */

const floor3 = {
    "number": 3,
    "V": {
        "RER": 26,
        "MILIEU": 17,
        "BOIS": 22
    },
    "B": {
        "RER": 34,
        "MILIEU": 0,
        "BOIS": 43
    },
    "R": {
        "RER": 36,
        "MILIEU": 13,
        "BOIS": 56
    }
};

const floor4 = {
    "number": 4,
    "V": {
        "RER": 23,
        "MILIEU": 13,
        "BOIS": 23
    },
    "B": {
        "RER": 40,
        "MILIEU": 0,
        "BOIS": 35
    },
    "R": {
        "RER": 44,
        "MILIEU": 0,
        "BOIS": 59
    }
};

const floor10 = {
    "number": 10,
    "A": {
        "SEINE": 16,
        "COUR": 38
    }
};
const floor11 = {
    "number": 11,
    "A": {
        "SEINE": 24,
        "COUR": 30
    }
};
const floors = [floor3, floor4];
const floorsX = [floor10, floor11];
const zones = ["V", "B", "R"];
const zonesLR = ["A"];

const sides = ["RER", "MILIEU", "BOIS"];
const sides2 = ["SEINE", "COUR"];
const nbFloors = floors.length;
const nbFloorsLR = floorsX.length;

const nbZones = zones.length;
const nbZonesLR = zonesLR.length;
const nbSides = sides.length;
const nbSidesLR = sides2.length;


(async () => {
    try{
        // Read the certificate authority

        mongoose.connect(credentials.cosmosdb_url, {
            auth: {
                user: credentials.cosmosdb_user,
                password: credentials.cosmosdb_pwd
              },
            useNewUrlParser: true,
          })
          .then(async () => {
              console.log('Connection to CosmosDB successful');
                  
                // LA RAPEE
                let totalX = 0;
                for (let indexFloor = 0; indexFloor < floorsX.length; indexFloor++) {
                    for (let indexZone = 0; indexZone < nbZonesLR; indexZone++) {
                        for (let indexSide = 0; indexSide < sides2.length; indexSide++) {
                            let number = floorsX[indexFloor].number;
                            let zone = zonesLR[indexZone];
                            let side = sides2[indexSide];
                            let nbPlaces = floorsX[indexFloor][zone][side];
                            for (let numPlace = 1; numPlace <= nbPlaces; numPlace++) {
                                let id = `RA-${number}-${zone}-${side}${("0" + numPlace).slice(-2)}`;
                                process.stdout.write("\r                              \r"); // clear current line
                                process.stdout.write("Inserting " + id + "\n");
                                await Places.findOneAndUpdate({id: id}, {}, {upsert: true, setDefaultsOnInsert: true});
                                totalX++;
                            }
                        }
                    }
                }


            let total = 0;
                for (let indexFloor = 0; indexFloor < nbFloors; indexFloor++) {
                    for (let indexZone = 0; indexZone < nbZones; indexZone++) {
                        for (let indexSide = 0; indexSide < nbSides; indexSide++) {
                            let number = floors[indexFloor].number;
                            let zone = zones[indexZone];
                            let side = sides[indexSide];
                            let nbPlaces = floors[indexFloor][zone][side];
                            for (let numPlace = 1; numPlace <= nbPlaces; numPlace++) {
                                let id = `JO-${number}-${zone}-${side}${("0" + numPlace).slice(-2)}`;
                                process.stdout.write("\r                              \r"); // clear current line
                                process.stdout.write("Inserting " + id + "\n");
                                await Places.findOneAndUpdate({id: id}, {}, {upsert: true, setDefaultsOnInsert: true});
                                total++;
                            }
                        }
                    }
                }
                console.log("\nTotal LA RAPEE :", totalX, "inserted");
                console.log("\nTotal JOINVILLE :", total, "inserted");

                console.log("\nTotal GLOBAL :", total+totalX, "inserted");
                await mongoose.disconnect();
                console.log("FINISHED !");
            })
          .catch((err) => console.error(err));


    }
    catch(err){
        console.log("ERROR : "+err);

    }  
})();

