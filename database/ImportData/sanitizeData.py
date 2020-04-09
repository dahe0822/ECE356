# import names;
import glob
from datetime import date
import random

def process_user_data():
    path = "./ori_users/*.csv"
    count = -1
    userCount = -1
    with open("./sanitizedData/userList_helper.csv", "w", encoding="utf-8") as outFile2:
        userList = []
        for fname in glob.glob(path):
            count += 1
            with open(fname, 'r', encoding="utf-8") as sourceFile:
                with open("./sanitizedData/userTable/user{0}.csv".format(count), "w", encoding="utf-8") as outFile:
                    firstLine = True

                    for line in sourceFile:
                        if firstLine:
                            outFile.write('id,username,joined_at\n')
                            firstLine = False
                            continue
                        
                        userCount += 1
                        row_list = line.split('","')

                        id_to_write = row_list[0][1:] if row_list[0] else ""
                        userList.append(id_to_write)
                        values_to_write = (
                            id_to_write, (row_list[1]+str(userCount)).replace(',', ''), row_list[3])
                        values_to_write_st = ','.join(values_to_write)

                        outFile.write(values_to_write_st+'\n')
        outFile2.write(','.join(userList))

def gen_load_sql():
    with open("./loadUsers.sql", "w", encoding="utf-8") as outFile:
        for count in range(45):
            outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/userTable/user"+str(count)+".csv' INTO TABLE Users FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (@id,@username,@joined_at)\
                                SET user_id= @id,\
                                username = @username,\
                                joined_at= STR_TO_DATE(@joined_at, \"%Y-%m-%d\");\n")

def follower_data():
    start_dt = date.today().replace(day=1, month=1).toordinal()
    end_dt = date.today().toordinal()

    # read list of users
    userSet = set()
    with open("./sanitizedData/userList_helper.csv", 'r', encoding="utf-8") as userListFile:
        userList = []
        for line in userListFile:
            userList = line.split(",")
            for user in userList:
                userSet.add(user)

    path = "./ori_users/*.csv"
    count = -1
    for fname in glob.glob(path):
        count += 1
        with open(fname, 'r', encoding="utf-8") as sourceFile:
            with open("./sanitizedData/userFollow/following{0}.csv".format(count), "w", encoding="utf-8") as outFile:
                firstLine = True

                for line in sourceFile:
                    if firstLine:
                        outFile.write('user_id,follower_id,followed_at\n')
                        firstLine = False
                        continue
                    row_list = line.split('","')
                    # generate random date
                    random_day = date.fromordinal(random.randint(start_dt, end_dt))

                    # Separate friends.
                    if row_list[4]=="None":
                        continue
                    friends = row_list[4].split(", ")

                    # Loop and print each user-friend-date.
                    id_to_write = row_list[0][1:] if row_list[0] else ""
                    for idx, friend in enumerate(friends):
                        if not friend in userSet:
                            continue
                        if idx > 3:
                            break
                        values_to_write = (id_to_write, friend, str(random_day))
                        values_to_write_st = ','.join(values_to_write)

                        outFile.write(values_to_write_st+'\n')

def follower_data_sql():
    with open("./loadFollowing.sql", "w", encoding="utf-8") as outFile:
        for count in range(45):
            outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/userFollow/following"+str(count)+".csv' INTO TABLE Following FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (@user_id,@follower_id,@followed_at)\
                                SET user_id= @user_id, follower_id = @follower_id, followed_at= STR_TO_DATE(@followed_at, \"%Y-%m-%d\");\n")


