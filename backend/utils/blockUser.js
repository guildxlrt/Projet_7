const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//========//Update User Status
module.exports = async (targetId, bolValue, req, res) => {
    //---Utilisateur
    await prisma.user.update({
        where : { id : targetId },
        data : { 
            isActive : bolValue,
            Post : {
                updateMany : {
                    where : { userId : targetId },
                    data : { isActive : bolValue }
                } 
            },
            Comment : {
                updateMany : {
                    where : { userId : targetId },
                    data : { isActive : bolValue }
                } 
            }
        },
    })
    .then(() => {
        if (bolValue === false) {
            console.log('Compte Desactive !') || res.status(200).json({ message : 'Compte Desactive !' })
        } 
        else {
            console.log('Compte (re)active !') || res.status(200).json({ message : 'Compte (re)active !' })
        }
    })
    .catch(error => res.status(500).json({ error : error }))
}