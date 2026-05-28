/*! START TRANSACTION */;
CREATE TABLE task_categories (
  scale_id CHARACTER VARYING(3) NOT NULL,
  category DECIMAL(3,0) NOT NULL,
  category_description CHARACTER VARYING(1000) NOT NULL,
  PRIMARY KEY (scale_id, category),
  FOREIGN KEY (scale_id) REFERENCES scales_reference(scale_id));
/*! COMMIT */;
/*! START TRANSACTION */;

INSERT INTO task_categories (scale_id, category, category_description) VALUES ('FT', 1, 'Yearly or less');
INSERT INTO task_categories (scale_id, category, category_description) VALUES ('FT', 2, 'More than yearly');
INSERT INTO task_categories (scale_id, category, category_description) VALUES ('FT', 3, 'More than monthly');
INSERT INTO task_categories (scale_id, category, category_description) VALUES ('FT', 4, 'More than weekly');
INSERT INTO task_categories (scale_id, category, category_description) VALUES ('FT', 5, 'Daily');
INSERT INTO task_categories (scale_id, category, category_description) VALUES ('FT', 6, 'Several times daily');
INSERT INTO task_categories (scale_id, category, category_description) VALUES ('FT', 7, 'Hourly or more');
/*! COMMIT */;