def group_member_data():
    start_dt = date.today().replace(day=1, month=1).toordinal()
    end_dt = date.today().toordinal()

    userList = []
    # read list of users
    with open("./sanitizedData/userList_helper.csv", 'r', encoding="utf-8") as userListFile:
        for line in userListFile:
            userList = line.split(",")

    #groupname -> [groupId, admin, random_day] map
    groupList = {}
    groupCount = 0

    path = "./ori_business/*.csv"
    count = -1
    for fname in glob.glob(path):
        count += 1
        with open(fname, 'r', encoding="utf-8") as sourceFile:
            with open("./sanitizedData/group/group{0}.csv".format(count), "w", encoding="utf-8") as outFile:
                firstLine = True

                for line in sourceFile:
                    if firstLine:
                        outFile.write('admin_id,name,memberSizeLimit,created_at\n')
                        firstLine = False
                        continue

                    row_list = line.split(',')
                    if len(row_list) > 13: continue #bad data

                    if len(row_list[2])<=0 or row_list[2] in groupList: continue #neighborhood group
                    admin = random.choice(userList)
                    random_day = str(date.fromordinal(random.randint(start_dt, end_dt))) # generate random date
                    values_to_write = (admin, row_list[2], str(random.randint(5, 20)), random_day)
                    groupCount+=1
                    groupList[row_list[2]] = [groupCount, admin, random_day]
                    values_to_write_st = ','.join(values_to_write)

                    outFile.write(values_to_write_st+'\n')

    # list of groups members to add (the admin)
    with open("./sanitizedData/groupMember.csv", "w", encoding="utf-8") as outFile2:
        outFile2.write('group_id, user_id, joined_at\n')
        for value in groupList.values():
            values_to_write = (str(value[0]), value[1], value[2])
            values_to_write_st = ','.join(values_to_write)
            outFile2.write(values_to_write_st+'\n')
    # list all groupId - groupName
    with open("./sanitizedData/groupList_helper.csv", "w", encoding="utf-8") as outFile3:
        outFile3.write('group_id, group_name\n')
        for group in groupList:
            values_to_write = (str(groupList[group][0]), group)
            values_to_write_st = ','.join(values_to_write)
            outFile3.write(values_to_write_st+'\n')

def group_member_sql():
    with open("./loadGroups.sql", "w", encoding="utf-8") as outFile:
        for count in range(6):
            outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/group/group"+str(count)+".csv' INTO TABLE `Groups` FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (admin_id,name,memberSizeLimit,created_at);\n")    
        outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/groupMember.csv' INTO TABLE GroupMembers FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (group_id, user_id, joined_at);\n")


def post_data():
    start_dt = date.today().replace(day=1, month=1).toordinal()
    end_dt = date.today().toordinal()
    postIdList = [] #postIdList
    groupPosts = {} #postID, groupID
    userList = []
    # read list of users
    with open("./sanitizedData/userList_helper.csv", 'r', encoding="utf-8") as userListFile:
        for line in userListFile:
            userList = line.split(",")

    #read list of groups
    groupSet = {} # map group_name -> group_id
    with open("./sanitizedData/groupList_helper.csv", 'r', encoding="utf-8") as groupListFile:
        firstLine = True
        id = 0
        for line in groupListFile:
            if firstLine:
                firstLine = False
                continue
            groupList = line.split(",")
            groupSet[groupList[1].rstrip()] = groupList[0]

    path = "./ori_business/*.csv"
    count = -1
    for fname in glob.glob(path):
        count += 1
        with open(fname, 'r', encoding="utf-8") as sourceFile:
            with open("./sanitizedData/postTable/post{0}.csv".format(count), "w", encoding="utf-8") as outFile:
                firstLine = True

                for line in sourceFile:
                    if firstLine:
                        outFile.write('post_id,author_id,private,title,content_body,created_at\n')
                        firstLine = False
                        continue

                    row_list = line.split(',')
                    if len(row_list) > 13: continue #bad data
                    # generate random date
                    random_day = date.fromordinal(random.randint(start_dt, end_dt))
                    
                    private = len(row_list[2])>0  #neighborhood group
                    if private:
                        groupPosts[row_list[0]] = groupSet[row_list[2]] #map post - groupId
                    postIdList.append(row_list[0])
                    values_to_write = (row_list[0], random.choice(userList), str(private), row_list[1].replace('"', ''), row_list[3].replace('"', ''), str(random_day))
                    values_to_write_st = ','.join(values_to_write)

                    outFile.write(values_to_write_st+'\n')
    # posts - group mapping
    with open("./sanitizedData/groupPosts.csv", "w", encoding="utf-8") as outFile2:
        outFile2.write('group_id, post_id\n')
        for key in groupPosts:
            values_to_write = (groupPosts[key], key.rstrip())
            values_to_write_st = ','.join(values_to_write)
            outFile2.write(values_to_write_st+',\n')

    # list all postId
    with open("./sanitizedData/postId_helper.csv", "w", encoding="utf-8") as postIdOut:
        postIdOut.write(','.join(postIdList))

