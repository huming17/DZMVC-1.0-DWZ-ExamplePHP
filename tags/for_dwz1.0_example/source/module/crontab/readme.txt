���ݲ����裺
1��smbmount debain��װ 
sudo apt-get install smbfs
����
2�����ر�������Ŀ¼
������������������: mkdir /home/backup
������������:smbmount //58.222.157.2/backup_folder /home/backup -o username=administrator,password=******

ע��ȡ���������� umount /home/backup
����
3����ʱ����shell�ű�
���ݽű���site_backup 

4��rontab_task ��ʱ���� ���ص� www �û���crontab ������(www�û���Ҫ�Ա���Ŀ¼��Ȩ�޶�д/����)
root> crontab -u www /home/wwwroot/haier_tpm/source/module/crontab/crontab_task

��������һ��
0 0 * * * /path/site_backup > /dev/null 2>&1

ÿ���������һ�α���
ע��ʱ��ʽ˵��

��ʱ����	��ʱ��ʽ
ÿ����ִ�����	*/5 * * * * /path/site_backup > /dev/null 2>&1
ÿСʱִ��		0 * * * * /path/site_backup > /dev/null 2>&1
ÿ��ִ��		0 0 * * * /path/site_backup > /dev/null 2>&1
ÿ��ִ��		0 0 * * 0 /path/site_backup > /dev/null 2>&1
ÿ��ִ��		0 0 1 * * /path/site_backup > /dev/null 2>&1
ÿ��ִ��		0 0 1 1 * /path/site_backup > /dev/null 2>&1
����
5���鿴��ʱ�����Ƿ��Ѽ���
root> crontab -l -u www

0 0 * * * /home/wwwroot/haier_tpm/source/module/crontab/cron_backup_trigger

���߽���
 crontab_task ��ʱ���� ���ص� www �û���crontab ������
