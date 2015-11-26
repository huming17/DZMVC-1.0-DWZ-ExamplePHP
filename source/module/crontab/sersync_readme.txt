//��װrsync
apt-get -y install rsync

cat /etc/rsyncd.conf
vim /etc/rsyncd.conf

//CONF�ļ�����
uid=root
gid=root
max connections=300
use chroot=no
log file=/var/log/rsyncd.log
pid file=/var/run/rsyncd.pid
lock file=/var/run/rsyncd.lock

[wwwroot]
path = /home/wwwroot
comment = data directory file
read only = no
ignore errors = yes
hosts allow = 192.168.1.0/24
hosts deny = *


//����daemon�ķ�ʽ������
/usr/bin/rsync --daemon --config=/etc/rsyncd.conf

//��֤rsync�Ƿ�����
//�鿴���̺Ͷ˿��Ƿ����
ps aux | grep rsync

//��װsersync
//���ذ�װ�ļ�
wget http://sersync.googlecode.com/files/sersync2.5_64bit_binary_stable_final.tar.gz

//��ѹ����������װĿ¼
tar xzvf sersync2.5_64bit_binary_stable_final.tar.gz
mv GNU-Linux-x86 /usr/local/sersync

cd /usr/local/sersync && cat confxml.xml
cd /usr/local/sersync && vim confxml.xml

//XML�����ļ�����
<?xml version="1.0" encoding="ISO-8859-1"?>
<head version="2.5">
    <host hostip="localhost" port="8008"></host>
    <debug start="false"/>
    <fileSystem xfs="false"/>
    <filter start="true">
	<exclude expression="(.*)\.svn"></exclude>
	<exclude expression="(.*)\.gz"></exclude>
	<exclude expression="(.*)\.log"></exclude>
	<exclude expression="^info/*"></exclude>
	<exclude expression="^static/*"></exclude>
    </filter>
    <inotify>
	<delete start="true"/>
	<createFolder start="true"/>
	<createFile start="true"/>
	<closeWrite start="true"/>
	<moveFrom start="true"/>
	<moveTo start="true"/>
	<attrib start="false"/>
	<modify start="true"/>
    </inotify>
    <sersync>
	<localpath watch="/home/wwwroot">
	    <remote ip="192.168.1.101" name="wwwroot"/>
	    <remote ip="192.168.1.102" name="wwwroot"/>
	    <!--<remote ip="192.168.1.103" name="wwwroot"/>-->
	</localpath>
	<rsync>
	    <commonParams params="-artuz"/>
	    <auth start="false" users="root" passwordfile="/etc/rsync.pas"/>
	    <userDefinedPort start="false" port="874"/><!-- port=874 -->
	    <timeout start="false" time="100"/><!-- timeout=100 -->
	    <ssh start="false"/>
	</rsync>
	<failLog path="/tmp/rsync_fail_log.sh" timeToExecute="60"/><!--default every 60mins execute once-->
	<crontab start="false" schedule="600"><!--600mins-->
	    <crontabfilter start="false">
		<exclude expression="*.php"></exclude>
		<exclude expression="info/*"></exclude>
	    </crontabfilter>
	</crontab>
	<plugin start="false" name="command"/>
    </sersync>
    <plugin name="command">
	<param prefix="/bin/sh" suffix="" ignoreError="true"/>
	<filter start="false">
	    <include expression="(.*)\.php"/>
	    <include expression="(.*)\.sh"/>
	</filter>
    </plugin>
    <plugin name="socket">
	<localpath watch="/home/wwwroot">
	    <deshost ip="192.168.16.113" port="8009"/>
	</localpath>
    </plugin>
</head>

ע��:���ļ�����attrib,8��8G���ڱ�������

����sersync
/usr/local/sersync/sersync2 -d -r -o /usr/local/sersync/confxml.xml

����������
echo "/usr/bin/rsync --daemon --config=/etc/rsyncd.conf" >> /etc/rc.d/rc.local
echo "/usr/local/sersync/sersync2 -d -r -o /usr/local/sersync/confxml.xml" >> /etc/rc.d/rc.local

