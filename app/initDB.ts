import mongoose from 'mongoose';
import dbconfig from './database/mongoDB';
import Places from "./models/place";

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

const floors = [floor3, floor4];
const zones = ["V", "B", "R"];
const sides = ["RER", "MILIEU", "BOIS"];

const nbFloors = floors.length;
const nbZones = zones.length;
const nbSides = sides.length;

(async () => {
    mongoose.connect(dbconfig.getMongoUri(), { useNewUrlParser: true });
    mongoose.set('useFindAndModify', false);

    let total = 0;
    for (let indexFloor = 0; indexFloor < nbFloors; indexFloor++) {
        for (let indexZone = 0; indexZone < nbZones; indexZone++) {
            for (let indexSide = 0; indexSide < nbSides; indexSide++) {
                let number = floors[indexFloor].number;
                let zone = zones[indexZone];
                let side = sides[indexSide];
                let nbPlaces = floors[indexFloor][zone][side];
                for (let numPlace = 1; numPlace <= nbPlaces; numPlace++) {
                    let id = `${number}-${zone}-${side}${("0" + numPlace).slice(-2)}`;
                    process.stdout.write("\r                              \r"); // clear current line
                    process.stdout.write("Inserting " + id);
                    await Places.findOneAndUpdate({id: id}, {}, {upsert: true, setDefaultsOnInsert: true});
                    total++;
                }
            }
        }
    }
    await mongoose.disconnect();
    console.log("\nTotal :", total, "inserted");
})();