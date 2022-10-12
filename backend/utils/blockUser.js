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
    .then((user) => {
        let message = ''
        if (bolValue === false) message = "Compte Desactive !"
        if (bolValue === true) message = "Compte (re)active !"

        res.status(200).json({
            message : message,
            id : user.id,
            isActive :  user.isActive
        })
    })
    .catch(error => res.status(500).json({ error : error }))
}