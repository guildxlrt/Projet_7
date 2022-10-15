-- MariaDB dump 10.19  Distrib 10.6.7-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: groupomania
-- ------------------------------------------------------
-- Server version	10.6.7-MariaDB-2ubuntu1.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `updated` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `Comment_userId_fkey` (`userId`),
  KEY `Comment_postId_fkey` (`postId`),
  CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
INSERT INTO `Comment` VALUES (1,'au soleil 🌞 de grace !!!','2022-10-10 14:00:16.781',82,2,1,0),(2,'Coucou Venus ❤️❤️❤️','2022-10-10 14:00:19.512',82,1,1,0),(68,'Bien d\'accord !!!','2022-10-11 07:25:44.692',82,6,1,0),(78,'Anticonstitutionnellement... 🫠🏛️','2022-10-13 08:26:37.360',170,6,1,0),(81,'🍑 ou 🍔 ?!? 🤔 ','2022-10-15 08:38:52.555',213,6,1,0),(89,'C\'est cela oui... c\'est cela.','2022-10-15 07:52:02.308',170,1,1,0),(90,'Heu ... Mais oui bien sur 🤣 🧏','2022-10-15 07:54:48.043',169,4,1,0),(91,'Ah Aaah 🎶 Ah Aaah 🎶 ','2022-10-15 07:57:51.852',183,2,1,0),(92,'Hellooo to you !!','2022-10-15 08:05:40.113',140,6,1,0),(94,'J\'ai des ramens si tu veux 🍜 ','2022-10-15 08:48:52.555',213,1,1,0),(95,'🥧 Heu ... on pensait plutot a de la tarte ... Nacha en fait des divines !!','2022-10-15 08:54:02.061',213,2,1,0),(96,'Rooooooooooooo merci 😣😌','2022-10-15 08:54:44.670',213,2,1,0);
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Like`
--

DROP TABLE IF EXISTS `Like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Like_userId_fkey` (`userId`),
  KEY `Like_postId_fkey` (`postId`),
  CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Like`
--

