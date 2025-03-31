-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 27, 2025 at 11:50 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ddsv`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
CREATE TABLE IF NOT EXISTS `attendances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `classId` int NOT NULL,
  `studentId` int NOT NULL,
  `date` datetime NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `scheduleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`),
  KEY `studentId` (`studentId`),
  KEY `Attendances_scheduleId_foreign_idx` (`scheduleId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `classId`, `studentId`, `date`, `createdAt`, `updatedAt`, `scheduleId`) VALUES
(1, 1, 2, '2025-03-26 15:18:04', '2025-03-26 15:18:04', '2025-03-26 15:18:04', NULL),
(2, 3, 1, '2025-03-27 11:32:08', '2025-03-27 11:32:08', '2025-03-27 11:32:08', 4);

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
CREATE TABLE IF NOT EXISTS `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `teacherId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `teacherId` (`teacherId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `teacherId`, `createdAt`, `updatedAt`) VALUES
(1, 'Lập trình Web', 2, '2025-03-26 14:43:44', '2025-03-26 14:43:44'),
(2, 'Hướng đối tượng(OOP)', 2, '2025-03-27 11:01:32', '2025-03-27 11:01:32'),
(3, 'D21-TH001', 2, '2025-03-27 11:20:52', '2025-03-27 11:20:52');

-- --------------------------------------------------------

--
-- Table structure for table `classschedules`
--

DROP TABLE IF EXISTS `classschedules`;
CREATE TABLE IF NOT EXISTS `classschedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `classId` int NOT NULL,
  `dayOfWeek` int NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `classId` (`classId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `classschedules`
--

INSERT INTO `classschedules` (`id`, `classId`, `dayOfWeek`, `startTime`, `endTime`, `createdAt`, `updatedAt`) VALUES
(1, 1, 6, '07:00:00', '11:00:00', '2025-03-27 11:05:06', '2025-03-27 11:05:06'),
(2, 1, 3, '17:00:00', '19:00:00', '2025-03-27 11:11:52', '2025-03-27 11:11:52'),
(3, 3, 3, '17:00:00', '19:00:00', '2025-03-27 11:22:11', '2025-03-27 11:22:11'),
(4, 3, 4, '17:00:00', '19:00:00', '2025-03-27 11:31:30', '2025-03-27 11:31:30');

-- --------------------------------------------------------

--
-- Table structure for table `classstudent`
--

DROP TABLE IF EXISTS `classstudent`;
CREATE TABLE IF NOT EXISTS `classstudent` (
  `classId` int NOT NULL,
  `studentId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`classId`,`studentId`),
  KEY `studentId` (`studentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `classstudent`
--

INSERT INTO `classstudent` (`classId`, `studentId`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2025-03-26 14:51:11', '2025-03-26 14:51:11'),
(1, 2, '2025-03-26 14:51:01', '2025-03-26 14:51:01'),
(2, 1, '2025-03-27 11:02:12', '2025-03-27 11:02:12'),
(3, 1, '2025-03-27 11:21:14', '2025-03-27 11:21:14');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250326081242-create-users-table.js.js'),
('20250326081319-create-classes-table.js.js'),
('20250326081332-create-students-table.js.js'),
('20250326081349-create-class-student-table.js.js'),
('20250326081401-create-attendacne-table.js.js'),
('20250327073022-create-class-schedule-table.js'),
('20250327104108-add-scheduuleId-to-attendances.js');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `studentId` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `studentId`, `email`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 'Lê Quang Nhân', 'DH52111401', 'DH52111401@student.stu.edu.vn', 3, '2025-03-26 13:48:09', '2025-03-26 13:48:09'),
(2, 'Trần Trọng Nhân', 'DH52111411', 'DH52111411@student.stu.edu.vn', 5, '2025-03-26 14:49:33', '2025-03-26 14:49:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'student',
  `email` varchar(255) DEFAULT NULL,
  `studentId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `studentId` (`studentId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `email`, `studentId`, `createdAt`, `updatedAt`) VALUES
(1, 'admin123', '$2b$10$oK3qr5scmRrUpwDWubEIYOjYYFKwqLY7iIlEyNyvNoIfHgkS3bPwu', 'admin', 'lequangnhanbrvt58@gmail.com', NULL, '2025-03-26 18:21:48', '2025-03-26 18:21:48'),
(2, 'GVToan', '$2b$10$oa0bFcPEMVDMJzNKf7DjQOqqybrKKd16RiFU3aeO9MakKYiwhcNLy', 'teacher', 'gvtoan@gmail.com', NULL, '2025-03-26 13:47:42', '2025-03-26 13:47:42'),
(3, 'DH52111401', '$2b$10$E//MKVFobUgTga1qpbz.Pej5pWti2NL7JDBBwz7nTlKzwBRmfRsb2', 'student', 'DH52111401@student.stu.edu.vn', 'DH52111401', '2025-03-26 13:48:09', '2025-03-26 13:48:09'),
(5, 'DH52111411', '$2b$10$LpFwt83vpW3gsixDX1ln0eWbTJ3iYuzAgJQDRr7VyqPIZ1LIzPuu2', 'student', 'DH52111411@student.stu.edu.vn', 'DH52111411', '2025-03-26 14:49:33', '2025-03-26 14:49:33');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Attendances_scheduleId_foreign_idx` FOREIGN KEY (`scheduleId`) REFERENCES `classschedules` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `users` (`id`);

--
-- Constraints for table `classschedules`
--
ALTER TABLE `classschedules`
  ADD CONSTRAINT `classschedules_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `classstudent`
--
ALTER TABLE `classstudent`
  ADD CONSTRAINT `classstudent_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classstudent_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
