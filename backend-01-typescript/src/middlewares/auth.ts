import jwt from  'jsonwebtoken';

import * as dotenv from 'dotenv';
dotenv.config()

// interface UserPayload {
//     id : string;
//     password : string
// }

// declare global {
//     namespace Express {
//         interface Request {
//             user? : UserPayload;
//             session? : any;
//         }
//     }
// }

export function auth (req , res, next) {
    try {
        // recuperer le header et splitter
        const token = req.headers.authorization.split(' ')[1];
        // decoder le token (mthode verify)
        const verified = jwt.verify(token, process.env.RANDOM_TOKEN);
        
        // recuprer l'userId
        const userId = verified.userId;
        // rajouter cette valeur a l'objet request
        req.auth = {
            userId : userId
        };
        next();
    }
    catch (error) {
        res.status(401).json({error});
    }
}