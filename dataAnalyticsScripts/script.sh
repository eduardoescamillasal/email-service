# download de los permisos de la instancia EC2
chmod 400 "mulderec2.pem"
ssh -i "mulderec2.pem" ec2-user@ec2-52-91-191-50.compute-1.amazonaws.com

wget http://media.sundog-soft.com/AWSBigData/LogGenerator.zip
unzip LogGenrator.zip
chmod a+z LogGenerator.py

sudo mkdir /var/log/cadabra
cd /etc/aws-kinesis 
nano agent.json


sudo yum install -y aws-kinesis-agent
which aws-kinesis-agent
sudo find / -name aws-kinesis agent

sudo /etc/rc.d/init.d/aws-kinesis-agent start
sudo /etc/rc.d/init.d/aws-kinesis-agent status

sudo chkconfig aws-kinesis-agent on

sudo service aws-kinesis-agent start

cd ~

sudo ./LogGenerator.py 500000

cd /var/log/cadabra/
tail -f /var/log/aws-kinesis-agent/aws-kinesis-agent.log

#024-01-24 19:47:04.655+0000  (FileTailer[fh:PurchaseLogs:/var/log/cadabra/*.log]) com.amazon.kinesis.streaming.agent.tailing.FirehoseParser [INFO] FirehoseParser[fh:PurchaseLogs:/var/log/cadabra/*.log]: Opening /var/log/cadabra/20240124-194704.log for parsing.
#2024-01-24 19:47:04.907+0000  (sender-0) com.amazon.kinesis.streaming.agent.UserDefinedCredentialsProvider [INFO] No custom implementation of credentials provider present in the config file
#2024-01-24 19:47:06.664+0000  (sender-1) com.amazon.kinesis.streaming.agent.UserDefinedCredentialsProvider [INFO] No custom implementation of credentials provider present in the config file
#2024-01-24 19:47:24.895+0000  (FileTailer[fh:PurchaseLogs:/var/log/cadabra/*.log].MetricsEmitter RUNNING) com.amazon.kinesis.streaming.agent.tailing.FileTailer [INFO] FileTailer[fh:PurchaseLogs:/var/log/cadabra/*.log]: Tailer Progress: Tailer has parsed 500000 records (42036722 bytes),