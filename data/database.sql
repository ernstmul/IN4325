-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Gegenereerd op: 28 mrt 2018 om 18:02
-- Serverversie: 5.6.33
-- PHP-versie: 7.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `IN4325`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `topics`
--

CREATE TABLE `topics` (
  `id` int(2) NOT NULL,
  `topicId` int(3) NOT NULL,
  `title` varchar(30) NOT NULL,
  `precision` decimal(1,1) NOT NULL,
  `count` int(3) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `topics`
--

INSERT INTO `topics` (`id`, `topicId`, `title`, `precision`, `count`) VALUES
(1, 310, 'Radio Waves and Brain Cancer', '0.3', 0),
(2, 336, 'Black Bear Attacks', '0.3', 0),
(3, 362, 'Human Smuggling', '0.3', 0),
(4, 367, 'Piracy', '0.3', 0),
(5, 383, 'Mental Illness Drugs', '0.3', 0),
(6, 426, 'Law Enforcement, Dogs', '0.3', 0),
(7, 427, 'UV Damage, Eyes', '0.3', 0),
(8, 436, 'Railway Accidents', '0.3', 0),
(9, 310, 'Radio Waves and Brain Cancer', '0.6', 0),
(10, 336, 'Black Bear Attacks', '0.6', 0),
(11, 362, 'Human Smuggling', '0.6', 0),
(12, 367, 'Piracy', '0.6', 0),
(13, 383, 'Mental Illness Drugs', '0.6', 0),
(14, 426, 'Law Enforcement, Dogs', '0.6', 0),
(15, 427, 'UV Damage, Eyes', '0.6', 0),
(16, 436, 'Railway Accidents', '0.6', 0);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`);
