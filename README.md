# Hospital Management System

A full-stack Hospital Management System developed as a DBMS project to efficiently manage and organize hospital-related information. The system provides a user-friendly web interface for managing patient records, doctors, appointments, beds, treatments, and payments.

## Project Overview

The Hospital Management System connects a React-based frontend with a Node.js and Express.js backend and a MySQL database. It allows users to add, view, update, and delete hospital records through the web application while storing the data securely in the MySQL database.

## Main Modules

- Patient Management
  - Add and manage patient details
  - Store patient information such as name, DOB, gender, phone, address, and blood group

- Doctor Management
  - Manage doctor information
  - Store doctor name, specialization, phone number, and email

- Appointment Management
  - Schedule and manage patient appointments
  - Connect patients with doctors

- Bed Management
  - Manage hospital beds
  - Track bed number, charges, status, and assigned patient

- Treatment Management
  - Store and manage treatment details
  - Connect treatments with patients and appointments

- Payment Management
  - Record treatment-related payments
  - Store payment amount and payment mode

## Technologies Used

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MySQL
- Database Tool: MySQL Workbench
- Development Environment: Visual Studio Code
- Version Control: Git & GitHub

## System Architecture

React Frontend → Node.js / Express.js Backend → MySQL Database

The frontend communicates with the backend through REST APIs, and the backend performs database operations using MySQL.

## Database Design

The database consists of the following main tables:

- PATIENT
- DOCTOR
- APPOINTMENT
- BED
- TREATMENT
- PAYMENT

Primary keys and foreign keys are used to maintain relationships between the tables and ensure data consistency.

## Key Features

- User-friendly dashboard
- Patient record management
- Doctor record management
- Appointment scheduling
- Hospital bed management
- Treatment tracking
- Payment management
- CRUD operations
- MySQL database integration
- REST API-based communication
- Relational database design and normalization

## Project Objective

The main objective of this project is to develop a simple and efficient hospital database management system that reduces data redundancy, maintains data consistency, and makes hospital information easier to manage.

This project also demonstrates practical implementation of DBMS concepts such as:

- ER Diagram
- Relational Schema
- Primary Keys
- Foreign Keys
- Relationships
- Normalization
- SQL Queries
- CRUD Operations
- Database Connectivity
