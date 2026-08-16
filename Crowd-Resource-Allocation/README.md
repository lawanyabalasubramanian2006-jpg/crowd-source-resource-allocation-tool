README DOCUMENT:

Absolutely. Below is a complete README.md for your Crowd-Sourced Resource Allocation Tool, written so that another person can copy the project to their computer, install XAMPP, import the database, and run it.
Save this as:
Crowd-Resource-Allocation/README.md
Crowd-Sourced Resource Allocation Tool
1. Project Overview
The Crowd-Sourced Resource Allocation Tool is a full-stack web application designed to allocate limited resources fairly when there are many competing requests.
The system allows community members to:
•	Submit resource requests
•	View available requests
•	Vote for important requests
•	Calculate community vote counts
•	Rank requests based on an explainable scoring system
•	Allocate available resources according to priority
The main objective is to make resource allocation fair, transparent, and explainable.
________________________________________
2. Project Objective
The main objective of this project is:
To allocate limited resources fairly under high demand using community voting and an explainable ranking algorithm.
The system considers four major factors:
Factor	Weight
Need	40%
Urgency	30%
Community Votes	20%
Waiting Time	10%
Total	100%
________________________________________
3. Technology Stack
Frontend
•	HTML5
•	CSS3
•	JavaScript
Backend
•	PHP
Database
•	MySQL
Database Management
•	phpMyAdmin
Server
•	Apache
Development Environment
•	XAMPP
________________________________________
4. System Architecture
              USER
               |
               ↓
        HTML / CSS / JS
               |
               ↓
          PHP Backend
               |
               ↓
          MySQL Database
               |
               ↓
       Ranking & Allocation
________________________________________
5. Project Structure
The project should have the following structure:
Crowd-Resource-Allocation/
│
├── frontend/
│   ├── index.html
│   ├── voting.html
│   └── ranking.html
│
├── backend/
│   ├── db.php
│   ├── get_requests.php
│   ├── vote.php
│   ├── get_ranking.php
│   └── allocate_resource.php
│
├── database/
│   └── database.sql
│
└── README.md
________________________________________
6. Requirements
Before running the project, install:
XAMPP
XAMPP provides:
•	Apache
•	MySQL
•	PHP
•	phpMyAdmin
No separate PHP or MySQL installation is required if XAMPP is installed correctly.
________________________________________
7. Installation
Step 1: Install XAMPP
Install XAMPP on the computer.
The default installation location is:
C:\xampp
________________________________________
Step 2: Copy the Project
Copy the complete project folder:
Crowd-Resource-Allocation
into:
C:\xampp\htdocs\
The final location should be:
C:\xampp\htdocs\Crowd-Resource-Allocation\
________________________________________
8. Start XAMPP
Open:
XAMPP Control Panel
Start:
Apache
MySQL
Both services should show as running.
________________________________________
9. Create the Database
Open the browser and go to:
http://localhost/phpmyadmin/
Create a database named:
crowd_resource_allocation
________________________________________
10. Import Database
Inside phpMyAdmin:
1.	Select crowd_resource_allocation
2.	Click Import
3.	Select:
database/database.sql
4.	Click Import
The database tables will be created automatically.
________________________________________
11. Database Tables
The system uses the following main tables:
Users
Stores community member information.
users
Important fields:
id
name
email
password
________________________________________
Resources
Stores available resources.
resources
Important fields:
id
name
description
total_quantity
available_quantity
created_at
________________________________________
Requests
Stores resource requests submitted by members.
requests
Important fields:
id
user_id
resource_id
description
need_score
urgency_score
status
created_at
________________________________________
Votes
Stores community votes.
votes
Important fields:
id
user_id
request_id
created_at
________________________________________
12. Database Relationships
The basic relationship is:
Users
  |
  | user_id
  ↓
Requests
  |
  | request_id
  ↓
Votes

Resources
  |
  | resource_id
  ↓
Requests
________________________________________
13. Database Connection
The database connection is handled by:
backend/db.php
The default XAMPP configuration is:
Host: localhost
Username: root
Password: empty
Database: crowd_resource_allocation
If the MySQL password is changed on another computer, update db.php.
________________________________________
14. Running the Application
After starting Apache and MySQL, open:
http://localhost/Crowd-Resource-Allocation/frontend/index.html
This is the main page.
________________________________________
15. Main Pages
Home Page
Open:
http://localhost/Crowd-Resource-Allocation/frontend/index.html
The home page allows users to submit resource requests.
________________________________________
Voting Page
Open:
http://localhost/Crowd-Resource-Allocation/frontend/voting.html
The voting page displays pending requests.
A member enters their:
Member ID
and clicks:
Vote for this Request
________________________________________
Ranking Page
Open:
http://localhost/Crowd-Resource-Allocation/frontend/ranking.html
The ranking page displays requests according to their priority score.
________________________________________
16. Voting System
There are 100 community members.
Each member can vote only once.
Example:
Member 1 → Vote
Member 2 → Vote
Member 3 → Vote
...
Member 100 → Vote
If Member 1 tries to vote again, the system rejects the vote.
Example message:
This member has already voted.
Each member can vote only once.
________________________________________
17. Ranking Algorithm
The project uses a Weighted Scoring Algorithm.
The final score is based on:
Need          = 40%
Urgency       = 30%
Community     = 20%
Waiting Time  = 10%
Formula:
Final Score =
(Need × 0.40)
+
(Urgency × 0.30)
+
(Votes × 0.20)
+
(Waiting Time × 0.10)
________________________________________
18. Example Ranking
Suppose a request has:
Need = 90
Urgency = 80
Community Vote Score = 70
Waiting Time = 60
Then:
Final Score

