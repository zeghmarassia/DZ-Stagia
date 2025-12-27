-- All offers from your test company (ID=1)
INSERT INTO offer (company_id, title, description, offer_type, duration, 
                   salary_min, salary_max, location_mode, location, 
                   employment_type, visibility, is_active, expiration_date)
VALUES 
-- Targeted to ESTIN only (visibility = false)
(1, 'Software Engineer Internship - ESTIN Exclusive', 'Exclusive internship for ESTIN Computer Science students. Work on real-world projects with mentorship.', 'internship', '3-6 months', 5000.00, 7000.00, 'hybrid', 'Algiers, Algeria', 'internship', false, true, '2025-06-30'),
(1, 'Data Science Trainee Program - ESTIN Special', 'Data science and machine learning program exclusively for ESTIN students.', 'training', '6 months', 6000.00, 8000.00, 'onsite', 'Oran, Algeria', 'full-time', false, true, '2025-07-15'),

-- Public offers (visibility = true)
(1, 'Full Stack Developer', 'Full Stack Developer with React and Node.js experience to build modern web applications.', 'job', 'Permanent', 15000.00, 20000.00, 'remote', 'Remote, Algeria', 'full-time', true, true, '2025-05-31'),
(1, 'Mobile App Developer Intern', 'React Native internship for mobile application development.', 'internship', '3 months', 4000.00, 5500.00, 'hybrid', 'Constantine, Algeria', 'internship', true, true, '2025-04-30'),
(1, 'DevOps Engineer', 'DevOps Engineer with AWS, Docker, and Kubernetes experience.', 'job', 'Permanent', 18000.00, 25000.00, 'remote', 'Algiers, Algeria', 'full-time', true, true, '2025-08-15'),
(1, 'UI/UX Designer', 'Creative UI/UX designer for web and mobile applications.', 'job', 'Permanent', 12000.00, 17000.00, 'onsite', 'Algiers, Algeria', 'full-time', true, true, '2025-06-30'),
(1, 'Python Developer Intern', 'Python backend development internship focusing on Django and FastAPI.', 'internship', '4 months', 4500.00, 6000.00, 'onsite', 'Tizi Ouzou, Algeria', 'internship', true, true, '2025-05-15'),

-- Targeted to other schools only (visibility = false, NOT for ESTIN)
(1, 'Cybersecurity Specialist Program', 'Cybersecurity training program for selected engineering schools (not ESTIN).', 'training', '5 months', 7000.00, 9000.00, 'hybrid', 'Algiers, Algeria', 'full-time', false, true, '2025-09-30'),

-- Expired offer (should not appear for anyone)
(1, 'Expired Web Developer Position', 'This offer has expired and should not appear in results.', 'job', 'Permanent', 10000.00, 15000.00, 'onsite', 'Algiers, Algeria', 'full-time', true, true, '2024-12-31'),

-- Inactive offer (should not appear for anyone)
(1, 'Inactive Data Analyst Position', 'This offer is marked as inactive.', 'job', 'Permanent', 13000.00, 18000.00, 'remote', 'Remote, Algeria', 'full-time', true, false, '2025-12-31');


-- Link ESTIN offers to establishment_id = 3
INSERT INTO offer_establishment (offer_id, establishment_id)
SELECT offer_id, 3 
FROM offer 
WHERE title LIKE '%ESTIN%';

-- Link Cybersecurity offer to other schools (NOT ESTIN)
-- Assuming establishment IDs: 1, 2, 4 exist (but NOT 3)
INSERT INTO offer_establishment (offer_id, establishment_id)
SELECT o.offer_id, e.establishment_id
FROM offer o
CROSS JOIN (SELECT 1 as establishment_id UNION SELECT 2 UNION SELECT 4) e
WHERE o.title = 'Cybersecurity Specialist Program';