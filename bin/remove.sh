db.places.update({ using: true }, { $set: { using: false, id_user: "" } }, { multi: true })
db.users.update({}, { $set: { id_place: "" } }, { multi: true })
