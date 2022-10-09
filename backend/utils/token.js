//==========================//
//========//TOKENS//========//

//========//Generator
exports.tokenGen = (userId, adminStatus) => {
    const exp = 1000 * 60 * 60 * 24 // cookie expiration : ms * sec * min * hr * days

    const gen = jwt.sign(
        {
            userId : userId,
            isAdmin : adminStatus
        },
        process.env.RANDOM_TOKEN,
        { expiresIn : '24h'}
    )

    return {gen, exp}
}

//========//Decoder
exports.tokenDec = (req) => {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN);

    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
        
    req.auth = {
        userId : userId,
        isAdmin : isAdmin
    }
}