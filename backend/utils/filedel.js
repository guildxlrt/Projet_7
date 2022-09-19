const fs = require('fs')

module.exports = (target) => {
    //---Suppression fichier
    const filename = target.split('/images/')[1];
    fs.unlink(`images/${filename}`, (err) => {
        if (err) {
            console.log("Echec lors de la suppression du fichier : " + err)
        } else {
            console.log("le fichier a ete supprime")
        }
    })
}