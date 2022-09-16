const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = (req, res, next) => {
    (async function test() {
        try {
            await prisma.test.create({
                data : {
                    email : req.body.email,
                    test : req.body.test,
                }
            })
            .then(async () => {
                await prisma.$disconnect()
            })
            .then(() => res.status(201).json({ message : 'test send !' }))
        }
        catch (e) {
            console.error(e) || res.json({error : e})
            await prisma.$disconnect()
            process.exit(1)
        }
    })();
}

exports.read = (req, res, next) => {
    (async function test() {
        try {
            const l = await prisma.test.findMany()
            .then(list => res.status(200).json(list))
        }
        catch (e) {
            console.error(e) || res.json({error : e})
            await prisma.$disconnect()
            process.exit(1)
        }
    })();
}