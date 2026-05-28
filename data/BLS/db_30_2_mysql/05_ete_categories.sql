/*! START TRANSACTION */;
CREATE TABLE ete_categories (
  element_id CHARACTER VARYING(20) NOT NULL,
  scale_id CHARACTER VARYING(3) NOT NULL,
  category DECIMAL(3,0) NOT NULL,
  category_description CHARACTER VARYING(1000) NOT NULL,
  PRIMARY KEY (element_id, scale_id, category),
  FOREIGN KEY (element_id) REFERENCES content_model_reference(element_id),
  FOREIGN KEY (scale_id) REFERENCES scales_reference(scale_id));
/*! COMMIT */;
/*! START TRANSACTION */;

INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 1, 'Less than a High School Diploma');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 2, 'High School Diploma - or the equivalent (for example, GED)');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 3, 'Post-Secondary Certificate - awarded for training completed after high school (for example, in agriculture or natural resources, computer services, personal or culinary services, engineering technologies, healthcare, construction trades, mechanic and repair technologies, or precision production)');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 4, 'Some College Courses');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 5, 'Associate''s Degree (or other 2-year degree)');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 6, 'Bachelor''s Degree');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 7, 'Post-Baccalaureate Certificate - awarded for completion of an organized program of study; designed for people who have completed a Baccalaureate degree but do not meet the requirements of academic degrees carrying the title of Master.');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 8, 'Master''s Degree');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 9, 'Post-Master''s Certificate - awarded for completion of an organized program of study; designed for people who have completed a Master''s degree but do not meet the requirements of academic degrees at the doctoral level.');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 10, 'First Professional Degree - awarded for completion of a program that: requires at least 2 years of college work before entrance into the program, includes a total of at least 6 academic years of work to complete, and provides all remaining academic requirements to begin practice in a profession.');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 11, 'Doctoral Degree');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('2.D.1', 'RL', 12, 'Post-Doctoral Training');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 1, 'None');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 2, 'Up to and including 1 month');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 3, 'Over 1 month, up to and including 3 months');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 4, 'Over 3 months, up to and including 6 months');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 5, 'Over 6 months, up to and including 1 year');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 6, 'Over 1 year, up to and including 2 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 7, 'Over 2 years, up to and including 4 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 8, 'Over 4 years, up to and including 6 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 9, 'Over 6 years, up to and including 8 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 10, 'Over 8 years, up to and including 10 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.1', 'RW', 11, 'Over 10 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 1, 'None');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 2, 'Up to and including 1 month');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 3, 'Over 1 month, up to and including 3 months');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 4, 'Over 3 months, up to and including 6 months');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 5, 'Over 6 months, up to and including 1 year');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 6, 'Over 1 year, up to and including 2 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 7, 'Over 2 years, up to and including 4 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 8, 'Over 4 years, up to and including 10 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.2', 'PT', 9, 'Over 10 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 1, 'None or short demonstration');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 2, 'Anything beyond short demonstration, up to and including 1 month');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 3, 'Over 1 month, up to and including 3 months');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 4, 'Over 3 months, up to and including 6 months');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 5, 'Over 6 months, up to and including 1 year');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 6, 'Over 1 year, up to and including 2 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 7, 'Over 2 years, up to and including 4 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 8, 'Over 4 years, up to and including 10 years');
INSERT INTO ete_categories (element_id, scale_id, category, category_description) VALUES ('3.A.3', 'OJ', 9, 'Over 10 years');
/*! COMMIT */;

