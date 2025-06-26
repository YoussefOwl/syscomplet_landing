-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           10.4.27-MariaDB - mariadb.org binary distribution
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour cameras_landing_db
CREATE DATABASE IF NOT EXISTS `cameras_landing_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `cameras_landing_db`;

-- Listage de la structure de table cameras_landing_db. actions_logs
CREATE TABLE IF NOT EXISTS `actions_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` bigint(20) unsigned NOT NULL,
  `libelle_log` varchar(255) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `json_log_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `actions_logs_id_user_foreign` (`id_user`),
  CONSTRAINT `actions_logs_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Listage de la structure de table cameras_landing_db. articles
CREATE TABLE IF NOT EXISTS `articles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle_article` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.articles : ~5 rows (environ)
INSERT INTO `articles` (`id`, `libelle_article`, `image`, `description`, `created_at`, `updated_at`) VALUES
	(4, 'HIKVISION Camera Externe IP Fixed Bullet', '4-2025_05_31_10_30_18_18.jpg', NULL, '2025-05-31 08:42:54', '2025-05-31 09:30:18'),
	(6, 'Hikvision Caméra tourelle fixe 8MP 4K 30 m (DS-2CE76U1T-ITMF)', '6-2025_05_31_09_44_56_56.jpg', NULL, '2025-05-31 08:44:56', '2025-05-31 08:44:56'),
	(7, 'Hikvision DS-K1101M Lecteur De Cartes Mifare IP64', '7-2025_05_31_09_47_09_09.webp', NULL, '2025-05-31 08:47:09', '2025-05-31 08:47:09'),
	(9, 'Hikvision DS-2CD2167G2H-LISU(2.8mm)/eF/BLACK 6 MP Smart Hybrid', '9-2025_05_31_09_48_45_45.webp', NULL, '2025-05-31 08:48:45', '2025-05-31 08:48:45'),
	(10, 'ONDULEUR HIKVISION DS-UPS1000(EU) 1000VA|500W - Pc Gamer Casa 9', '10-2025_05_31_10_10_29_29.jpg', 'test 203', '2025-05-31 09:10:29', '2025-05-31 09:10:47');

-- Listage de la structure de table cameras_landing_db. clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle_client` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_libelle_client_unique` (`libelle_client`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.clients : ~6 rows (environ)
INSERT INTO `clients` (`id`, `libelle_client`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Témoignage 1', '<span>L\'intégration du système a nettement amélioré notre efficacité opérationnelle. Sa précision et facilité d\'usage sont essentielles pour notre gestion quotidienne.</span>', '2024-01-10 09:23:36', '2024-02-01 20:13:51', NULL),
	(2, 'Témoignage 2', '<span>Ce système a révolutionné notre gestion du temps, renforçant la discipline et la productivité avec une surveillance en temps réel.</span>', '2024-01-10 09:43:40', '2024-02-01 20:13:58', NULL),
	(3, 'Témoignage 3', '<span>Le support client est réactif et compétent, et le système est intuitif et robuste, répondant parfaitement à nos besoins.</span>', '2024-01-10 09:44:05', '2024-02-01 20:14:05', NULL),
	(4, 'Témoignage 4', '<span>Impressionné par la précision et fiabilité du système. Les rapports détaillés facilitent la prise de décisions basées sur des données fiables.</span>', '2024-01-10 09:44:33', '2024-02-01 20:14:16', NULL),
	(5, 'Témoignage 5', '<span>L\'intégration a été fluide, avec une interface conviviale rapidement adoptée par nos employés, répondant aux besoins de la gestion moderne.</span><span>&nbsp;</span>', '2024-01-10 09:47:10', '2024-02-01 20:14:27', NULL),
	(6, 'Témoignage 6', '<span>Le système offre une solution puissante et abordable, s\'adaptant parfaitement à notre entreprise, un excellent investissement pour notre croissance.</span>', '2024-01-10 09:47:30', '2024-02-01 20:14:35', NULL);

-- Listage de la structure de table cameras_landing_db. contacts
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sujet_contact` int(11) NOT NULL,
  `status_contact` int(11) NOT NULL DEFAULT 1,
  `email_contact` varchar(255) NOT NULL,
  `first_and_last_name` varchar(255) NOT NULL,
  `adresse_ip` varchar(255) NOT NULL,
  `date_contact` date NOT NULL,
  `message_contact` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contact_1` (`date_contact`,`email_contact`),
  UNIQUE KEY `uk_contact_2` (`date_contact`,`first_and_last_name`),
  UNIQUE KEY `uk_contact_3` (`date_contact`,`email_contact`,`adresse_ip`),
  UNIQUE KEY `uk_contact_4` (`date_contact`,`first_and_last_name`,`adresse_ip`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.contacts : ~3 rows (environ)
INSERT INTO `contacts` (`id`, `sujet_contact`, `status_contact`, `email_contact`, `first_and_last_name`, `adresse_ip`, `date_contact`, `message_contact`, `created_at`, `updated_at`) VALUES
	(1, 2, 2, 'test@gmail.com', 'tes test', '172.71.130.190', '2024-02-05', 'ededededededededededed', '2024-02-05 22:53:05', '2024-02-12 09:01:43'),
	(2, 2, 2, 'zhamzi@hlf.ma', 'DS-HLF', '172.64.236.120', '2024-02-09', 'Bonjour\n\nNous sommes un Cabinet d\'avocats international et serions interesses par l\'acquisition d\'un systeme de pointage.\n\nMerci de nous contacter des que possible.', '2024-02-09 07:16:30', '2024-02-12 09:01:47'),
	(3, 2, 2, 'hanan.robio@partners-finances.com', 'ELOAN', '172.64.238.158', '2024-02-09', 'Nous aurions u besoin de pointeuse pour notre société avec reconnaissance faciale, badge ou empreinte', '2024-02-09 09:24:21', '2024-02-14 14:55:29');

-- Listage de la structure de table cameras_landing_db. contenus
CREATE TABLE IF NOT EXISTS `contenus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `html_id` varchar(250) NOT NULL,
  `description_fr` longtext DEFAULT NULL,
  `description_ar` longtext DEFAULT NULL,
  `page_position` varchar(191) DEFAULT NULL,
  `page` varchar(191) DEFAULT NULL,
  `class` varchar(191) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `autre` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contenus_html_id_unique` (`html_id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.contenus : ~116 rows (environ)
