use flex-server-db

db.places.update({using: true}, {$set: {using: false, id_user: ""}}, {multi: true})

db.users.update({"id_place" : {"$exists" : true, "$ne" : ""}}, {$set: {historical: [], id_place: ""}}, {multi: true})

echo db.users.find()