LOCK TABLES `Like` WRITE;
/*!40000 ALTER TABLE `Like` DISABLE KEYS */;
INSERT INTO `Like` VALUES (14,82,2),(20,82,4),(52,82,6),(58,213,1),(61,213,3),(63,169,4),(64,170,6),(65,140,6),(67,183,4),(68,170,4),(69,140,1),(70,183,1);
/*!40000 ALTER TABLE `Like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `creationDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `text` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `updated` tinyint(1) NOT NULL DEFAULT 0,
  `video` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Post_userId_fkey` (`userId`),
  CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
INSERT INTO `Post` VALUES (82,'Anais est le plus beau prenom ❤️',NULL,1,'2022-10-10 09:09:52.040',NULL,1,1,NULL),(132,NULL,NULL,4,'2022-10-12 10:54:58.362',NULL,1,0,'https://www.youtube.com/embed/F9L4q-0Pi4E'),(138,NULL,NULL,4,'2022-10-12 10:58:39.705','~ Le droit est le domaine de l\'imaginaire ~ Emil Cioran',1,0,NULL),(139,NULL,'http://localhost:5000/images/posts/IMG_1665576366398.jpeg',3,'2022-10-12 12:06:06.419',NULL,1,0,NULL),(140,'SALUT!!!!!!',NULL,4,'2022-10-12 12:18:17.627',NULL,1,0,NULL),(169,'Je suis ...',NULL,1,'2022-10-13 05:16:53.609','ALBATOR !!!',1,0,NULL),(170,'',NULL,1,'2022-10-13 06:22:34.373','Antidisestablishmentarianism',1,0,NULL),(183,NULL,NULL,6,'2022-10-13 08:25:15.581','Alexandrie, Alexandra ... 🎶 🎤',1,0,NULL),(195,'null','http://localhost:5000/images/posts/IMG_1665752680599.png',1,'2022-10-14 11:26:22.921','null',1,1,NULL),(199,'','http://localhost:5000/images/posts/IMG_1665756857212.png',1,'2022-10-14 14:14:17.235','',1,1,NULL),(201,'',NULL,1,'2022-10-15 07:23:53.474','',1,1,'https://www.youtube.com/embed/VxLqtt68UPE'),(204,'Mais que serait la vie sans les chats ?',NULL,2,'2022-10-15 08:08:28.437','Et bien je me le demande ... 🤔',1,0,NULL),(205,NULL,NULL,2,'2022-10-15 08:08:59.552','J\'adore les Norvegiens (en chats hein ...)',1,0,NULL),(206,NULL,NULL,2,'2022-10-15 08:09:29.405','Mais egalement les prusses bleus',1,0,NULL),(207,NULL,NULL,6,'2022-10-15 08:39:24.706','Savez-vous planter les chous ?',1,0,NULL),(208,NULL,NULL,6,'2022-10-15 08:39:38.703','A la mode, a la mode !',1,0,NULL),(209,NULL,NULL,6,'2022-10-15 08:40:00.409','Savez-vous planter les choux ?',1,0,NULL),(210,'A la mode de chez nous ?!?',NULL,6,'2022-10-15 08:40:32.398',NULL,1,0,NULL),(211,NULL,NULL,1,'2022-10-15 08:44:00.988',NULL,1,0,'https://www.youtube.com/embed/ea_UOPzuyZU'),(213,'',NULL,4,'2022-10-15 08:46:36.593','J\'ai faim ...',1,0,NULL),(214,'Mon album prefere','http://localhost:5000/images/posts/IMG_1665824450891.webp',3,'2022-10-15 09:00:50.902',NULL,1,0,NULL),(215,'Je les avais vu en live ... ils sont geniaux !!',NULL,3,'2022-10-15 09:02:19.186',NULL,1,0,NULL),(216,'D\'ailleurs je retournerai bientot a Misnk ... enfin je crois...',NULL,3,'2022-10-15 09:02:55.702',NULL,1,0,NULL),(223,'',NULL,1,'2022-10-15 09:37:07.484','Comme disait le Terminator \"I\'ll be back\"...',1,1,NULL),(225,'',NULL,1,'2022-10-15 10:31:47.609','Terminator I et II c\'etait de la bombe ... Apres c\'est au mieux bof ... et au pire catastrophique!!!',1,1,NULL);
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` datetime(3) DEFAULT NULL,
  `avatarUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `signupDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'admin@email.com','$2b$10$w6SvjhWMIt1vu95ApA3WfOn.ngYs4.9asVXtagMynwO8ypKQRrqpS','Ist Trator','Admin','1990-11-07 00:00:00.000','http://localhost:5000/images/users/IMG_1665506100925.gif',1,1,'2022-10-10 06:53:33.421'),(2,'venus@email.com','$2b$10$Htxi1eJOPUjg4HvPRigYnu/JCnReVP8i6kLidcTXDIg2ZXPHRXYy.','Kitty','Venus','2003-08-16 00:00:00.000','http://localhost:5000/images/users/IMG_1665384966429.jpeg',0,1,'2022-10-10 06:55:10.128'),(3,'lovoric@email.com','$2b$10$32k.MjEh7t/O/wKdZdnYBOS61YVljSwwECnUFe7LG3/aB0D.CRf7a','Lovoric','Alexandre','2003-08-16 00:00:00.000','http://localhost:5000/images/users/IMG_1665403994933.jpeg',0,1,'2022-10-10 12:13:15.002'),(4,'anasta@email.com','$2b$10$7bPsZjHgbFpXiyGi/S.CN.9dKysCbyQCAGxszV9bf9GzqAfSKK5tS','Kopylova','Anastasia','2003-08-16 00:00:00.000','http://localhost:5000/images/users/IMG_1665820254445.jpeg',0,1,'2022-10-10 12:14:20.538'),(6,'srgbrr@gregr.rt','$2b$10$IWetN3U3m/UyVV/fg8qGSOrkILoX.8TtwKGYU65rujDwU1sl8Gtdy','Lorovic','Nole','0324-11-12 00:00:00.000','http://localhost:5000/images/users/IMG_1665473692193.jpeg',0,1,'2022-10-11 07:19:14.464'),(15,'aaaaaaaaa@email.com','$2b$10$ut9GfEDgkR7Udqkzihc8F.t8sVEJeTwZiMSwQTcF8pq1B6OxhPZuW','Kopylova','Anastasia','2003-08-16 00:00:00.000','./images/random-user.png',0,1,'2022-10-13 16:23:53.914');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('1145f132-f7f8-4552-a2f1-6681950e10b5','7ff13328173bd4bb9b796f2b936330070751b590ab75b7fea9a0816e7dfd6721','2022-10-12 18:42:08.114','20221012184208_groupomania_db_init',NULL,NULL,'2022-10-12 18:42:08.101',1),('1a056999-87b8-466d-a63a-96a53cebf969','87a54b868c4adb96e4a724e45f62b9ec204369e60f256b73efdbf093f4ae8c8f','2022-10-10 06:52:23.954','20220915121252_groupomania_database',NULL,NULL,'2022-10-10 06:52:23.805',1),('349c647f-d273-42c2-bc8e-f7fa420160fa','879cd3bb40e65fccd3d8185ae08cd5dc388fde9c3d86d6200d90584b896f22fc','2022-10-10 06:52:24.162','20221009062141_groupomania_db_init',NULL,NULL,'2022-10-10 06:52:24.143',1),('3ac528ec-fc19-4c94-bcfc-90488ff0c1f0','6c23deaca49fd02987e268732a1b7c51e6b6788f6bc6484d6d3ee02e1126c65c','2022-10-10 06:52:23.989','20220915153849_groupomania_database',NULL,NULL,'2022-10-10 06:52:23.972',1),('3d62bb74-59af-468e-a766-c3deeefaf50c','36bfe2b5aae64d86f349725ef61bc63ea178ebce6e720c927831a4fdfbe7a1bf','2022-10-10 06:52:24.173','20221010031933_groupomania_db_init',NULL,NULL,'2022-10-10 06:52:24.163',1),('5a36ad5a-13fc-4a85-8ab2-f5c6cf202cbe','b25b5991f44239936ed9f4a8e4a45eaca770cf07ba5b32bc78a5d26a8b11d63c','2022-10-10 06:52:24.191','20221010040701_groupomania_db_init',NULL,NULL,'2022-10-10 06:52:24.174',1),('60095eed-806e-44cb-bdb1-e153fe3afa6a','f8d120db1920f9690e8ebd87f73950e4b0c8141eda491f3fe6f4eab6c887cdc4','2022-10-10 06:52:24.000','20220916050959_groupomania_database',NULL,NULL,'2022-10-10 06:52:23.990',1),('64cdbc12-4711-4afe-b757-9f4424236c80','798f75d2109cb72e84f7e3e61c3175f0ad0e66e1116dc5831115ab4d8ebdc5bd','2022-10-10 06:52:24.231','20221010051655_groupomania_db_init',NULL,NULL,'2022-10-10 06:52:24.220',1),('6f06e60d-1ae9-4ee1-8e75-875940797ff8','fa18f72c8da884d5b0bfd9bbdb6a7dc51f35a2d7e98431ab88f5b016759cce43','2022-10-10 06:52:24.040','20220916060849_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.028',1),('77152301-7052-400e-b5b0-a3afe9edc3e6','a8bc73f532bdd4f94d8f40c3a78507b7ea628f63a699907ea5e2950c30bba8aa','2022-10-10 06:52:24.249','20221010065144_groupomania_db_init',NULL,NULL,'2022-10-10 06:52:24.231',1),('7b41d629-04bd-4a35-91ad-9427dc17b26f','4e1208b9d9c3a72234ad97f636d47c334781273ebbf0703fcecd29f04176e38a','2022-10-10 06:52:23.971','20220915153630_groupomania_database',NULL,NULL,'2022-10-10 06:52:23.955',1),('7f032cf6-0a8e-491e-8307-9d4f925f9668','1e4e06b9cf8413e5800053c2ab4eb768dd2d9d6a94761ab42cdd934e5552a1d6','2022-10-10 06:52:24.142','20220919013711_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.136',1),('a0ac5190-08e8-44da-99ea-d2a0861b9790','75c5f1fab51f021616736aa5b5647ff672cb94f4def386a197b9b8ef8db3bb94','2022-10-10 06:52:24.219','20221010051215_groupomania_db_init',NULL,NULL,'2022-10-10 06:52:24.202',1),('a275fd40-7510-4736-912a-8f37efa64f33','de18d2f3b0d15d0641dd501e4f9962cf97622f036526fd3770935df32e76458b','2022-10-10 06:52:24.065','20220916120055_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.053',1),('a75b1e3e-d637-4007-b265-ad0b3e5d5bd2','6704cd25413f41a5943ebe9d8eae59361a6c5e391166015fcd8a025585ea0146','2022-10-10 06:52:24.201','20221010050106_groupomania_db_init',NULL,NULL,'2022-10-10 06:52:24.192',1),('a87d43d8-aba5-4253-bcf7-bc2a5827d0f4','2963040e4e0cc1f99f5468230287893cf34e2fa1b8a17a9eac82ed4b8568e1ef','2022-10-10 06:52:24.095','20220916130156_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.085',1),('ad2a41fc-f38d-418a-a671-b4b8d75d4df5','becbee1051c0c60e56a95a11fe9f694cdfd4cc9035cc5c183957b2b2dd662d4c','2022-10-10 06:52:24.084','20220916120425_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.066',1),('e4ffa154-20e2-4583-a110-befb680cd7cf','f58b8ffc37cfc74d765113902361dff454b1e010d92613e4bbd0c08b84c7ace2','2022-10-10 06:52:24.027','20220916054025_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.001',1),('e593c7a8-8db1-4776-9d06-b82cdc59de6f','3ca15d9d4d5700e9eb9ec047d5d3a11b320095264b5be3fdd59baff6e99fe368','2022-10-10 06:52:24.115','20220917100139_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.096',1),('e8ce9a0f-035e-43d2-9191-c38865a0fd32','561d113bf3e2558aa331ae590ff7b567d29a365621815cc4b12761f9336217eb','2022-10-10 06:52:23.803','20220915111248_groupomania_database',NULL,NULL,'2022-10-10 06:52:23.687',1),('f28fd77d-4479-4637-9468-724c79e543c3','783c7c9d0c5158ec9e8403dbc7f36c7b07304cb641350c9401d5878b3889b5e4','2022-10-10 06:52:24.134','20220919004028_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.115',1),('f76617c6-9671-4961-b327-2d58dca29261','2be8f495865287d8fb00a6a04e4c7e7b9ade1281742d8e064e36f45bc6f668bd','2022-10-10 06:52:24.052','20220916061643_groupomania_database',NULL,NULL,'2022-10-10 06:52:24.041',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-15 12:37:26