INSERT INTO `contenus` (`id`, `html_id`, `description_fr`, `description_ar`, `page_position`, `page`, `class`, `image`, `autre`, `created_at`, `updated_at`) VALUES
	(1, 'bloc_1_app_desc', '<span>Installation de caméras de surveillance.</span>', NULL, 'header', 'landing_page', 'bg-vert', '2025_05_29_12_38_19_19.svg', 'https://www.hikvision.com/fr/', NULL, '2025-05-29 11:38:19'),
	(2, 'text_equipe_1', '<span>Une équipe passionnée, dédiée à l\'innovation dans le domaine de la domotique.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-19 14:44:42', '2025-06-03 12:24:04'),
	(3, 'text_equipe_2', '<span> Des experts en installation de systèmes de sécurité et d\'automatisation des portes.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-19 15:47:00', '2025-06-03 12:24:28'),
	(4, 'text_equipe_3', '<span>Une approche collaborative pour développer des solutions domotiques intuitives.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-19 16:03:55', '2025-06-03 12:24:46'),
	(5, 'text_equipe_4', '<span>Une réactivité exemplaire pour assurer une expérience utilisateur sans faille.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-19 16:06:39', '2025-06-03 12:25:06'),
	(6, 'text_equipe_5', '<span>Un engagement total pour garantir la satisfaction et la sécurité de nos clients.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-19 16:07:46', '2025-06-03 12:25:24'),
	(7, 'contenu_notre_histoire', '<span>Depuis nos débuts, nous avons été guidés par une vision claire : offrir des solutions domotiques qui transforment la sécurité et le confort des maisons. En combinant expertise technologique et innovation, nous avons développé des systèmes fiables pour l\'installation de caméras de surveillance, l\'automatisation des portes, et bien plus encore.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-19 16:16:26', '2025-06-03 12:19:53'),
	(8, 'detail_1_notre_histoire', '<span>Une expertise en domotique pour répondre aux besoins de sécurité et de confort.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-19 16:18:42', '2025-06-03 12:20:53'),
	(9, 'bloc_1_app_title', '<span>Optimisez votre confort et sécurité avec nos solutions de domotique !</span>', NULL, 'header', 'landing_page', 'bg-danger', '9-2025_06_03_17_21_06_06.webp', NULL, '2024-01-19 16:30:45', '2025-06-03 16:21:08'),
	(10, 'bloc_service_desc', '<span>Engagement, satisfaction client, service distinctif.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-19 16:34:18', '2024-03-02 11:35:54'),
	(11, 'text_galerie_1', '<span>Explorez un aperçu visuel de l\'expérience utilisateur fluide et intuitive.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-19 16:53:01', '2024-03-02 11:38:23'),
	(12, 'text_resp_soc_1', '<span>Nous intégrons des pratiques durables dans nos solutions domotiques pour contribuer à un avenir plus sûr et plus respectueux de l\'environnement.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-19 17:07:13', '2025-06-03 12:27:55'),
	(13, 'title_solution_1', '<span>C.R.M d\'opticien</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-31 09:41:03', '2024-05-22 22:10:27'),
	(14, 'desc_solution_1', '<span>Gestion de clients, rendez-vous, prescriptions, et historique d\'achats.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-31 09:41:37', '2024-05-22 22:11:35'),
	(15, 'detail_2_notre_histoire', '<span>Des solutions adaptées pour l\'installation de systèmes de sécurité avancés.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-31 10:09:52', '2025-06-03 12:21:26'),
	(16, 'detail_3_notre_histoire', '<span>Un engagement constant pour l\'innovation et la satisfaction client.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-31 10:10:03', '2025-06-03 12:21:46'),
	(17, 'engagement_qte_1', '<span>La qualité est au cœur de nos solutions domotiques. Chaque système que nous installons, qu\'il s\'agisse de caméras de surveillance, d\'interphones Wi-Fi ou de moteurs pour portes battantes, est conçu pour offrir une performance optimale et une sécurité renforcée.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-31 10:16:05', '2025-06-03 12:22:08'),
	(18, 'engagement_qte_2', '<span>Des systèmes domotiques fiables pour un confort et une sécurité accrus.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-31 10:19:24', '2025-06-03 12:22:31'),
	(19, 'engagement_qte_3', '<span>Une attention méticuleuse aux détails pour garantir des installations de qualité.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-31 10:19:40', '2025-06-03 12:22:49'),
	(20, 'engagement_qte_4', '<span>Des solutions personnalisées pour répondre aux besoins spécifiques de chaque client.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-31 10:19:58', '2025-06-03 12:23:10'),
	(21, 'engagement_qte_5', '<span>Une quête constante d\'excellence pour des systèmes de sécurité performants.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-01-31 10:20:14', '2025-06-03 12:23:29'),
	(22, 'section_1_sevice_title', '<span>Sécurité Renforcée</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-31 14:00:06', NULL),
	(23, 'desc_solution_2', '<span>Suivi des stocks, ventes, achats, et rapports financiers</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-31 15:22:31', '2024-05-22 22:15:30'),
	(24, 'desc_solution_3', '<span>Suivi des clients et fournisseurs (’informations, préférences et historiques des transactions).</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-31 15:23:49', '2024-05-22 22:20:05'),
	(25, 'desc_solution_4', '<span>Gestion de ventes et moyens de paiements</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-31 15:25:40', '2024-05-22 22:31:28'),
	(26, 'desc_solution_5', '<span>Catalogue détaillé produits, génération automatique de codes-barres.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-31 15:25:57', '2024-05-22 22:44:22'),
	(27, 'desc_solution_6', '<span>Suivi et rapports détaillés du stock théorique et inventaires.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-31 15:26:49', '2024-05-22 22:46:41'),
	(28, 'section_1_service_desc', '<span>La sécurité est au cœur de notre système. Avec un chiffrement SSL et des protocoles de sécurité rigoureux, nous protégeons vos données sensibles contre les menaces externes.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:46:04', '2024-05-22 20:11:30'),
	(29, 'section_2_sevice_title', '<span>Rapidité Incomparable</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:49:07', NULL),
	(30, 'section_2_service_desc', '<span>Nos systèmes se distinguent par leur rapidité exceptionnelle, assurant une expérience utilisateur fluide et sans délai.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:49:37', '2024-05-22 20:36:05'),
	(31, 'section_3_sevice_title', '<span>Flexibilité Cloud avec Mode SAS</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:49:49', NULL),
	(32, 'section_4_sevice_title', '<span>Disponibilité H24</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:57:09', NULL),
	(33, 'section_4_service_desc', '<span>Notre système garantit une haute disponibilité, assurant un accès constant aux données.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:57:33', '2024-05-22 20:38:17'),
	(34, 'section_5_sevice_title', '<span>Sauvegarde Automatisée</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:57:43', NULL),
	(35, 'section_5_service_desc', '<span>Éliminez les soucis liés à la perte de données grâce à nos procédures de sauvegarde automatique.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:58:22', '2024-02-01 19:58:35'),
	(36, 'section_6_sevice_title', '<span>Chiffrement SSL Avancés</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 19:58:50', NULL),
	(37, 'section_6_service_desc', '<span>Nous utilisons le chiffrement SSL pour sécuriser les communications et protéger vos données contre toute interception.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 20:00:35', NULL),
	(38, 'section_3_service_desc', '<span>Bénéficiez de la flexibilité ultime avec notre système en mode SAS sur le cloud.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 20:01:25', NULL),
	(39, 'contenu_nos_services_desc', '<span>Bienvenue dans notre univers dédié à la domotique et aux solutions de sécurité avancées. Nous sommes spécialisés dans l\'installation de caméras de surveillance, interphones Wi-Fi, systèmes téléphoniques standards, et moteurs pour portes battantes. Notre mission est d\'améliorer le confort et la sécurité de votre maison grâce à des systèmes domotiques innovants, alliant automatisation des portes et installation de dispositifs de sécurité performants.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2024-02-01 20:02:30', '2025-06-03 12:19:13'),
	(40, 'desc_temoignages', '<span>Découvrez les expériences de nos clients à travers leurs témoignages</span><span>                        inspirants. Plongez dans des</span><span>                        récits authentiques de commandes réussies, de délicieux repas livrés à temps, et de moments de</span><span>                        satisfaction partagés.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 20:58:34', NULL),
	(41, 'faq_desc', '<span>Trouvez rapidement des réponses à vos interrogations les plus courantes. Explorez</span><span>                        nos informations claires et concise pour optimiser votre expérience. Si vous ne trouvez pas ce</span><span>                        que vous cherchez, n\'hésitez pas à nous contacter.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:01:39', NULL),
	(42, 'faq_q_1', '<span><strong>Comment accéder à la solution de gestion de présences ?</strong></span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:08:14', NULL),
	(43, 'faq_q_2', '<span><strong>Peut-on personnaliser les paramètres de pointage ?</strong></span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:08:34', NULL),
	(44, 'faq_q_3', '<span><strong>Comment gérer les congés et absences ?</strong></span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:09:04', NULL),
	(45, 'faq_q_4', '<span><strong>Est-ce que la plateforme est sécurisée ?</strong></span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:09:24', NULL),
	(46, 'faq_q_5', '<span><strong>Comment obtenir de l\'aide en cas de problème ?</strong></span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:09:49', NULL),
	(47, 'footer_adresse', '<span>Casablanca</span><span>                                20000</span>', NULL, 'footer', 'landing_page', NULL, NULL, NULL, '2024-02-01 21:11:10', '2025-05-31 10:37:57'),
	(48, 'footer_phone', '<span>0619261261</span>', NULL, 'footer', 'landing_page', NULL, NULL, NULL, '2024-02-01 21:11:40', '2025-05-31 11:11:57'),
	(49, 'footer_mail', '<span>contact@cameras.ma</span>', NULL, 'footer', 'landing_page', NULL, NULL, NULL, '2024-02-01 21:11:58', '2025-05-31 11:13:59'),
	(50, 'reponse_faq_1', '<span>Connectez vous via notre site web ou appli. Un guide d\'utilisation est disponible pour faciliter votre démarrage.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:13:30', NULL),
	(51, 'reponse_faq_2', '<span>Oui, notre système permet une personnalisation complète pour répondre à vos besoins spécifiques de pointage.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:13:48', NULL),
	(52, 'reponse_faq_3', '<span>Utilisez notre module de gestion dédié pour suivre et approuver facilement les demandes de congés et absences.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:13:59', NULL),
	(53, 'reponse_faq_4', '<span>Absolument, la sécurité est notre priorité. Nous utilisons des protocoles avancés pour protéger vos données.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:14:11', NULL),
	(54, 'reponse_faq_5', '<span>Notre support technique est disponible 24/7. Contactez nous via le chat, email, ou téléphone pour une assistance rapide.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-01 21:14:30', NULL),
	(55, 'title_solution_2', '<span>Gestion de boutiques</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:07:10', '2024-05-22 22:14:29'),
	(56, 'title_solution_3', '<span><strong>Gestion clients et fournisseurs</strong></span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:07:31', '2024-05-22 22:19:00'),
	(57, 'title_solution_4', '<span>Gestion de ventes et moyens de paiements</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:07:50', '2024-05-22 22:23:26'),
	(58, 'title_solution_5', '<span><strong>Gestion d’articles avec codes à barres</strong></span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:08:05', '2024-05-22 22:41:24'),
	(59, 'title_solution_6', '<span>Gestion de stock et Inventaires</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:08:55', '2024-05-22 22:45:33'),
	(60, 'title_solution_7', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:09:13', '2024-05-22 22:23:12'),
	(61, 'title_solution_8', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:09:24', '2024-05-22 22:45:16'),
	(62, 'title_solution_9', '<span>Notes de frais<br> </span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:09:37', '2024-03-02 10:16:30'),
	(63, 'desc_solution_7', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:11:09', '2024-05-22 22:23:57'),
	(64, 'desc_solution_8', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:11:26', '2024-05-22 22:46:26'),
	(65, 'desc_solution_9', '<span>Simple et efficace, le suivi et l\'approbation deviennent fluides avec notre système.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-02 10:11:48', '2024-03-02 09:49:07'),
	(66, 'desc_reseaux_sociaux', '<span>Suivez-nous pour des actualités exclusives et des mises à jour ! Rejoignez notre communauté en ligne.</span>', NULL, 'footer', 'landing_page', NULL, NULL, NULL, '2024-02-02 21:25:02', '2025-05-31 10:44:37'),
	(67, 'main_mail', '<span>contact@cameras.ma</span>', NULL, 'header', 'landing_page', NULL, NULL, NULL, '2024-02-03 11:30:01', '2025-05-31 11:14:22'),
	(68, 'bloc_politique', '<span>Bienvenue sur <strong>www.cameras.ma</strong>, un site web dédié aux solutions innovantes et efficaces en domotique, installation de caméras de surveillance, interphones Wi-Fi, systèmes téléphoniques standards, moteurs pour portes battantes, sécurité maison, automatisation de portes, et bien plus encore. Notre engagement envers la confidentialité et la sécurité des données est une priorité absolue. Cette Politique de Confidentialité décrit en détail comment nous recueillons, utilisons, partageons et protégeons vos informations personnelles. Veuillez noter que notre présence officielle en ligne se limite à <strong>www.cameras.ma</strong>.</span><ol><li><strong>Collecte et Utilisation des Informations</strong></li></ol><span>Lorsque vous utilisez notre site, nous pouvons recueillir les types d\'informations suivants :</span><ul><li>Informations fournies par l\'utilisateur : Cela peut inclure des informations que vous fournissez lors de l\'inscription à nos services, comme votre nom, adresse e-mail, numéro de téléphone, et les informations relatives à vos besoins en domotique, installation de caméras de surveillance, interphones Wi-Fi, systèmes téléphoniques standards, moteurs pour portes battantes, ou autres solutions de sécurité et d\'automatisation.</li><li>Informations de connexion et d\'utilisation : Nous recueillons des informations sur votre interaction avec nos sites, telles que les adresses IP, les pages visitées, les horodatages de connexion et les données de navigation.</li><li>Cookies et technologies similaires : Nous utilisons des cookies et d\'autres technologies de suivi pour améliorer votre expérience de navigation, personnaliser le contenu et les publicités, analyser le trafic du site et comprendre d\'où viennent nos visiteurs.</li><li>Fournir, exploiter et maintenir nos services</li><li>Améliorer, personnaliser et élargir nos services</li><li>Comprendre et analyser comment vous utilisez notre site</li><li>Développer de nouveaux produits, services, fonctionnalités et solutions domotiques</li><li>Communiquer avec vous, directement ou par l\'intermédiaire de l\'un de nos partenaires, y compris pour le service client, pour vous fournir des mises à jour et d\'autres informations relatives au site web, et à des fins de marketing et de promotion liées à la domotique, la sécurité et le confort de votre maison.</li></ul><ol><li><strong>Partage et Divulgation des Informations</strong></li></ol><ul><li>Respect des lois : Nous pouvons divulguer vos informations lorsque cela est requis par la loi ou pour répondre à des demandes légales ou des procédures judiciaires.</li><li>Partenaires de service : Nous pouvons partager vos informations avec des tiers qui nous fournissent des services, tels que l\'installation de systèmes domotiques, de caméras de surveillance, d\'interphones Wi-Fi, de systèmes téléphoniques standards, de moteurs pour portes battantes, et d\'autres solutions liées à la sécurité et au confort de votre maison.</li></ul><ol><li><strong>Sécurité des Données</strong></li></ol><ul><li>La sécurité de votre maison et votre confort sont notre priorité. Nous nous engageons à fournir des solutions domotiques fiables, telles que l\'installation de caméras de surveillance, d\'interphones Wi-Fi, de systèmes téléphoniques standards, de moteurs pour portes battantes, et bien plus encore. Grâce à nos systèmes d\'automatisation et de sécurité, nous réduisons les risques tout en améliorant votre confort. Cependant, veuillez noter qu\'aucune méthode de transmission sur Internet ou méthode de stockage électronique n\'est 100% sécurisée.</li></ul><ol><li><strong>Droits de Confidentialité</strong></li></ol><ul><li>Vous avez des droits spécifiques concernant vos données personnelles, y compris le droit de demander l\'accès, la correction ou la suppression de vos données personnelles que nous détenons. En outre, vous avez le droit de vous opposer au traitement de vos données personnelles, de demander la limitation du traitement de vos données et de demander la portabilité de vos données. Ces droits s\'appliquent également aux informations collectées dans le cadre de nos services liés à la domotique, l\'installation de caméras de surveillance, les interphones Wi-Fi, les systèmes téléphoniques standards, les moteurs pour portes battantes, la sécurité de la maison, l\'automatisation des portes, et toutes nos solutions visant à améliorer le confort et la sécurité de votre domicile.</li></ul><ol><li><strong>Politiques de Confidentialité des Tiers</strong></li></ol><ul><li>Notre site peut contenir des liens vers des sites externes liés à la domotique, l\'installation de caméras de surveillance, les interphones Wi-Fi, les systèmes téléphoniques standards, les moteurs pour portes battantes, et d\'autres solutions de sécurité et d\'automatisation. Veuillez noter que nous n\'avons aucun contrôle sur le contenu et les pratiques de ces sites et ne pouvons accepter de responsabilité pour leurs politiques de confidentialité respectives.</li></ul><ol><li><strong>Modifications de cette Politique de Confidentialité</strong></li></ol><ul><li>Nous pouvons mettre à jour notre Politique de Confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle Politique de Confidentialité sur cette page et en mettant à jour la date de "dernière mise à jour" en haut de cette Politique de Confidentialité.</li><li>Si vous avez des questions ou des suggestions concernant notre Politique de Confidentialité ou nos services liés à la domotique, l\'installation de caméras de surveillance, les interphones Wi-Fi, les systèmes téléphoniques standards, les moteurs pour portes battantes, ou toute autre solution pour le confort et la sécurité de votre maison, n\'hésitez pas à nous contacter.</li></ul>', NULL, 'body', 'privacy', NULL, NULL, NULL, '2024-02-03 19:10:05', '2025-06-05 08:46:21'),
	(69, 'bloc_terms', '<span>Bienvenue sur <strong>www.cameras.ma </strong>En accédant à notre site web et en utilisant notre service, vous acceptez d\'être lié par les présents Termes et Conditions. Si vous n\'acceptez pas tous les termes et conditions de cet accord, vous ne pourrez pas accéder au site web ni utiliser ses services.</span><ol><li> <ul><li>Les contenus présents sur www.cameras.ma, y compris, sans limitation, les textes, logiciels, scripts, graphiques, photos, sons, musiques, vidéos, et fonctionnalités interactives, ainsi que les marques, services marks et logos y contenants, sont la propriété de www.cameras.ma ou des titulaires de licence et sont protégés par les lois sur les droits d\'auteur, les marques et autres droits de propriété intellectuelle.</li></ul></li><li> <ul><li>Votre utilisation de www.cameras.ma est également régie par notre Politique de Confidentialité, disponible sur notre site web.</li></ul></li><li> <ul><li>Nous nous réservons le droit de modifier ou d\'interrompre notre service à tout moment, avec ou sans préavis.</li></ul></li><li> <ul><li>En aucun cas, www.cameras.ma, ni ses directeurs, employés, partenaires, agents, fournisseurs ou affiliés, ne pourront être tenus responsables pour tout dommage indirect, incident, spécial, consécutif ou punitif, y compris sans limitation, la perte de profits, de données, d\'utilisation, de bonne volonté, ou d\'autres pertes intangibles.</li></ul></li><li> <ul><li>Vous acceptez d\'indemniser et de dégager de toute responsabilité www.cameras.ma et ses dirigeants, employés, et agents, de et contre toute plainte, charge, dommage, coût et dépense, y compris les honoraires d\'avocats, découlant de votre utilisation du service ou de la violation de ces Termes.</li></ul></li><li> <ul><li>Ces Termes seront régis et interprétés conformément aux lois du pays dans lequel www.cameras.ma est basé, sans égard à son conflit de dispositions légales.</li></ul></li><li> <ul><li>Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces Termes à tout moment. Si une révision est importante, nous essaierons de fournir un préavis d\'au moins 30 jours avant que de nouveaux termes ne prennent effet.</li></ul></li></ol><span>Si vous avez des questions ou des suggestions concernant notre Politique de Confidentialité, n\'hésitez pas à nous contacter.</span>', NULL, 'body', 'terms', NULL, NULL, NULL, '2024-02-03 21:09:06', '2025-06-05 10:05:28'),
	(70, 'title_solution_10', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-11 21:17:43', '2024-05-22 22:14:18'),
	(71, 'desc_solution_10', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-11 21:18:10', '2024-05-22 22:17:51'),
	(72, 'title_solution_11', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-11 21:23:30', '2024-05-22 22:10:54'),
	(73, 'desc_solution_11', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-11 21:24:09', '2024-05-22 22:12:37'),
	(74, 'title_solution_12', '<span>                                Solution de gestion d\'entreprise</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-11 21:26:06', '2024-03-02 09:35:54'),
	(75, 'desc_solution_12', '<span>Intégration des ressources humaines, finances, opérations et stratégies de vente.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-11 21:26:57', '2024-03-02 10:18:59'),
	(76, 'header_phone', '<span>0619261261</span>', NULL, 'header', 'landing_page', NULL, NULL, NULL, '2024-02-11 22:21:28', '2025-05-31 11:15:17'),
	(77, 'bloc_equipements_desc', '<span>Une Sélection de pointeuses avancées, qui offre une gestion sécurisée et efficace du temps et du contrôle d\'accès, grâce à la reconnaissance faciale, aux empreintes digitales et aux badges. Idéales pour les entreprises modernes désireuses d\'améliorer leur productivité et sécurité.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-12 09:04:07', '2024-02-12 13:51:33'),
	(78, 'ss_desc_solution_1', '<span>Le module C.R.M (Customer Relationship Management) pour opticiens est spécifiquement conçu pour améliorer les interactions avec les clients dans le secteur de l\'optique. Il permet de gérer de manière centralisée les informations des clients, y compris leurs prescriptions et historiques d\'achats, ce qui facilite un service personnalisé et efficace. Le système facilite la prise et la gestion des rendez-vous, assurant ainsi que les clients reçoivent une attention opportune et adaptée à leurs besoins. De plus, il permet aux opticiens de suivre les prescriptions et les ajustements des lunettes ou lentilles, garantissant que les clients reçoivent les produits les plus adaptés à leur vision. Le CRM peut également intégrer des rappels pour les contrôles de vue réguliers et les renouvellements de prescriptions, améliorant ainsi la fidélisation des clients. Enfin, il fournit des outils d\'analyse pour évaluer les tendances d\'achat et les préférences des clients, permettant des campagnes de marketing ciblées et efficaces.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:17:21', '2024-05-22 22:12:06'),
	(79, 'ss_desc_solution_2', '<span>Ce module offre une solution complète pour la gestion quotidienne des boutiques. Il permet aux utilisateurs de surveiller et de contrôler efficacement leurs inventaires, en veillant à ce que les niveaux de stock soient optimisés pour répondre à la demande sans occasionner de surplus coûteux. Les fonctionnalités de suivi des ventes permettent une analyse précise des performances des produits, facilitant ainsi des décisions d\'achat et de promotion basées sur des données. Le système prend également en charge la gestion des achats, aidant à négocier les meilleurs prix auprès des fournisseurs tout en automatisant la commande et la réception des stocks. Les rapports financiers intégrés offrent une vue d\'ensemble claire de la santé financière de la boutique, permettant un suivi des revenus, des coûts et des bénéfices. Cela est essentiel pour une planification stratégique et une allocation efficace des ressources. En somme, ce module est conçu pour optimiser les opérations de vente au détail, améliorer l\'efficacité et augmenter la rentabilité.<br> </span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:22:14', '2024-05-22 22:17:22'),
	(80, 'ss_desc_solution_3', '<span>Ce module est essentiel pour toute entreprise cherchant à optimiser ses relations commerciales. Il permet une gestion centralisée des informations relatives aux clients et aux fournisseurs, facilitant ainsi l\'accès et la mise à jour des données. Les fonctionnalités incluent le suivi des interactions avec les clients, l\'historique des achats, les préférences et les retours, ainsi que la gestion des contrats, des commandes et des factures avec les fournisseurs. Cela permet non seulement d\'améliorer la satisfaction et la fidélisation des clients en proposant des services et des produits plus personnalisés, mais aussi de renforcer les partenariats avec les fournisseurs grâce à une meilleure coordination et communication.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:22:30', '2024-05-22 22:20:48'),
	(81, 'ss_desc_solution_4', '<span><strong>Gestion de ventes et moyens de paiement</strong>: Ce module permet une gestion complète des processus de vente, de la proposition au paiement. Il facilite le suivi des commandes, la facturation, et l\'enregistrement des transactions, assurant une expérience client fluide. Les utilisateurs peuvent configurer différents moyens de paiement, tels que cartes de crédit, virements bancaires, ou paiements en ligne, offrant ainsi flexibilité et commodité aux clients. Le module permet également de gérer les promotions, les remises et les conditions de paiement, adaptant les offres aux besoins des clients pour améliorer les taux de conversion.En outre, il offre des outils d\'analyse pour suivre les tendances des ventes, évaluer la performance des produits, et comprendre le comportement des clients, permettant une stratégie de vente informée et ciblée. La gestion des retours et des remboursements est également intégrée, garantissant une résolution efficace des problèmes et la satisfaction des clients.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:22:50', '2024-05-22 22:31:10'),
	(82, 'ss_desc_solution_5', '<span>Ce module révolutionne la manière dont les entreprises gèrent leur inventaire en utilisant la technologie des codes à barres pour un suivi précis et efficace des articles. Il permet aux utilisateurs d\'enregistrer, de suivre et de gérer les données des articles de manière automatisée, réduisant ainsi les erreurs humaines et économisant un temps précieux. Les fonctionnalités incluent l\'enregistrement rapide des entrées et sorties de stock, la vérification des niveaux de stock en temps réel, et la génération automatique de commandes de réapprovisionnement lorsque les stocks atteignent un seuil prédéfini.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:23:03', '2024-05-22 22:43:26'),
	(83, 'ss_desc_solution_6', '<span>Ce module est conçu pour optimiser la gestion des stocks et faciliter la réalisation des inventaires. Il permet aux entreprises de maintenir le niveau de stock idéal, en évitant à la fois les ruptures de stock et les excédents coûteux. Les fonctionnalités incluent le suivi en temps réel des entrées et des sorties de marchandises, la planification des réapprovisionnements basée sur les prévisions de vente, et l\'identification rapide des articles obsolètes ou moins performants.Avec des outils d\'inventaire précis, les entreprises peuvent effectuer des comptages réguliers et des audits de stock, assurant l\'exactitude des données et minimisant les différences de stock. Le module offre également la possibilité de catégoriser les articles, de suivre les lots ou les numéros de série, et de gérer les emplacements de stockage pour une récupération et une allocation efficaces des ressources.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:23:36', '2024-05-22 22:47:12'),
	(84, 'ss_desc_solution_7', '<span><br><strong>Gestion de ventes et moyens de paiement</strong>: Ce module permet une gestion complète des processus de vente, de la proposition au paiement. Il facilite le suivi des commandes, la facturation, et l\'enregistrement des transactions, assurant une expérience client fluide. Les utilisateurs peuvent configurer différents moyens de paiement, tels que cartes de crédit, virements bancaires, ou paiements en ligne, offrant ainsi flexibilité et commodité aux clients. Le module permet également de gérer les promotions, les remises et les conditions de paiement, adaptant les offres aux besoins des clients pour améliorer les taux de conversion.</span><span>En outre, il offre des outils d\'analyse pour suivre les tendances des ventes, évaluer la performance des produits, et comprendre le comportement des clients, permettant une stratégie de vente informée et ciblée. La gestion des retours et des remboursements est également intégrée, garantissant une résolution efficace des problèmes et la satisfaction des clients.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:23:49', '2024-03-02 11:25:58'),
	(85, 'ss_desc_solution_8', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:24:10', '2024-05-22 22:47:30'),
	(86, 'ss_desc_solution_9', '<span>Ce module simplifie et automatise la gestion des notes de frais pour les employés et la comptabilité. Il permet aux utilisateurs de soumettre rapidement leurs dépenses via une interface utilisateur intuitive, en joignant des reçus et en catégorisant les dépenses selon des normes prédéfinies. Les gestionnaires peuvent ensuite examiner et approuver les demandes en temps réel, accélérant le processus de remboursement tout en maintenant un contrôle rigoureux sur les dépenses de l\'entreprise.</span><span>Le module intègre des fonctionnalités de rapport et d\'analyse pour suivre les tendances des dépenses, identifier les domaines d\'économies potentielles, et assurer la conformité avec les politiques de l\'entreprise et les réglementations fiscales. Les règles personnalisables permettent d\'automatiser la vérification des notes de frais, réduisant les erreurs et les fraudes.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:24:25', '2024-03-02 11:32:58'),
	(87, 'ss_desc_solution_10', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:24:42', '2024-05-22 22:17:01'),
	(88, 'ss_desc_solution_11', '<span>vide</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:25:04', '2024-05-22 22:12:19'),
	(89, 'ss_desc_solution_12', '<span><br>Cette solution est conçue pour offrir une vue holistique et intégrée de toutes les opérations d\'entreprise. Elle englobe les modules de ressources humaines, de finance, d\'opérations et de stratégies de vente, offrant ainsi une plateforme unifiée pour la planification et la gestion. Le module de ressources humaines facilite la gestion des employés, de la paie, des avantages sociaux et de la conformité réglementaire. La section financière fournit des outils pour la comptabilité, la budgétisation, et les rapports financiers, aidant les entreprises à garder un œil sur leur santé financière et à prendre des décisions éclairées. Le volet des opérations permet de surveiller et d\'optimiser les processus de production, de distribution et de service, tandis que le module de stratégies de vente aide à analyser les tendances du marché, à gérer les relations clients et à élaborer des stratégies de vente efficaces. Ensemble, ces fonctionnalités offrent une gestion d\'entreprise intégrée, aidant à améliorer l\'efficacité, à réduire les coûts et à augmenter les profits.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:27:22', '2024-03-02 11:22:54'),
	(90, 'ss_bloc_1_app_title', '<span>Les solutions que nous proposons</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:45:54', '2024-02-24 17:58:39'),
	(91, 'ss_bloc_1_app_desc', '<span>Nos solutions offrent des interfaces intuitives pour simplifier la gestion de votre entreprise vis des rapports et KPI et bien plus !</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:46:21', '2024-03-02 11:15:04'),
	(92, 'srv_bloc_1_app_title', '<span>Sécurité, Rapidité, Flexibilité et Disponibilité</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:47:39', NULL),
	(93, 'srv_bloc_1_app_desc', '<span>Bienvenue à nos services de pointe. Bénéficiez d\'une sécurité renforcée avec une surveillance en temps réel et une protection contre les menaces. Profitez d\'une rapidité incomparable et d\'une disponibilité 24h/24 grâce à notre flexibilité cloud avec mode SAS. Assurez la continuité de vos opérations avec une sauvegarde automatisée fiable.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:48:38', NULL),
	(94, 'srv_bloc_service_desc', '<span>Bienvenue chez nous ! Nous sommes fiers de vous offrir une gamme complète de services conçus pour répondre à vos besoins les plus exigeants. Avec notre sécurité renforcée, vous pouvez dormir sur vos deux oreilles, sachant que vos données sont entre de bonnes mains. Notre rapidité incomparable vous permettra de rester en tête de la concurrence, tandis que notre flexibilité cloud et notre mode SAS vous offrent la liberté de travailler où et quand vous le souhaitez. </span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:53:53', '2024-02-24 17:51:50'),
	(95, 'srv_section_1_service_desc', '<span>Notre service de sécurité renforcée offre une protection avancée contre les menaces cybernétiques. Grâce à des mesures de sécurité robustes telles que la surveillance en temps réel, la détection proactive des menaces et la gestion des vulnérabilités, nous assurons la sécurité de vos données sensibles et la confidentialité de vos informations.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:54:22', NULL),
	(96, 'srv_section_2_service_desc', '<span>Bénéficiez d\'une vitesse inégalée avec nos solutions optimisées pour des performances exceptionnelles. Que ce soit pour le traitement des données, le chargement des pages web ou l\'accès aux applications, notre infrastructure rapide garantit une expérience utilisateur fluide et efficace, vous permettant ainsi de gagner du temps et d\'optimiser vos processus.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:54:44', NULL),
	(97, 'srv_section_3_service_desc', '<span>Profitez de la flexibilité du cloud avec notre mode Software as a Service (SaaS). Notre plateforme cloud offre une infrastructure évolutive et hautement adaptable, vous permettant de mettre en œuvre rapidement de nouvelles fonctionnalités, d\'ajuster vos ressources en fonction de vos besoins et de bénéficier d\'une gestion simplifiée et centralisée de vos applications.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:55:00', NULL),
	(98, 'srv_section_4_service_desc', '<span>Assurez la continuité de vos opérations avec notre service disponible 24 heures sur 24, 7 jours sur 7. Que ce soit pour répondre aux besoins de vos clients, gérer des situations d\'urgence ou assurer la surveillance de vos systèmes, notre équipe est toujours là pour vous fournir un support et une assistance fiables, garantissant ainsi une disponibilité maximale de vos services.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:55:25', NULL),
	(99, 'srv_section_5_service_desc', '<span>Protégez vos données critiques avec notre solution de sauvegarde automatisée. En automatisant le processus de sauvegarde et de récupération des données, nous vous offrons une tranquillité d\'esprit totale, vous permettant de restaurer rapidement vos données en cas de sinistre ou de perte, et de garantir ainsi la continuité de vos activités.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:56:10', NULL),
	(100, 'srv_section_6_service_desc', '<span>Nos solutions de chiffrement SSL avancées offrent une protection de haut niveau pour vos données sensibles. En utilisant des algorithmes de chiffrement robustes et des certificats SSL de confiance, nous assurons la sécurité des échanges de données entre votre site web et vos utilisateurs. Avec une sécurité renforcée, vous pouvez garantir la confidentialité et l\'intégrité de vos informations, renforçant ainsi la confiance de vos clients et la réputation de votre entreprise.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 20:56:41', NULL),
	(101, 'about_bloc_1_app_title', '<span>Optimisez votre gestion d\'entreprise</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 23:11:37', '2024-03-02 11:08:00'),
	(102, 'about_bloc_1_app_desc', '<span> Bienvenue dans notre solution intégrée de gestion d\'entreprise qui combine RH, ERP, et CRM</span><span>                            en un seul système,</span><span>                            facilitant la gestion et l\'optimisation des processus d\'affaires. Simplifiez les opérations,</span><span>                            améliorez l\'efficacité et accélérez la croissance avec notre plateforme tout-en-un,</span><span>                            conçue pour réduire les coûts et augmenter la satisfaction client.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-18 23:11:57', '2025-05-28 11:58:46'),
	(103, 'faq_q_0', '<span>Si j\'ai une pointeuse ZKTeco, est-il possible d\'utiliser le système sans avoir à acheter une autre ?</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-28 15:02:50', NULL),
	(104, 'reponse_faq_0', '<span>Oui, il est possible d\'intégrer facilement votre pointeuse ZKTeco existante au système en quelques clics.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-28 15:04:04', NULL),
	(105, 'bloc_2_app_desc', '<span>Interphones Wi-Fi.</span>', NULL, 'header', 'landing_page', NULL, '2025_05_29_12_49_48_48.svg', NULL, '2024-03-01 15:39:31', '2025-05-29 11:49:48'),
	(106, 'bloc_3_app_desc', '<span>Systèmes téléphoniques standards.</span>', NULL, 'header', 'landing_page', NULL, '2025_05_29_12_50_42_42.svg', NULL, '2024-03-01 15:39:59', '2025-05-29 11:50:42'),
	(107, 'bloc_4_app_desc', '<span> Moteurs pour portes battantes.</span>', NULL, 'header', 'landing_page', NULL, '2025_05_29_12_55_36_36.svg', NULL, '2024-03-01 15:40:36', '2025-05-29 11:55:36'),
	(108, 'text_galerie_2', '<span>Découvrez une représentation visuelle de notre interface utilisateur intuitive et fluide.</span>', NULL, NULL, NULL, NULL, NULL, NULL, '2024-03-02 12:09:07', NULL),
	(109, 'bloc_5_app_desc', '<span>Services adaptés à vos besoins pour une maison connectée et sécurisée.</span>', NULL, 'header', 'landing_page', NULL, '2025_05_29_12_55_03_03.svg', NULL, '2024-05-25 11:09:23', '2025-05-29 11:55:03'),
	(113, 'link_facebook', NULL, NULL, 'footer', 'landing_page', NULL, NULL, 'http://cameras.ma/', '2025-05-31 11:04:34', NULL),
	(114, 'link_instagram', NULL, NULL, 'footer', 'landing_page', NULL, NULL, 'https://cameras.ma/', '2025-05-31 11:05:24', '2025-05-31 11:06:25'),
	(115, 'text_resp_soc_2', '<span>Découvrez comment nos initiatives en matière de durabilité et de responsabilité sociale renforcent notre engagement envers la sécurité et le confort de nos clients.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2025-06-03 12:29:15', '2025-06-03 12:32:56'),
	(116, 'text_resp_soc_3', '<span> Des pratiques durables pour des solutions domotiques respectueuses de l\'environnement.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2025-06-03 12:30:05', '2025-06-03 12:33:52'),
	(117, 'text_resp_soc_4', '<span>Un impact positif sur les communautés grâce à des systèmes de sécurité avancés.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2025-06-03 12:30:29', '2025-06-03 12:34:08'),
	(118, 'text_resp_soc_5', '<span>Une responsabilité sociale intégrée dans chaque solution que nous proposons.</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2025-06-03 12:30:52', '2025-06-03 12:34:24'),
	(119, 'desc_contactez_nous', '<span>Besoin d\'aide ou de nous contacter ? Utilisez le formulaire ci-dessous</span><span>                        pour nous joindre. Notre équipe se fera un plaisir de répondre à vos questions, préoccupations</span><span>                        ou commentaires. Merci de</span><span>                        choisir notre service – nous sommes là pour vous !</span>', NULL, 'body', 'about', NULL, NULL, NULL, '2025-06-03 12:31:36', NULL);

-- Listage de la structure de table cameras_landing_db. fournisseurs
CREATE TABLE IF NOT EXISTS `fournisseurs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle_fournisseur` varchar(255) NOT NULL,
  `image_fournisseur` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.fournisseurs : ~5 rows (environ)
INSERT INTO `fournisseurs` (`id`, `libelle_fournisseur`, `image_fournisseur`, `description`, `created_at`, `updated_at`) VALUES
	(2, 'anytel', '2-2025_05_30_13_00_24_24.png', NULL, '2025-05-30 11:20:36', '2025-05-30 12:00:24'),
	(4, 'marjan', '4-2025_05_30_12_25_55_55.png', NULL, '2025-05-30 11:25:55', '2025-05-30 11:25:55'),
	(5, 'biougnach', '5-2025_06_05_13_35_33_33.png', NULL, '2025-06-05 12:35:33', '2025-06-05 12:35:33'),
	(6, 'Fnak', '6-2025_06_05_13_36_18_18.png', NULL, '2025-06-05 12:36:18', '2025-06-05 12:36:18'),
	(7, 'xiaomi', '7-2025_06_05_13_37_34_34.png', NULL, '2025-06-05 12:37:34', '2025-06-05 12:37:34');

-- Listage de la structure de table cameras_landing_db. marques
CREATE TABLE IF NOT EXISTS `marques` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle_marque` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.marques : ~7 rows (environ)
INSERT INTO `marques` (`id`, `libelle_marque`, `image`, `description`, `created_at`, `updated_at`) VALUES
	(1, 'hikvision', '1-2025_06_05_13_22_33_33.png', 'test 123456', '2025-06-05 12:09:39', '2025-06-05 12:22:33'),
	(2, 'dahua', '2-2025_06_05_13_23_20_20.png', NULL, '2025-06-05 12:23:20', '2025-06-05 12:23:20'),
	(3, 'zkteco', '3-2025_06_05_13_24_21_21.png', NULL, '2025-06-05 12:24:21', '2025-06-05 12:24:21'),
	(4, 'lenovo', '4-2025_06_05_13_25_07_07.png', NULL, '2025-06-05 12:25:07', '2025-06-05 12:25:07'),
	(6, 'D-link', '6-2025_06_05_13_39_33_33.png', NULL, '2025-06-05 12:39:33', '2025-06-05 12:39:33'),
	(7, 'tp-link', '7-2025_06_05_13_40_12_12.png', NULL, '2025-06-05 12:40:12', '2025-06-05 12:40:12'),
	(8, 'Razer', '8-2025_06_05_13_41_21_21.png', NULL, '2025-06-05 12:41:21', '2025-06-05 12:41:21');

-- Listage de la structure de table cameras_landing_db. migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.migrations : ~13 rows (environ)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2020_01_01_132512_create_roles_table', 1),
	(2, '2020_12_26_161026_create_users_table', 1),
	(3, '2020_12_13_204220_create_villes_table', 2),
	(4, '2020_12_30_160221_create_actions_logs_table', 2),
	(5, '2024_01_06_000204_create_contenus_table', 2),
	(6, '2021_01_22_113609_create_partenaires_table', 3),
	(7, '2020_12_13_204221_create_clients_table', 4),
	(9, '2024_01_10_140016_create_contacts_table', 5),
	(10, '2024_01_17_211738_create_newsletters_table', 6),
	(11, '2025_05_28_113342_add_columns_to_contenus', 7),
	(12, '2025_05_28_162010_create_fournisseurs_table', 8),
	(13, '2025_05_30_162228_create_articles_table', 9),
	(14, '2025_06_05_121124_create_marques_table', 10);

-- Listage de la structure de table cameras_landing_db. newsletters
CREATE TABLE IF NOT EXISTS `newsletters` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email_newsletter` varchar(255) NOT NULL,
  `adresse_ip` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletters_email_newsletter_unique` (`email_newsletter`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.newsletters : ~1 rows (environ)
INSERT INTO `newsletters` (`id`, `email_newsletter`, `adresse_ip`, `created_at`, `updated_at`) VALUES
	(1, 'amhile22youssef@gmail.com', '127.0.0.1', '2025-06-03 11:59:53', NULL);

-- Listage de la structure de table cameras_landing_db. partenaires
CREATE TABLE IF NOT EXISTS `partenaires` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle_partenaire` varchar(255) NOT NULL,
  `id_ville` int(11) DEFAULT NULL,
  `autorisation_partenaire` int(11) DEFAULT NULL,
  `type_societe_partenaire` int(11) DEFAULT NULL,
  `telephone_partenaire` varchar(50) DEFAULT NULL,
  `email_partenaire` varchar(80) DEFAULT NULL,
  `ice_partenaire` varchar(100) DEFAULT NULL,
  `fax_partenaire` varchar(50) DEFAULT NULL,
  `registre_commerce_partenaire` varchar(100) DEFAULT NULL,
  `identifiant_fiscal_partenaire` varchar(100) DEFAULT NULL,
  `rib_partenaire` varchar(100) DEFAULT NULL,
  `adresse_partenaire` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `responsable_nom_complet` varchar(50) DEFAULT NULL,
  `responsable_telephone` varchar(50) DEFAULT NULL,
  `responsable_email` varchar(80) DEFAULT NULL,
  `logo_partenaire` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `partenaires_libelle_partenaire_unique` (`libelle_partenaire`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.partenaires : ~5 rows (environ)
INSERT INTO `partenaires` (`id`, `libelle_partenaire`, `id_ville`, `autorisation_partenaire`, `type_societe_partenaire`, `telephone_partenaire`, `email_partenaire`, `ice_partenaire`, `fax_partenaire`, `registre_commerce_partenaire`, `identifiant_fiscal_partenaire`, `rib_partenaire`, `adresse_partenaire`, `description`, `responsable_nom_complet`, `responsable_telephone`, `responsable_email`, `logo_partenaire`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Akdital', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025_06_05_13_31_53_53_partenaire_id_1.png', '2024-05-22 22:25:11', '2025-06-05 12:31:53', NULL),
	(2, 'Littel Mamma', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025_06_05_13_32_25_25_partenaire_id_2.png', '2024-05-22 22:27:43', '2025-06-05 12:32:25', NULL),
	(3, 'Paul', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025_06_05_13_30_48_48_partenaire_id_3.png', '2025-05-28 15:12:04', '2025-06-05 12:31:02', NULL),
	(4, 'Marina Juice', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025_06_05_13_33_09_09_partenaire_id_4.png', '2025-06-05 12:32:59', '2025-06-05 12:33:09', NULL),
	(5, 'Avis', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025_06_05_13_33_49_49_partenaire_id_5.png', '2025-06-05 12:33:41', '2025-06-05 12:33:49', NULL);

-- Listage de la structure de table cameras_landing_db. roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle_role` varchar(150) NOT NULL,
  `acronym_role` varchar(150) NOT NULL,
  `sidebar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_libelle_role_unique` (`libelle_role`),
  UNIQUE KEY `roles_acronym_role_unique` (`acronym_role`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.roles : ~2 rows (environ)
INSERT INTO `roles` (`id`, `libelle_role`, `acronym_role`, `sidebar`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Administrateur', 'identifiant_role_admin', '[\n  {\n    "icon": "fa fa-home",\n    "title": "Accueil",\n    "routerLink": "/accueil"\n  },\n  {\n    "icon": "fa fa-users",\n    "title": "Témoignages",\n    "routerLink": "/clients"\n  },\n  {\n    "icon": "fa fa-users",\n    "title": "Fournisseurs",\n    "routerLink": "/fournisseurs"\n  },\n  {\n    "icon": "fa fa-ravelry",\n    "title": "Partenaires",\n    "routerLink": "/partenaires"\n  },\n  {\n    "icon": "pi pi-box",\n    "title": "Articles",\n    "routerLink": "/articles"\n  },\n  {\n    "icon": "pi pi-apple",\n    "title": "Marques",\n    "routerLink": "/marques"\n  },\n  {\n    "icon": "fa fa-phone",\n    "title": "Demandes de contacts",\n    "routerLink": "/contacts"\n  },\n  {\n    "icon": "fa fa-cube",\n    "title": "Gestion de contenus",\n    "routerLink": "/contenus"\n  },\n  {\n    "icon": "fa fa-envelope",\n    "title": "Bulletins d\'information",\n    "routerLink": "/newsletters"\n  },\n  {\n    "icon": "fa fa-address-card",\n    "title": "Configurations",\n    "routerLink": "/configurations"\n  },\n  {\n    "icon": "fa fa-lock",\n    "title": "Mon compte",\n    "routerLink": "/compte"\n  }\n]', NULL, NULL, '2025-06-05 11:42:29', NULL),
	(2, 'Manager', 'identifiant_role_manager', '[{"icon": "fa fa-home", "title": "Accueil", "routerLink": "/accueil"}, {"icon": "fa fa-users", "title": "Témoignages", "routerLink": "/clients"}, {"icon": "fa fa-ravelry", "title": "Partenaires", "routerLink": "/partenaires"}, {"icon": "fa fa-envelope", "title": "Bulletins d\'information", "routerLink": "/newsletters"}, {"icon": "fa fa-phone", "title": "Demandes de contacts", "routerLink": "/contacts"}, {"icon": "fa fa-cube", "title": "Gestion de contenus", "routerLink": "/contenus"}, {"icon": "fa fa-lock", "title": "Mon compte", "routerLink": "/compte"}]', NULL, NULL, '2024-01-18 10:59:55', NULL);

-- Listage de la structure de table cameras_landing_db. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_role` bigint(20) unsigned NOT NULL,
  `has_access` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(80) NOT NULL,
  `password` text NOT NULL,
  `if_has_sound` int(11) NOT NULL DEFAULT 1,
  `image_user` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_id_role_foreign` (`id_role`),
  CONSTRAINT `users_id_role_foreign` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.users : ~3 rows (environ)
INSERT INTO `users` (`id`, `id_role`, `has_access`, `nom`, `prenom`, `email`, `password`, `if_has_sound`, `image_user`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 1, 'FARIS', 'YASSINE', 'admin@facile.ma', '$2y$10$/zdCfIeqzEcE2.p0cV4AB.wFTwaGJmc3UgJdQ9RXaYxA3DdC52nti', 0, NULL, NULL, '2025-06-03 12:13:25', NULL),
	(2, 1, 1, 'Rhellab', 'Amine', 'amine.rhellab@gmail.com', '$2y$10$E57pTsd/.V//AbcrMLwFb.rlg5bkCjMYNmIwfxUldRLUrgL1zR1Fm', 0, NULL, '2024-02-02 15:14:57', '2024-02-02 15:14:57', NULL),
	(3, 1, 1, 'Tachtoukt', 'Ayoub', 'tachtouktayoub@gmail.com', '$2y$10$T2jwc96Kis54FUq7qTK8Weabwh6nux9WSnFQb.ZkQ538Sqd2tyL8G', 0, NULL, '2024-02-05 15:37:25', '2024-02-05 15:37:25', NULL);

-- Listage de la structure de table cameras_landing_db. villes
CREATE TABLE IF NOT EXISTS `villes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle_ville` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `villes_libelle_ville_unique` (`libelle_ville`)
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table cameras_landing_db.villes : ~238 rows (environ)
INSERT INTO `villes` (`id`, `libelle_ville`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Aklim', NULL, NULL, NULL, NULL),
	(2, 'Ain Dorij', NULL, NULL, NULL, NULL),
	(3, 'Ain Jemaa', NULL, NULL, NULL, NULL),
	(4, 'Ait Benhaddou', NULL, NULL, NULL, NULL),
	(5, 'Ain Bni Mathar', NULL, NULL, '2023-02-18 12:17:14', NULL),
	(6, 'Ain Cheggag', NULL, NULL, NULL, NULL),
	(7, 'Ain Defali', NULL, NULL, NULL, NULL),
	(8, 'Ain El Aouda', NULL, NULL, NULL, NULL),
	(9, 'Ain Erreggada', NULL, NULL, NULL, NULL),
	(10, 'Ain Taoujdate', NULL, NULL, NULL, NULL),
	(11, 'Ait Boubidmane', NULL, NULL, NULL, NULL),
	(12, 'Ait Bouhlal', NULL, NULL, NULL, NULL),
	(13, 'Ait Daoud', NULL, NULL, NULL, NULL),
	(14, 'Ait Iaaza', NULL, NULL, NULL, NULL),
	(15, 'Ait Ourir', NULL, NULL, NULL, NULL),
	(16, 'Ajdir', NULL, NULL, NULL, NULL),
	(17, 'Al Aaroui', NULL, NULL, NULL, NULL),
	(18, 'Al-Hoceima', NULL, NULL, NULL, NULL),
	(19, 'Amalou Ighriben', NULL, NULL, NULL, NULL),
	(20, 'Amgala', NULL, NULL, NULL, NULL),
	(21, 'Amizmiz', NULL, NULL, NULL, NULL),
	(22, 'Aoufous', NULL, NULL, NULL, NULL),
	(23, 'Arbaoua', NULL, NULL, NULL, NULL),
	(24, 'Arfoud', NULL, NULL, NULL, NULL),
	(25, 'Asilah', NULL, NULL, NULL, NULL),
	(26, 'Assahrij', NULL, NULL, NULL, NULL),
	(27, 'Bab Berred', NULL, NULL, NULL, NULL),
	(28, 'Bab Taza', NULL, NULL, NULL, NULL),
	(29, 'Ben Ahmed', NULL, NULL, NULL, NULL),
	(30, 'Beni Chiker', NULL, NULL, NULL, NULL),
	(31, 'Beni Ansar', NULL, NULL, NULL, NULL),
	(32, 'Beni Mellal', NULL, NULL, NULL, NULL),
	(33, 'Ben Slimane', NULL, NULL, NULL, NULL),
	(34, 'Ben Taieb', NULL, NULL, NULL, NULL),
	(35, 'Ben Yakhlef', NULL, NULL, NULL, NULL),
	(36, 'Berkane', NULL, NULL, NULL, NULL),
	(37, 'Berrechid', NULL, NULL, NULL, NULL),
	(38, 'Bhalil', NULL, NULL, NULL, NULL),
	(39, 'Bir GanBirdus', NULL, NULL, NULL, NULL),
	(40, 'Bir Lehlou', NULL, NULL, NULL, NULL),
	(41, 'Bni Bouayach', NULL, NULL, NULL, NULL),
	(42, 'Bni Drar', NULL, NULL, NULL, NULL),
	(43, 'Bni Hadifa', NULL, NULL, NULL, NULL),
	(44, 'Bni Tadjite', NULL, NULL, NULL, NULL),
	(45, 'Bouarfa', NULL, NULL, NULL, NULL),
	(46, 'Bou Craa', NULL, NULL, NULL, NULL),
	(47, 'Bouanane', NULL, NULL, NULL, NULL),
	(48, 'Boudnib', NULL, NULL, NULL, NULL),
	(49, 'Boufakrane', NULL, NULL, NULL, NULL),
	(50, 'Bouguedra', NULL, NULL, NULL, NULL),
	(51, 'Bouizakarne', NULL, NULL, NULL, NULL),
	(52, 'Boujad', NULL, NULL, NULL, NULL),
	(53, 'Boujdour', NULL, NULL, NULL, NULL),
	(54, 'Bouknadel', NULL, NULL, NULL, NULL),
	(55, 'Boulemane', NULL, NULL, NULL, NULL),
	(56, 'Bouskoura', NULL, NULL, NULL, NULL),
	(57, 'Bouznika', NULL, NULL, NULL, NULL),
	(58, 'Bradia', NULL, NULL, NULL, NULL),
	(59, 'Brikcha', NULL, NULL, NULL, NULL),
	(60, 'Casablanca', NULL, NULL, NULL, NULL),
	(61, 'Chefchaouen', NULL, NULL, NULL, NULL),
	(62, 'Chemaia', NULL, NULL, NULL, NULL),
	(63, 'Chichaoua', NULL, NULL, NULL, NULL),
	(64, 'Dakhla', NULL, NULL, NULL, NULL),
	(65, 'Dar Gueddari', NULL, NULL, NULL, NULL),
	(66, 'Dar Kebdani', NULL, NULL, NULL, NULL),
	(67, 'Demnate', NULL, NULL, NULL, NULL),
	(68, 'Douar Bel Aguide', NULL, NULL, NULL, NULL),
	(69, 'Driouch', NULL, NULL, NULL, NULL),
	(70, 'El Aioun Sidi Mellouk', NULL, NULL, NULL, NULL),
	(71, 'El Guerdane', NULL, NULL, NULL, NULL),
	(72, 'El Hajeb', NULL, NULL, NULL, NULL),
	(73, 'El Hanchane', NULL, NULL, NULL, NULL),
	(74, 'El Jadida', NULL, NULL, NULL, NULL),
	(75, 'Elkbab', NULL, NULL, NULL, NULL),
	(76, 'El Menzel', NULL, NULL, NULL, NULL),
	(77, 'El Ouatia', NULL, NULL, NULL, NULL),
	(78, 'Erfoud', NULL, NULL, NULL, NULL),
	(79, 'Errachidia', NULL, NULL, NULL, NULL),
	(80, 'Essaouira', NULL, NULL, NULL, NULL),
	(81, 'Farcia', NULL, NULL, NULL, NULL),
	(82, 'Fès', NULL, NULL, NULL, NULL),
	(83, 'Figuig', NULL, NULL, NULL, NULL),
	(84, 'Fnideq', NULL, NULL, NULL, NULL),
	(85, 'Fquih Ben Salah', NULL, NULL, NULL, NULL),
	(86, 'Er-Rich', NULL, NULL, NULL, NULL),
	(87, 'Guelmim', NULL, NULL, NULL, NULL),
	(88, 'Goulmima', NULL, NULL, NULL, NULL),
	(89, 'Guelta Zemmour', NULL, NULL, NULL, NULL),
	(90, 'Guerguerat', NULL, NULL, NULL, NULL),
	(91, 'Guisser', NULL, NULL, NULL, NULL),
	(92, 'Guercif', NULL, NULL, NULL, NULL),
	(93, 'Had Kourt', NULL, NULL, NULL, NULL),
	(94, 'Hagunia', NULL, NULL, NULL, NULL),
	(95, 'Haj Kaddour', NULL, NULL, NULL, NULL),
	(96, 'Harhoura', NULL, NULL, NULL, NULL),
	(97, 'Ihddaden', NULL, NULL, NULL, NULL),
	(98, 'Ifrane', NULL, NULL, NULL, NULL),
	(99, 'Imilchil', NULL, NULL, NULL, NULL),
	(100, 'Imilili', NULL, NULL, NULL, NULL),
	(101, 'Imintanoute', NULL, NULL, NULL, NULL),
	(102, 'Imouzzer Kandar', NULL, NULL, NULL, NULL),
	(103, 'Immouzer Marmoucha', NULL, NULL, NULL, NULL),
	(104, 'Inezgane', NULL, NULL, NULL, NULL),
	(105, 'jerada', NULL, NULL, NULL, NULL),
	(106, 'Jorf', NULL, NULL, NULL, NULL),
	(107, 'Jorf El Melha', NULL, NULL, NULL, NULL),
	(108, 'Jemâa Sahim', NULL, NULL, NULL, NULL),
	(109, 'Kassita', NULL, NULL, NULL, NULL),
	(110, 'Kattara', NULL, NULL, NULL, NULL),
	(111, 'Kénitra ', NULL, NULL, NULL, NULL),
	(112, 'Kehf Nsour', NULL, NULL, NULL, NULL),
	(113, 'Khémisset', NULL, NULL, NULL, NULL),
	(114, 'Khemis Sahel', NULL, NULL, NULL, NULL),
	(115, 'Khemis Zemamra', NULL, NULL, NULL, NULL),
	(116, 'Khenichet', NULL, NULL, NULL, NULL),
	(117, 'Khénifra', NULL, NULL, NULL, NULL),
	(118, 'Khouribga', NULL, NULL, NULL, NULL),
	(119, 'Ksar el-Kébir', NULL, NULL, NULL, NULL),
	(120, 'Laayoune', NULL, NULL, NULL, NULL),
	(121, 'Lagouira', NULL, NULL, NULL, NULL),
	(122, 'Lalla Mimouna', NULL, NULL, NULL, NULL),
	(123, 'Larache', NULL, NULL, NULL, NULL),
	(124, 'Lixus', NULL, NULL, NULL, NULL),
	(125, 'Lqliâa', NULL, NULL, NULL, NULL),
	(126, 'Madagh', NULL, NULL, NULL, NULL),
	(127, 'Riad Heritage', NULL, NULL, NULL, NULL),
	(128, 'Marrakech', NULL, NULL, NULL, NULL),
	(129, 'Martil', NULL, NULL, NULL, NULL),
	(130, 'Mechra Bel Ksiri', NULL, NULL, NULL, NULL),
	(131, 'Mediek ou M\'diq', NULL, NULL, NULL, NULL),
	(132, 'Mediouna', NULL, NULL, NULL, NULL),
	(133, 'Mehdia', NULL, NULL, NULL, NULL),
	(134, 'Meknès', NULL, NULL, NULL, NULL),
	(135, 'Melloussa', NULL, NULL, NULL, NULL),
	(136, 'Midelt', NULL, NULL, NULL, NULL),
	(137, 'Mirleft', NULL, NULL, NULL, NULL),
	(138, 'Mohammédia', NULL, NULL, NULL, NULL),
	(139, 'Moqrisset', NULL, NULL, NULL, NULL),
	(140, 'Moulay Ali Cherif', NULL, NULL, NULL, NULL),
	(141, 'Moulay Bousselham', NULL, NULL, NULL, NULL),
	(142, 'Moulay Idriss Zerhoun', NULL, NULL, NULL, NULL),
	(143, 'M\'rirt', NULL, NULL, NULL, NULL),
	(144, 'nador', NULL, NULL, NULL, NULL),
	(145, 'nhima', NULL, NULL, NULL, NULL),
	(146, 'Ouarzazate', NULL, NULL, NULL, NULL),
	(147, 'Oualidia', NULL, NULL, NULL, NULL),
	(148, 'Ouezzane', NULL, NULL, NULL, NULL),
	(149, 'Oujda', NULL, NULL, NULL, NULL),
	(150, 'Oukaimeden', NULL, NULL, NULL, NULL),
	(151, 'Oulad Amrane', NULL, NULL, NULL, NULL),
	(152, 'Oulad Ayad', NULL, NULL, NULL, NULL),
	(153, 'Oulad Berhil', NULL, NULL, NULL, NULL),
	(154, 'Oulad Frej', NULL, NULL, NULL, NULL),
	(155, 'Oulad Ghadbane', NULL, NULL, NULL, NULL),
	(156, 'Oulad H Riz Sahel', NULL, NULL, NULL, NULL),
	(157, 'Oulad M\'Rah', NULL, NULL, NULL, NULL),
	(158, 'Oulad M Barek', NULL, NULL, NULL, NULL),
	(159, 'Oulad Teïma', NULL, NULL, NULL, NULL),
	(160, 'Oulad Zbair', NULL, NULL, NULL, NULL),
	(161, 'Ouled Tayeb', NULL, NULL, NULL, NULL),
	(162, 'Ouled Youssef', NULL, NULL, NULL, NULL),
	(163, 'Oulmès', NULL, NULL, NULL, NULL),
	(164, 'Ounagha', NULL, NULL, NULL, NULL),
	(165, 'Rabat', NULL, NULL, NULL, NULL),
	(166, 'Ras El Ma', NULL, NULL, NULL, NULL),
	(167, 'Ribate El Kheir', NULL, NULL, NULL, NULL),
	(168, 'Rissani', NULL, NULL, NULL, NULL),
	(169, 'Sabaa Aiyoun', NULL, NULL, NULL, NULL),
	(170, 'Safi', NULL, NULL, NULL, NULL),
	(171, 'Saidia', NULL, NULL, NULL, NULL),
	(172, 'Salé', NULL, NULL, NULL, NULL),
	(173, 'Sebt El Maârif', NULL, NULL, NULL, NULL),
	(174, 'Sebt Gzoula', NULL, NULL, NULL, NULL),
	(175, 'Sebt Jahjouh', NULL, NULL, NULL, NULL),
	(176, 'Sefrou', NULL, NULL, NULL, NULL),
	(177, 'Settat', NULL, NULL, NULL, NULL),
	(178, 'Sid Zouin', NULL, NULL, NULL, NULL),
	(179, 'Sidi Abdallah Ghiat', NULL, NULL, NULL, NULL),
	(180, 'Sidi Addi', NULL, NULL, NULL, NULL),
	(181, 'Sidi Ali Ban Hamdouche', NULL, NULL, NULL, NULL),
	(182, 'Sidi Allal El Bahraoui', NULL, NULL, NULL, NULL),
	(183, 'Sidi Allal Tazi', NULL, NULL, NULL, NULL),
	(184, 'Sidi Bou Othmane', NULL, NULL, NULL, NULL),
	(185, 'Sidi Boubker', NULL, NULL, NULL, NULL),
	(186, 'Sidi Jaber', NULL, NULL, NULL, NULL),
	(187, 'Sidi Kacem', NULL, NULL, NULL, NULL),
	(188, 'Sidi Lyamani', NULL, NULL, NULL, NULL),
	(189, 'Sidi Rahhal', NULL, NULL, NULL, NULL),
	(190, 'Sidi Slimane', NULL, NULL, NULL, NULL),
	(191, 'Sidi Smaïl', NULL, NULL, NULL, NULL),
	(192, 'Sidi Taibi', NULL, NULL, NULL, NULL),
	(193, 'Sidi Yahya el Gharb', NULL, NULL, NULL, NULL),
	(194, 'Skhirat', NULL, NULL, NULL, NULL),
	(195, 'Smara', NULL, NULL, NULL, NULL),
	(196, 'Taddert', NULL, NULL, NULL, NULL),
	(197, 'Tafetachte', NULL, NULL, NULL, NULL),
	(198, 'Tafrisset', NULL, NULL, NULL, NULL),
	(199, 'Taghjijt', NULL, NULL, NULL, NULL),
	(200, 'Tahala', NULL, NULL, NULL, NULL),
	(201, 'Tahannaout', NULL, NULL, NULL, NULL),
	(202, 'Tainaste', NULL, NULL, NULL, NULL),
	(203, 'Taliouine', NULL, NULL, NULL, NULL),
	(204, 'Talmest', NULL, NULL, NULL, NULL),
	(205, 'Talssint', NULL, NULL, NULL, NULL),
	(206, 'Tanger', NULL, NULL, NULL, NULL),
	(207, 'Tan-Tan', NULL, NULL, NULL, NULL),
	(208, 'Tamallalt', NULL, NULL, NULL, NULL),
	(209, 'Tamanar', NULL, NULL, NULL, NULL),
	(210, 'Tameslouht', NULL, NULL, NULL, NULL),
	(211, 'Taourirte', NULL, NULL, NULL, NULL),
	(212, 'Tarfaya', NULL, NULL, NULL, NULL),
	(213, 'Taroudant', NULL, NULL, NULL, NULL),
	(214, 'Tata', NULL, NULL, NULL, NULL),
	(215, 'Taza', NULL, NULL, NULL, NULL),
	(216, 'Taznakht', NULL, NULL, NULL, NULL),
	(217, 'Télouet', NULL, NULL, NULL, NULL),
	(218, 'Temara', NULL, NULL, NULL, NULL),
	(219, 'Temsia', NULL, NULL, NULL, NULL),
	(220, 'Tétouan', NULL, NULL, NULL, NULL),
	(221, 'Thar Es-Souk', NULL, NULL, NULL, NULL),
	(222, 'Tichla', NULL, NULL, NULL, NULL),
	(223, 'Tidass', NULL, NULL, NULL, NULL),
	(224, 'Tifariti', NULL, NULL, NULL, NULL),
	(225, 'Tiflet', NULL, NULL, NULL, NULL),
	(226, 'Tingdad', NULL, NULL, NULL, NULL),
	(227, 'Tinghir', NULL, NULL, NULL, NULL),
	(228, 'Tinmel', NULL, NULL, NULL, NULL),
	(229, 'Tiznit', NULL, NULL, NULL, NULL),
	(230, 'Tiztoutine', NULL, NULL, NULL, NULL),
	(231, 'Torres de Alcala', NULL, NULL, NULL, NULL),
	(232, 'Tifelt', NULL, NULL, NULL, NULL),
	(233, 'Oualili', NULL, NULL, NULL, NULL),
	(234, 'Youssoufia', NULL, NULL, NULL, NULL),
	(235, 'Zagora', NULL, NULL, NULL, NULL),
	(236, 'Zaio', NULL, NULL, NULL, NULL),
	(237, 'Azilal', NULL, NULL, NULL, NULL),
	(239, 'Sala Al Jadida', NULL, NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
