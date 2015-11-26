#!/bin/bash
#���ݿ���Ϣ
db_user=###db_user###
db_passwd=###db_passwd###
db_host=###db_host###
#�ļ���  
file_name=`date +%Y%m%d`.sql
webfile_name=`date +%Y%m%d`.web
backup_dir=###root_path###/data/backup/
www_dir=###wwwroot_path###/
#mysql�������������λ��  
mysql=/usr/local/mysql/bin/mysql  
mysqldump=/usr/local/mysql/bin/mysqldump
 
#���Ա���Ŀ¼�Ƿ��д���������д�ͱ����˳�  
test ! -w $backup_dir && echo "Error: $backup_dir is unwrite." && exit 0 

#�����ɵı������ݿ��Ƿ���ڣ�����ھ�ɾ��
test -d "$backup_dir/backup.7/" && rm -rf "$backup_dir/backup.7" 

#ѭ���޸ı������ݿ�Ŀ¼�ı�ţ���¼�¾ɳ̶�  
for i in 6 5 4 3 2 1 0
do 
    if(test -d "$backup_dir"/backup."$i")  
    then  
        next_i=`expr $i + 1`  
        mv "$backup_dir"/backup."$i" "$backup_dir"/backup."$next_i" 
    fi  
done  

#���Ա���Ŀ¼�����±����ļ����Ƿ���ڣ�������ھʹ���  
test ! -d "$backup_dir/backup.1/" && mkdir "$backup_dir/backup.1" 
   
#�ƶ�Ҫ���ݵ����ݿ�
for db in ###db_name###  
do 
    $mysqldump -u $db_user -h $db_host -p$db_passwd --opt -B $db | gzip -6 > "$backup_dir/backup.1/$db.$file_name.gz"
done 

#�ƶ�Ҫ���ݵ�WEBĿ¼(���WEB�޴�,��ע�ʹ˶δ���,��������˹���ʽ)  
for www in ###www_name###
do 
    tar -zcvf $backup_dir/backup.1/$www.$webfile_name.tar.gz --directory=$www_dir$www --exclude=./data/backup ./
done 

exit 0;