ע��:�е�ϵͳ�� /etc/rc.local
/usr/bin/rsync --daemon --config=/etc/rsyncd.conf
/usr/local/sersync/sersync2 -d -r -o /usr/local/sersync/confxml.xml

���̷��Ұ�ȫ�������붨ʱ����
cat /var/script/checksersync.sh
*/5 * * * * /var/script/check_sersync.sh > /dev/null 2>&1

�ű���������
#!/bin/bash
# usage:
#	1.Copy Shell To SersyncPath
#       chmod +x checksersync.sh
#       2.Add Crontab
#       */5 * * * * [sersyncPath]/checksersync.sh

logfile='/var/log/checksersync.log';

function sersync_is_running(){
	threadnum=`ps aux|grep sersync2|grep -v grep -wc`;
	if [ "$threadnum" -eq '0' ];then
		echo '0';
	else
		echo '1';
	fi
	return;
}

function current_time(){
	if [ -z "$1" ];then
                format="%Y-%m-%d %H:%M:%S%Z";
        else
                format=$1;
        fi
        echo `date +"$format"`;
        return;
}

function logtofile(){
	echo $(current_time) $2>>$1;
}

function sersync_restart(){
	/usr/local/sersync/sersync2 -d -r -o /usr/local/sersync/confxml.xml >/dev/null 2>&1;
	sleep 3;
	threadnum=$(sersync_is_running);
	if [ $threadnum -eq '0' ]; then
		echo "0";
	else
		echo '1';
	fi
	return;
}

isrunning=$(sersync_is_running);

if [ "$isrunning" -eq '0' ];then
	logtofile $logfile "sersync service was died.";
	restart=$(sersync_restart);
	if [ $restart -eq '0' ];then
		logtofile $logfile "sersync service restart failed.";
	else
		logtofile $logfile "sersync service restart success.";
	fi
else
	logtofile $logfile "sersync service is running.";
fi
exit 0;



//��������:
1��rsync�������ͷ���ǽ���ŷ���˿�
Linux ����ǽ����iptables���������������ڷ�������Ҫ�����������rsync �������˿�ͨ�����ͻ�����ҲӦ����ͨ����
#iptables -A INPUT -p tcp -m state --state NEW  -m tcp --dport 873 -j ACCEPT
#iptables -L  �鿴һ�·���ǽ�Ƿ�� 873�˿ڣ�


�ر�SELINUX

vi /etc/selinux/config #�༭����ǽ�����ļ�

#SELINUX=enforcing #ע�͵�
#SELINUXTYPE=targeted #ע�͵�
SELINUX=disabled #����

:wq! #���棬�˳�

setenforce 0 #������Ч

2����������ǽtcp 873�˿ڣ�RsyncĬ�϶˿ڣ�

Linux ����ǽ����iptables���������������ڷ�������Ҫ�����������rsync �������˿�ͨ�����ͻ�����ҲӦ����ͨ����
#iptables -A INPUT -p tcp -m state --state NEW  -m tcp --dport 873 -j ACCEPT
#iptables -L  �鿴һ�·���ǽ�Ƿ�� 873�˿ڣ�

����

vi /etc/sysconfig/iptables #�༭����ǽ�����ļ�
����
-A RH-Firewall-1-INPUT -m state --state NEW -m tcp -p tcp --dport 873 -j ACCEPT
:wq! #�����˳�
/etc/init.d/iptables restart #�����������ǽʹ������Ч

3������ɱ����
for i in `ps aux | grep rsync|awk '{print $2}'`
do
kill $i
done

4����ʱ����
step=2
for (( i = 0; i < 60; i=(i+step) )); do
$(php '/home/wwwroot/php/crontab/do_or_log.php')
sleep $step
done
exit 0


5�����ͬ��������
 ����1:�ļ������Ƿ���ͬ find ./ -type f | wc -l