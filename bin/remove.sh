$DB_PASSWORD_TMP
db.places.update({using: true}, {$set: {using: false, id_user: ""}}, {multi: true});