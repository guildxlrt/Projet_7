//---IMPORTS
// prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// MODIFIER
exports.modifyComment = async (req, res, next) => {
    console.log('alooo')
    // Recherche
    await prisma.comment.findUnique({
        where : {
            id : Number(req.params.id)
        }
    })
    .then(async comment => {
        // verification utilisateur
        if (comment.userId === req.auth.userId) {
            // enregistrement
            await prisma.comment.update({
                where : {
                    id : Number(req.params.id)
                },
                data : {
                    text : req.body.text
                }
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : 'Commentaire modifie !' }))
            .catch(error => console.log(error) || res.status(401).json({ message : error }));
        } else {
            return res.status(401).json({ message : 'Acces non authorise' })
        }
    })
    .catch(error => console.log(error) || res.status(500).json({ message : error }));
}

// SUPPRIMER
exports.delComment = async (req, res, next) => {
    //---Quel utilisateur ?
    //------ADMINISTRATEUR
    if (req.auth.isAdmin === true) {
        await prisma.user.findUnique({
            where : {
                id : req.auth.userId
            }
        })
        .then(async admin => {
            // verification administrateur
            if ((req.auth.userId === admin.id) && (admin.isActive === true) && (admin.isAdmin === true)) {
                // enregistrement
                await prisma.comment.delete({
                    where : {
                        id : Number(req.params.id)
                    }
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'commentaire supprime !' }))
                .catch(error => res.status(401).json({ message : error }))
            } else {
                return res.status(401).json({ message : 'Acces non authorise' })
            }
        })
    }
    //------UTILISATEUR NORMAL
    else {
        // Recherche dans le post
        await prisma.comment.findUnique({
            where : {
                id : Number(req.params.id)
            }
        })
        .then(async comment => {
            // verification utilisateur
            if (comment.userId === req.auth.userId) {
                // enregistrement
                await prisma.comment.delete({
                    where : {
                        id : Number(req.params.id)
                    }
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'commentaire supprime !' }))
                .catch(error => res.status(401).json({ message : error }))
            } else {
                return res.status(401).json({ message : 'Acces non authorise' })
            }
        })
        .catch(error => res.status(500).json({ message : error }));
    }
}