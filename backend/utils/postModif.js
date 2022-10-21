//========//FORMATAGE DATES
const utils = require('../utils/utils');

//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (target, post, req, res) => {

    // Validation de la requete
    const update = async (datas) => {
        console.log(datas)
        if (datas.text === '') datas.title = null
        if (datas.novideo) datas.video = null
        if (datas.nopic) datas.imageUrl = null
        if (datas.notitle) datas.title = null
        delete datas.novideo
        delete datas.nopic
        delete datas.notitle

        await prisma.post.update({
            where : { id : target },
            data : datas
        })
        .then((post) => res.status(200).json(post))
        .catch(error =>  errorFileReq(error, 500, req, res));
    }

    //========// TRAITEMENT DE LA REQUETE
    let content = {...req.body, updated : true}
   
    //----Sans modif de l'image
    if (!req.file) {
        // enregistrer
        update(content)
    }
    //---- Nouvelle image
    else if (req.file) {
        content = {
            ...(req.body),
            imageUrl : utils.newImageUrl(req)
        }

        // //----Nouvelle image
        if (!(post.imageUrl === null)) {
            //----Suppression Ancient fichier
            const oldFile = post.imageUrl.split('/images/posts/')[1];
            utils.fileDel(oldFile)
        }

        // redirection du nouveau fichier
        utils.fileMove('posts', req.file.filename)

        // enregistrer
        update(content)
    }
    //----Suppression Image
    else if (req.body.nopic === true) {
        // Erreurs requete
        if (req.file) {
            return errorFileReq(errMsg.PostErrReq, 400, req, res)
        }
        else if (post.imageUrl === null) {
            return errorFileReq(errMsg.PostErrReq, 400, req, res)
        }
        // Requete valide             
        else {
            // suppression du fichier
            const oldFile = post.imageUrl.split('/images/posts/')[1];
            utils.fileDel('posts', oldFile)

            // enregistrer
            update(content)
        }                    
    }
}