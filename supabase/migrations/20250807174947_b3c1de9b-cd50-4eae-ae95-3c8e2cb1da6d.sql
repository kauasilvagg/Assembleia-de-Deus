-- Clean up all fictional/demo data for production

-- Delete demo events
DELETE FROM event_registrations;
DELETE FROM events;

-- Delete demo blog posts  
DELETE FROM blog_posts;

-- Delete demo sermons
DELETE FROM sermons;

-- Delete demo ministries and related data
DELETE FROM ministry_memberships;
DELETE FROM ministry_schedules;
DELETE FROM ministries;

-- Delete demo contact messages
DELETE FROM contact_messages;

-- Delete demo courses and enrollments
DELETE FROM course_enrollments;
DELETE FROM courses;

-- Delete demo cells and memberships
DELETE FROM cell_memberships;
DELETE FROM cells;

-- Delete demo volunteers
DELETE FROM volunteers;

-- Delete demo bookings
DELETE FROM bookings;

-- Delete demo communications
DELETE FROM communications;

-- Reset any demo user roles (keep only real users)
-- Note: This will not delete user accounts, only demo roles

-- Reset sequences if needed (optional, for clean ID numbering)
-- ALTER SEQUENCE IF EXISTS events_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS blog_posts_id_seq RESTART WITH 1;