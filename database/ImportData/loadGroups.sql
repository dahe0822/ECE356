LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/group/group0.csv' INTO TABLE `Groups` FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (admin_id,name,memberSizeLimit,created_at);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/group/group1.csv' INTO TABLE `Groups` FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (admin_id,name,memberSizeLimit,created_at);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/group/group2.csv' INTO TABLE `Groups` FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (admin_id,name,memberSizeLimit,created_at);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/group/group3.csv' INTO TABLE `Groups` FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (admin_id,name,memberSizeLimit,created_at);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/group/group4.csv' INTO TABLE `Groups` FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (admin_id,name,memberSizeLimit,created_at);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/group/group5.csv' INTO TABLE `Groups` FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (admin_id,name,memberSizeLimit,created_at);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/groupMember.csv' INTO TABLE GroupMembers FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (group_id, user_id, joined_at);