def post_data_sql():
    with open("./loadPost.sql", "w", encoding="utf-8") as outFile:
        for count in range(6):
            outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/postTable/post"+str(count)+".csv' INTO TABLE Posts FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (post_id,author_id,@private,title,content_body,@created_at)\
                                SET created_at= STR_TO_DATE(@created_at, \"%Y-%m-%d\"), private=(@private = 'True');\n")         
        outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/groupPosts.csv' INTO TABLE GroupPosts FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (group_id, post_id,@nothing)\n")

def post_hashtag_data():
    path = "./ori_business/*.csv"
    count = -1

    hashtagSet = set()
    hashtagList = []
    for fname in glob.glob(path):
        count += 1
        with open(fname, 'r', encoding="utf-8") as sourceFile:
            with open("./sanitizedData/postHashtag/postHashtag{0}.csv".format(count), "w", encoding="utf-8") as outFile:
                firstLine = True

                for line in sourceFile:
                    if firstLine:
                        outFile.write('post_id,hashtag_id\n')
                        firstLine = False
                        continue

                    row_list = line.split(',')
                    if len(row_list) > 13: continue #bad data

                    #split hashtags
                    hashtagInPost = row_list[-1].split(";")
                    
                    # Loop and print each post-hashtag
                    for hashtag in hashtagInPost:
                        hashtag = hashtag.rstrip()
                        if not (hashtag in hashtagSet):
                            hashtagSet.add(hashtag)
                            hashtagList.append(hashtag)
                            
                        hashtagId = hashtagList.index(hashtag)+1 if hashtag in hashtagSet else len(hashtagList)

                        values_to_write = (row_list[0], str(hashtagId))
                        values_to_write_st = ','.join(values_to_write)

                        outFile.write(values_to_write_st+'\n')
                        
    with open("./sanitizedData/hashtagList.csv", "w", encoding="utf-8") as outFile2:
        outFile2.write('name\n')
        outFile2.write("\n".join(hashtagList))

def post_hashtag_sql():
    with open("./loadHashtagPost.sql", "w", encoding="utf-8") as outFile:
        outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/hashtagList.csv' INTO TABLE Hashtag FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (name);\n")
        for count in range(6):
            outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/postHashtag/postHashtag"+str(count)+".csv' INTO TABLE PostHashtag FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (post_id,hashtag_id);\n")    


def comment_data():
    # read list of users
    userSet = set()
    with open("./sanitizedData/userList_helper.csv", 'r', encoding="utf-8") as userListFile:
        for line in userListFile:
            userList = line.split(",")
            for user in userList:
                userSet.add(user)
    # read list of posts
    postSet = set()
    with open("./sanitizedData/postId_helper.csv", 'r', encoding="utf-8") as postListFile:
        for line in postListFile:
            postList = line.split(",")
            for post in postList:
                postSet.add(post)

    path = "./ori_comments/*.csv"
    count = -1
    for fname in glob.glob(path):
        count += 1
        with open(fname, 'r', encoding="utf-8") as sourceFile:
            with open("./sanitizedData/comment/comment{0}.csv".format(count), "w", encoding="utf-8") as outFile:
                firstLine = True

                for line in sourceFile:
                    if firstLine:
                        outFile.write('post_id,comment,created_at,author_id\n')
                        firstLine = False
                        continue
                      
                    row_list = line.split('","')
                    if len(row_list) > 5: continue #bad data

                    comment = row_list[0][1:] if row_list[0] else ""
                    author = row_list[-1].rstrip().replace('"','')
                    if not author in userSet: continue
                    postId = row_list[-2]
                    if not postId in postSet: continue
                    values_to_write = (postId, comment, row_list[1], author)
                    values_to_write_st = ','.join(values_to_write)
                    outFile.write(values_to_write_st+'\n')

def comment_sql():
    with open("./loadComment.sql", "w", encoding="utf-8") as outFile:
        for count in range(39):
            outFile.write("LOAD DATA LOCAL INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sanitizedData/comment/comment"+str(count)+".csv' INTO TABLE `Comments` FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '\\\\' lines terminated by '\\n' IGNORE 1 LINES (post_id,comment,created_at,author_id);\n")    


def main():
    process_user_data()
    gen_load_sql()

    follower_data()
    follower_data_sql()

    group_member_data()
    group_member_sql()

    post_data()
    post_data_sql()

    post_hashtag_data()
    post_hashtag_sql()

    comment_data()
    comment_sql()

if __name__ == "__main__":
    main()