= (90 × 0.40)
+ (80 × 0.30)
+ (70 × 0.20)
+ (60 × 0.10)

= 36
+ 24
+ 14
+ 6

= 80
Therefore:
Final Score = 80
Requests with higher scores receive higher priority.
________________________________________
19. Explainable Ranking
One important requirement of this project is that the ranking must be explainable.
The system does not simply display:
Rank 1
It can explain that the priority was influenced by:
Need
Urgency
Community Votes
Waiting Time
This makes the allocation process more transparent.
________________________________________
20. Resource Allocation
The system checks whether the requested resource is available.
For example:
Laptop

Total Quantity:     10
Available Quantity: 10
After allocating one laptop:
Laptop

Total Quantity:     10
Available Quantity: 9
The available quantity decreases automatically.
________________________________________
21. Request Status
Requests can have different statuses:
Pending
Allocated
Rejected
Example:
New Request
     ↓
Pending
     ↓
Ranking
     ↓
Highest Priority
     ↓
Resource Available?
    / \
  Yes  No
   ↓    ↓
Allocated
________________________________________
22. Important Backend Files
db.php
Connects PHP to MySQL.
backend/db.php
get_requests.php
Retrieves pending requests from the database.
backend/get_requests.php
vote.php
Records community votes.
backend/vote.php
get_ranking.php
Calculates and returns request rankings.
backend/get_ranking.php
allocate_resource.php
Handles resource allocation.
backend/allocate_resource.php
________________________________________
23. Testing Procedure
Follow this order when testing the project.
Test 1 — Home Page
Open:
http://localhost/Crowd-Resource-Allocation/frontend/index.html
Check that the page loads.
________________________________________
Test 2 — Submit Request
Create a request such as:
Resource: Laptop
Description: STUDY
Need: High
Urgency: High
Submit it.
________________________________________
Test 3 — Voting
Open:
http://localhost/Crowd-Resource-Allocation/frontend/voting.html
Enter:
Member ID: 1
Click:
Vote for this Request
The vote count should become:
Community Votes: 1
________________________________________
Test 4 — Second Member
Enter:
Member ID: 2
Vote again.
The count should become:
Community Votes: 2
________________________________________
Test 5 — Duplicate Vote
Enter:
Member ID: 1
and try to vote again.
The system should reject the vote.
________________________________________
Test 6 — Ranking
Open:
http://localhost/Crowd-Resource-Allocation/frontend/ranking.html
Click:
Refresh Ranking
The requests should appear according to their priority score.
________________________________________
24. Common Problems
Problem 1: Apache is not running
Open XAMPP and start:
Apache
________________________________________
Problem 2: MySQL is not running
Open XAMPP and start:
MySQL
________________________________________
Problem 3: Page Not Found
Make sure the project exists at:
C:\xampp\htdocs\Crowd-Resource-Allocation\
Then use:
http://localhost/Crowd-Resource-Allocation/frontend/index.html
________________________________________
Problem 4: Database Connection Failed
Check:
MySQL = Running
Then check:
backend/db.php
Make sure the database name is:
crowd_resource_allocation
________________________________________
Problem 5: Server Connection Failed
Check that the PHP file exists in:
C:\xampp\htdocs\Crowd-Resource-Allocation\backend\
For example:
get_requests.php
vote.php
get_ranking.php
Also make sure you are opening the HTML pages through:
http://localhost/
and not directly using:
file:///C:/...
________________________________________
25. Portability
The project is designed to be portable.
To run it on another computer:
Copy Project
     ↓
Install XAMPP
     ↓
Copy project to htdocs
     ↓
Start Apache + MySQL
     ↓
Create database
     ↓
Import database.sql
     ↓
Open localhost
No computer-specific paths should be required.
________________________________________
26. Security Notes
This project is designed primarily as an academic/demo project.
For production use, additional security should be implemented, including:
•	Password hashing
•	Input validation
•	Prepared SQL statements
•	Authentication and authorization
•	CSRF protection
•	Session management
•	HTTPS
•	Access control
•	Database backups
The current project uses prepared statements for important database operations.
________________________________________
27. Project Advantages
The system provides:
Fairness
Community voting contributes to the allocation decision.
Transparency
The ranking formula is clearly defined.
Explainability
Users can understand why a request receives a particular priority.
Efficiency
The system automatically calculates rankings.
Resource Awareness
The system tracks available resource quantities.
Portability
The application can be moved to another XAMPP installation.
________________________________________
28. Project Summary
The Crowd-Sourced Resource Allocation Tool is a full-stack application that combines:
Resource Requests
       +
Community Voting
       +
Weighted Ranking
       +
Resource Availability
       =
Fair Resource Allocation
The system helps organizations and communities make transparent and explainable decisions when resources are limited and demand is high.
________________________________________
29. Quick Start
For quick installation:
1. Install XAMPP

2. Copy:
   Crowd-Resource-Allocation
   ↓
   C:\xampp\htdocs\

3. Start:
   Apache
   MySQL

4. Open:
   http://localhost/phpmyadmin/

5. Create:
   crowd_resource_allocation

6. Import:
   database/database.sql

7. Open:
http://localhost/Crowd-Resource-Allocation/frontend/index.html

Project Status: Ready for local XAMPP deployment and academic demonstration.

