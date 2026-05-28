CREATE TABLE scales_reference (
  scale_id CHARACTER VARYING(3) NOT NULL,
  scale_name CHARACTER VARYING(50) NOT NULL,
  minimum DECIMAL(1,0) NOT NULL,
  maximum DECIMAL(3,0) NOT NULL,
  PRIMARY KEY (scale_id));
GO

INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('AO', 'Automation', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('CF', 'Frequency', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('CN', 'Amount of Contact', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('CT', 'Context', 1, 3);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('CTP', 'Context (Categories 1-3)', 0, 100);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('CX', 'Context', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('CXP', 'Context (Categories 1-5)', 0, 100);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('DR', 'Distinctiveness Rank', 0, 10);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('EX', 'Extent', 1, 7);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('FM', 'Amount of Freedom', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('FT', 'Frequency of Task (Categories 1-7)', 0, 100);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('HW', 'Hours Per Week', 1, 3);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('IH', 'Occupational Interest High-Point', 0, 6);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('IJ', 'Importance', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('IM', 'Importance', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('IP', 'Impact of Decisions', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('LC', 'Level of Competition', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('LV', 'Level', 0, 7);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('OI', 'Occupational Interests', 1, 7);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('OJ', 'On-The-Job Training (Categories 1-9)', 0, 100);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('PT', 'On-Site Or In-Plant Training (Categories 1-9)', 0, 100);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('PX', 'Proximity', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('RE', 'Responsibility', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('RL', 'Required Level Of Education (Categories 1-12)', 0, 100);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('RT', 'Relevance of Task', 0, 100);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('RW', 'Related Work Experience (Categories 1-11)', 0, 100);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('SR', 'How Serious', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('TI', '% Time', 1, 5);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('VH', 'Work Value High-Point', 1, 6);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('WI', 'Work Styles Impact', -3, 3);
INSERT INTO scales_reference (scale_id, scale_name, minimum, maximum) VALUES ('WS', 'Work Schedule', 1, 3);
GO

