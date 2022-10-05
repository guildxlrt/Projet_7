//========// MESSAGES D'ERREUR //========//
// infos utilisateur
exports.surnameErr = { error : {surname : "Votre prenom doit comporter 2 caracteres minimum, avec  une majuscule suivit de minuscules: Paul, Marie-Louise, Jose Antonio ..." }};
exports.nameErr = { error : {name : "Votre nom de famille doit comporter 2 caracteres minimum, avec une majuscule suivit de minuscules : Dupont, D'Artagnan, De Sade, Primo De Rivera ..." }};
exports.dateErr = "Le champs est obligatoire"

//mdp
exports.passLogin = { error : "Paire login/mot de passe incorrecte" }
exports.passErr = "Le mot de passe n'est pas assez fort : il doit contenir au minimum 2 chiffres, 2 minuscules et 2 majuscules; il doit etre d'une longueur minimum de 8 caracteres";
exports.passwordConfErr = "Les mots de passe doivent correspondre"
exports.passEnter = {error : "Erreur de mot de passe"}
exports.renewal = "Le nouveau mot de passe doit differer du nouveau."

//email
exports.emailSignup = "l'email doit etre au format email : jack.nicholson@laposte.fr, sasha93.dupont@yahoo.fr, kanap-service_client@kanap.co.fr ...";
exports.emailInUse= { error : { email : "l'email est deja utilise" } }
exports.unknowEmail = { error : "L'adresse email est inconnue" }
exports.emailUser = { error :  "Entrez l'adresse de votre compte !" }

// Acces
exports.authErr = { error : 'Acces non authorise' }
exports.unactived = { error : "Le Compte n'est plus actif"}

//likes
exports.likeErr = { error : 'auto-like interdit' }

// token
exports.tokkenErr = { error : "No cookie token, so no able to disconnect some user" }