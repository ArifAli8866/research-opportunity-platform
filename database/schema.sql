-- ==============================================================
-- Database Schema for Research Opportunity Portal
-- Database: research_portal
-- Table: opportunities
-- ==============================================================

-- Create the database if it does not already exist
CREATE DATABASE IF NOT EXISTS research_portal;

-- Select and switch to the research_portal database
USE research_portal;

-- Create the opportunities table to store research listings
CREATE TABLE IF NOT EXISTS opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    research_area VARCHAR(150) NOT NULL,
    faculty_name VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    required_skills VARCHAR(500) NOT NULL,
    positions INT NOT NULL CHECK (positions > 0),
    deadline DATE NOT NULL,
    status ENUM('Open', 'Closed') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
