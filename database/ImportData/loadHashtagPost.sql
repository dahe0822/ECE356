LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/hashtagList.csv' INTO TABLE Hashtag FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (name);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/postHashtag/postHashtag0.csv' INTO TABLE PostHashtag FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (post_id,hashtag_id);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/postHashtag/postHashtag1.csv' INTO TABLE PostHashtag FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (post_id,hashtag_id);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/postHashtag/postHashtag2.csv' INTO TABLE PostHashtag FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (post_id,hashtag_id);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/postHashtag/postHashtag3.csv' INTO TABLE PostHashtag FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (post_id,hashtag_id);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/postHashtag/postHashtag4.csv' INTO TABLE PostHashtag FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (post_id,hashtag_id);
LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/postHashtag/postHashtag5.csv' INTO TABLE PostHashtag FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '\\' lines terminated by '\n' IGNORE 1 LINES (post_id,hashtag_id);