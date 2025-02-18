-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2024 at 08:44 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pdfdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'shivamparvat', 'shivamparvat27@gmail.com', '$2a$10$GIdYfUzPJrH2ouvNdzEA6uGize2iSYNCIvBtS0c99rFPZebsDPjXG', '2024-08-05 17:52:31', '2024-08-05 17:52:31');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `middleName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `maidenName` varchar(100) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zipCode` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `emailAddress` varchar(100) DEFAULT NULL,
  `bornDate` date DEFAULT NULL,
  `bornCity` varchar(100) DEFAULT NULL,
  `bornState` varchar(100) DEFAULT NULL,
  `bornCounty` varchar(100) DEFAULT NULL,
  `marriages` text DEFAULT NULL,
  `currentlyMarried` tinyint(1) DEFAULT NULL,
  `weddingDate` date DEFAULT NULL,
  `weddingCity` varchar(100) DEFAULT NULL,
  `weddingState` varchar(100) DEFAULT NULL,
  `veteran` tinyint(1) DEFAULT NULL,
  `fathersFullName` varchar(255) DEFAULT NULL,
  `mothersFullName` varchar(255) DEFAULT NULL,
  `mothersMaidenName` varchar(100) DEFAULT NULL,
  `parentsWeddingDate` date DEFAULT NULL,
  `parentsWeddingCity` varchar(100) DEFAULT NULL,
  `parentsWeddingState` varchar(100) DEFAULT NULL,
  `parentsMarriedAtBirth` tinyint(1) DEFAULT NULL,
  `witness1FirstName` varchar(100) DEFAULT NULL,
  `witness1MiddleName` varchar(100) DEFAULT NULL,
  `witness1LastName` varchar(100) DEFAULT NULL,
  `witness1FullAddress` varchar(255) DEFAULT NULL,
  `witness1County` varchar(100) DEFAULT NULL,
  `witness1Relationship` varchar(100) DEFAULT NULL,
  `witness1PhoneNumber` varchar(20) DEFAULT NULL,
  `witness1EmailAddress` varchar(100) DEFAULT NULL,
  `witness1Gender` varchar(20) DEFAULT NULL,
  `witness2FirstName` varchar(100) DEFAULT NULL,
  `witness2MiddleName` varchar(100) DEFAULT NULL,
  `witness2LastName` varchar(100) DEFAULT NULL,
  `witness2FullAddress` varchar(255) DEFAULT NULL,
  `witness2County` varchar(100) DEFAULT NULL,
  `witness2Relationship` varchar(100) DEFAULT NULL,
  `witness2PhoneNumber` varchar(20) DEFAULT NULL,
  `witness2EmailAddress` varchar(100) DEFAULT NULL,
  `witness2Gender` varchar(20) DEFAULT NULL,
  `marriedWhenChildrenBorn` tinyint(1) DEFAULT NULL,
  `childrenUnder21` tinyint(1) DEFAULT NULL,
  `childrenFullName` text DEFAULT NULL,
  `childrenBornDayTime` datetime DEFAULT NULL,
  `childrenCountyStateOfBirth` varchar(255) DEFAULT NULL,
  `childrenOrder` int(11) DEFAULT NULL,
  `fatherFullName` varchar(255) DEFAULT NULL,
  `fatherBornDate` date DEFAULT NULL,
  `fatherBornCountyState` varchar(255) DEFAULT NULL,
  `motherFullName` varchar(255) DEFAULT NULL,
  `motherBornDate` date DEFAULT NULL,
  `motherBornCountyState` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`id`, `firstName`, `middleName`, `lastName`, `maidenName`, `address1`, `address2`, `city`, `state`, `zipCode`, `country`, `gender`, `phoneNumber`, `emailAddress`, `bornDate`, `bornCity`, `bornState`, `bornCounty`, `marriages`, `currentlyMarried`, `weddingDate`, `weddingCity`, `weddingState`, `veteran`, `fathersFullName`, `mothersFullName`, `mothersMaidenName`, `parentsWeddingDate`, `parentsWeddingCity`, `parentsWeddingState`, `parentsMarriedAtBirth`, `witness1FirstName`, `witness1MiddleName`, `witness1LastName`, `witness1FullAddress`, `witness1County`, `witness1Relationship`, `witness1PhoneNumber`, `witness1EmailAddress`, `witness1Gender`, `witness2FirstName`, `witness2MiddleName`, `witness2LastName`, `witness2FullAddress`, `witness2County`, `witness2Relationship`, `witness2PhoneNumber`, `witness2EmailAddress`, `witness2Gender`, `marriedWhenChildrenBorn`, `childrenUnder21`, `childrenFullName`, `childrenBornDayTime`, `childrenCountyStateOfBirth`, `childrenOrder`, `fatherFullName`, `fatherBornDate`, `fatherBornCountyState`, `motherFullName`, `motherBornDate`, `motherBornCountyState`, `created_at`, `updated_at`) VALUES
(1, 'firstName', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, NULL, 'shivamparvat27@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-05 18:29:32', '2024-08-05 18:29:32'),
(2, 'shivam', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, NULL, 'shivamparvat27@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-05 18:29:32', '2024-08-05 18:29:32'),
(3, 'shivam', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, NULL, 'shivamparvat27@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-05 18:29:32', '2024-08-05 18:29:32'),
(4, 'shivam1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, NULL, 'shivamparvat27@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-05 18:29:32', '2024-08-05 18:29:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
