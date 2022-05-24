-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 22, 2021 at 09:34 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `application`
--

-- --------------------------------------------------------

--
-- Table structure for table `application_login`
--

CREATE TABLE `application_login` (
  `id` int(11) NOT NULL,
  `login_name` varchar(20) NOT NULL,
  `login_password` varchar(20) NOT NULL,
  `login_type` varchar(10) NOT NULL,
  `login_status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `application_login`
--

INSERT INTO `application_login` (`id`, `login_name`, `login_password`, `login_type`, `login_status`) VALUES
(1, 'admin', 'admin', 'master', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(15) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_avatar` varchar(100) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `username`, `email`, `password`, `user_avatar`, `createdAt`, `updatedAt`) VALUES
(15, 'Abhishek', 'Das', 'abhishek_das', 'das.abhishek77@gmail.com', '$2b$12$G6ZTNx1l4.m.9VVuna6K5.g.A4OSCH6/fSvdpf13AaXEU5fIZt00q', 'forest-4_15.jpg', '2021-09-20', '2021-09-20'),
(18, 'Subhankar444', 'Chauley', 'subhankar_chauley', 'subhankar5@gmail.com', '$2b$12$w5ehcvPe2MYUhW3O8VPMpOP3o5Zc1pRJUINBKB/fvRyX9O.Ka.SSi', '', '2021-09-20', '2021-09-20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application_login`
--
ALTER TABLE `application_login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application_login`
--
ALTER TABLE `application_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
