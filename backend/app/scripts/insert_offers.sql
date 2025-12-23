WITH inserted_offers AS (
  -- Insert all offers and return their IDs
  INSERT INTO offer (company_id, title, description, offer_type, duration, 
                     salary_min, salary_max, location_mode, location, 
                     employment_type, visibility, is_active, expiration_date)
  VALUES 
  -- Targeted to ESTIN only
  (1, 'Software Engineer Internship - ESTIN Exclusive', 'Exclusive internship for ESTIN CS students.', 'internship', '3-6 months', 5000.00, 7000.00, 'hybrid', 'Algiers', 'internship', false, true, '2025-06-30'),
  (2, 'Data Science Trainee Program - ESTIN Special', 'Data science program for ESTIN.', 'training', '6 months', 6000.00, 8000.00, 'onsite', 'Oran', 'full-time', false, true, '2025-07-15'),
  -- Public offers
  (3, 'Full Stack Developer', 'Full Stack Developer with React/Node.js.', 'job', 'Permanent', 15000.00, 20000.00, 'remote', 'Remote', 'full-time', true, true, '2025-05-31'),
  (1, 'Mobile App Developer Intern', 'React Native internship.', 'internship', '3 months', 4000.00, 5500.00, 'hybrid', 'Constantine', 'internship', true, true, '2025-04-30'),
  (4, 'DevOps Engineer', 'DevOps with AWS/Docker/Kubernetes.', 'job', 'Permanent', 18000.00, 25000.00, 'remote', 'Algiers', 'full-time', true, true, '2025-08-15'),
  (5, 'UI/UX Designer', 'Creative UI/UX designer.', 'job', 'Permanent', 12000.00, 17000.00, 'onsite', 'Algiers', 'full-time', true, true, '2025-06-30'),
  (6, 'Python Developer Intern', 'Python backend internship.', 'internship', '4 months', 4500.00, 6000.00, 'onsite', 'Tizi Ouzou', 'internship', true, true, '2025-05-15'),
  -- Targeted to other schools
  (7, 'Cybersecurity Specialist Program', 'Cybersecurity for selected schools.', 'training', '5 months', 7000.00, 9000.00, 'hybrid', 'Algiers', 'full-time', false, true, '2025-09-30'),
  -- Expired and inactive
  (3, 'Expired Web Developer Position', 'Expired offer.', 'job', 'Permanent', 10000.00, 15000.00, 'onsite', 'Algiers', 'full-time', true, true, '2024-12-31'),
  (2, 'Inactive Data Analyst Position', 'Inactive offer.', 'job', 'Permanent', 13000.00, 18000.00, 'remote', 'Remote', 'full-time', true, false, '2025-12-31')
  RETURNING offer_id, title
)
-- Now link targeted offers to establishments
INSERT INTO offer_establishment (offer_id, establishment_id)
SELECT io.offer_id, 3  -- ESTIN (ID: 3)
FROM inserted_offers io 
WHERE io.title LIKE '%ESTIN%';