# ওয়েব ডেভেলপমেন্ট ও ডকার (Docker) | পিএইচপি | ওরাকল | পর্ব ২.১

ডকার (Docker) নিয়ে আলোচনা করার আগে এই পর্বে একটা উদাহারন দিয়ে বুঝানোর চেষ্টা করব যে ডকার ডেভেলপমেন্ট ও প্রোডাকশন এনভাইরনমেন্ট এর জন্য কতটা সুবিধাজনক হতে পারে । উদাহরনের জন্য ওয়েব ডেভেলপমেন্ট  নিয়ে কথা বলি কারণ আমারা মোটামটি সবাই ওয়েব ডেভেলপমেন্টের সাথে পরিচিত এবং প্রোফেসনাল নয়ত ইউনিভার্সিটির জীবনে একবার না একবার একটা না একটা ওয়েব ডেভেলপমেন্ট প্রোজেক্ট তো করতেই হয়েছে ।

ইউনিভার্সিটিতে আমাদের ৩য় বর্ষে ২য় সেমিস্টারে Oracle ডাটাবেস এর PL/SQL দিয়ে একটা প্রোজেক্ট করতে বলা হয়েছিল । অনেকেই অনেক ল্যাঙ্গুয়েজ পছন্দ করে , তবে বেশিভাগই PHP , JAVA , .NET etc.. এর দিকে যায় প্রোজেক্ট করার সুবিধার জন্য ।  এখানে অমি PHP & Oracle PL/SQL নিয়ে আলোচনা করব ।

শুরুতেই একটা বিষয় বলে ফেলি সেটা হল ডকারফাইল (Dockerfile) । ডকারফাইল নিয়ে বিস্তারিত আমরা পরের পর্বে দেখব , এখন শুধু মাথায় এটা রাখলেই চলবে যে ডকারফাইল হল অনেকটা Script এর মত । মানে এখানে যা কিছু লিখা থাকবে [ডকার ইঞ্জিন](https://docs.docker.com/engine/) তাই করবে । এটাকে ডকার ইঞ্জিনের ইন্সট্রাকশন বলতে পারেন । নিচে একটা  ডকারফাইল (Dockerfile) দেওয়া আছে যেখানে ধাপে ধাপে বলা আছে যে  PL/SQL দিয়ে PHP ডেভেলপমেন্ট করতে হলে আপনাকে কি কি করতে হতে পারে ।

যেহেতু অমি আরও Laravel 5 Framework ব্যবহার করেছিলাম তাই আমাকে কিছু অতিরিক্ত PHP Extension ও ইন্সটল করতে হয়েছিল ।

পুরো প্রোজেক্ট টা  [Github](https://github.com/sh0umik/laravel5-oracle-docker) এ দেওয়া আছে  [ডাউনলোড](https://github.com/sh0umik/laravel5-oracle-docker) করে  নিলে ভাল হয়  ।  ডাউনলোড করার পরে দেখবেন ফোল্ডারে Dockerfile  নামে  একটা ফাইল আছে  । এটা খুলুন ,  নীচের Script গুলো দেখতে পারবেন

```dockerfile
FROM php:7-apache

MAINTAINER Fahim Shariar <fahim.shoumik@gmail.com>

# installing required stuff
RUN apt-get update \
  && apt-get install -y unzip libaio-dev libmcrypt-dev git \
  && apt-get clean -y

# PHP extensions
RUN \
  docker-php-ext-configure pdo_mysql --with-pdo-mysql=mysqlnd \
  && docker-php-ext-configure mysqli --with-mysqli=mysqlnd \
  && docker-php-ext-install pdo_mysql \
  && docker-php-ext-install mbstring \
  && docker-php-ext-install mcrypt

# xdebug, if you want to debug
RUN pecl install xdebug

# PHP composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# apache configurations, mod rewrite
RUN ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load

# Oracle instantclient
# copy oracle files
ADD oracle/instantclient-basic-linux.x64-12.1.0.2.0.zip /tmp/
ADD oracle/instantclient-sdk-linux.x64-12.1.0.2.0.zip /tmp/
ADD oracle/instantclient-sqlplus-linux.x64-12.1.0.2.0.zip /tmp/

# unzip them
RUN unzip /tmp/instantclient-basic-linux.x64-12.1.0.2.0.zip -d /usr/local/ \
  && unzip /tmp/instantclient-sdk-linux.x64-12.1.0.2.0.zip -d /usr/local/ \
  && unzip /tmp/instantclient-sqlplus-linux.x64-12.1.0.2.0.zip -d /usr/local/

# install pecl
RUN curl -O http://pear.php.net/go-pear.phar \
  ; /usr/local/bin/php -d detect_unicode=0 go-pear.phar

# install oci8
RUN ln -s /usr/local/instantclient_12_1 /usr/local/instantclient \
  && ln -s /usr/local/instantclient/libclntsh.so.12.1 /usr/local/instantclient/libclntsh.so \
  && ln -s /usr/local/instantclient/sqlplus /usr/bin/sqlplus \
  && echo 'instantclient,/usr/local/instantclient' | pecl install oci8
```

পুরো জিনিসটা একটু একটু করে বুঝানোর চেষ্টা করি ,  প্রথমে,

**লাইন ১ঃ**   FROM php:7-apache এখানে বলা হয়েছে আমরা php এর 7 Apache ভার্সনের একটা Image দিয়ে পুরো জিনিসটা বানানো হবে । আর একটু বিস্তারিত বললে বলা যায় যে  আমরা php 7 & apache ইন্সটল করা আছে এরকম একটা ছোট্ট Image/Container ব্যবহার করব পুরো Environment টা বানানোর জন্য । অর্থাৎ ধরে নেই আমাদের PHP ইন্সটল করাই আছে ।

**লাইন ৭ঃ**  libaio-dev, libmcrypt-dev, git কিছু প্রয়োজনীয় Library ইন্সটল করা হচ্ছে লারাভেলের জন্য ।

**লাইন ১২- ১৬ঃ**  PHP Extension – pdo , mysqli , mbstring , mcrypt  ইন্সটল করা হচ্ছে যেগুলো আমাদের PHP প্রোজেক্ট ডেভেলপমেন্ট করার সময় ডাটাবেসের সাথে কানেক্ট করার সময় লাগবে ।

**লাইন ২২ ও ২৫ঃ**  লারাভেলের জন্য PHP Dependency Management Tool Composer ও Apache mod_rewrite Extension চালু করা হচ্ছে ।

**লাইন ৩০ – ৩৬ঃ**  ADD oracle/instantclient-basic-linux.x64-12.1.0.2.0.zip /tmp/ আমরা বলে দিচ্ছি যে আমাদের ডাউনলোড করা  
Oracle এর instantclient SDK যেন /temp এ কপি করে তারপরে /use/local এ আনজিপ করা হয় ।

**লাইন ৩৮-৩৯ঃ** PHP Extension Manager PECL ইন্সটল করা হল ।  কারণ PHP তে Oracle PL/SQL কোড কম্পাইল করার জন্য oci8 lib সাপোর্ট লাগে ।

**লাইন ৪১-৪৪ঃ** কিছু Symlink তৈরি করা হল কারণ লাইব্রেরি ইন্সটল করার সময় এসব Symlink থাকতে হবে নয়ত oci8 lib কম্পাইল হবে না । শেষের লাইন এ oci8 lib ইন্সটল করা হল ।

উপরের লাইন গুলিতে অমি জিনিসগুলো একটু সোজা করে বোঝানোর চেষ্টা করলাম , আপনারা একটু পড়ে দেখলেই বুঝতে পারবেন । যারা Linux / Unix ব্যবহার করেন তাঁদের কাছে লাইন গুলো অপরিচিত নয় । তাঁদের বুঝতে অসুবিধা হবে না আশা করি । মুল কথা হল আপনি যেই মেশিনেই Oracle PL/SQL with PHP ডেভেলপমেন্ট করেন না কেন আপনাকে এসব সেটআপ করতে হবে বিশেষ করে Linux/Unix দের

এরপরে Docker cli দিয়ে docker build . অথবা docker build -f Dockerfile কমান্ড  লিখলেই সব ইন্টারনেট থেকে ডকার নামিয়ে কনফিগার করে একটা Image/Container বানাবে ।

এই সব কিছু ম্যানুয়ালি করতে গিয়ে দেখবেন অনেক যায়গায় মিলছে না , বিশেষ করে যারা নতুন করে করছেন বা আগে কখনও করেন নি , হয়ত SDK ভার্সন মিলছে না , PHP বলছে এই Extension আমরা নতুন 7 ভার্সনে সাপোর্ট করি না , এরপরে Mysqli, PDO বলছে যে ঠিকমত oci8 কম্পাইল হয়নি আবার করতে হবে ইত্যাদি ইত্যাদি ।

![](/blog/web-development-docker-php-oracle-part-2-1-image-1.gif)

compile error !!

যদিও সব কিছু ঠিক থাক মত হয়ে গেল তারপরে পিসি কোন কারণে ক্রাশ করল , নয়ত বন্ধুদের মধ্যে কেউ বলল যে এবার আমার পিসিতেও করে দে !! অথবা আপনার বস বলল এই VPS এ পুরো Environment টা সেটআপ কর । তখন কি আবার থেকে করবেন ? উত্তরটা আপনি নিজেই ভাল করে জানেন ।

ডকারের আর একটা ভাল জিনিস হলো ডকারের ডেভেলপমেন্ট এখন অনেক পপুলার এবং ডেভেলপার কমেউনিটিতে এর সাপোর্ট অনেক ভাল । আপনি যা বানানোর কথা ভাবছেন গুগল করে দেখেন কেউ না কেউ সেই Dockerfile দিয়ে Image বানিয়ে রেখেছে। ওসব কালেকশন খুঁজতে সার্চ করুন [ডকারহাব](http://hub.docker.com/)  । ওখানে সব ইন্সট্রাকশন দেওয়া আছে , শুধু আপনার পিসিতে ডকার ইন্সটল করা থাকলে চলবে আর আপনাকে কিছু নতুন করে ইন্সটল করা লাগবে না ।

এখন কাজ শেষ হয়নি , আমরা শুধুমাত্র পিএইচপি ডেভেলপমেন্ট এনভাইরনমেন্ট সেটআপ করলাম এখন ডাটাবেসের সাথে সংযোগ বাকি !! । এটাও আমরা ডকারের মাধ্যমে করব , এখন আমরা আর Oracle এর ওয়েবসাইট থেকে 3 GB এর ফাইল ডাউনলোড করব না । আমরা ডকারহাবে খুঁজব যে Oracle Database এর কোন Container পাওয়া যায় কি না ।

[sath89/oracle-xe-11g](https://hub.docker.com/r/sath89/oracle-xe-11g/) একজন একটা এর ডকার Container বানিয়েছেন , ওটা এখন আমরা ব্যাবহার করব পুরো প্রোজেক্ট টা সেটআপ করানোর জন্য । এখন এই Container টা আমরা নামিয়ে নিব ও চালু করব । এর জন্যে লিখব docker run –name oracle-db sath89/oracle-xe-11g এখন কিছুক্ষণ আগে বানানো php-oracle-container টি এর সাথে লিঙ্ক করব । কাজ কিছুটা বেড়ে গেল মনে হচ্ছে !

এবার অনেকগুলো কাজ একসাথে করতে হচ্ছে , অনেক কমান্ড , সব মনে রাখা কষ্টকর আর যারা কমান্ড লিখতে অভ্যস্থ না তাদের জন্য একটু কঠিন ।  সুতরাং সব গুলো কাজকে একসাথে করার জন্য ডকারের আর একটা টুলস আছে যার নাম [Docker Compose](https://docs.docker.com/compose/overview/)  । এটা সাধারনত ডকারের অনেকগুলো কাজ একসাথে করে । নিচে এই প্রোজেক্টটের একটা docker-compose.yml ফাইল দেওয়া হল । এখানে সব গুলো কাজের একসাথে ইন্সট্রাকশন দেওয়া আছে , যেমন

লাইন ১ – ১১ঃ  আমরা Docker Build করার সময় যেসব স্টেপ / আর্গুমেন্ট কমান্ড হিসাবে লিখতে হয়েছিল , সেসব আর্গুমেন্ট এখানে একটা YML ফাইল সিনট্যাক্স হিসাবে লিখতে হয়েছে , প্রথমে নাম তারপর ডকার ফাইলটা কোথায় , কোন পোর্টে সার্ভিসটি রান হবে , কোন ফাইলগুলো Host to Guest এ মাউন্ট হবে , আর শেষে এর সাথে আর অন্য কোন ডকার লিঙ্ক হবে ।

লাইন ১৩ – ২০ঃ Oracle Database  এর জন্য কনফিগারেশন  , কোন Docker Image ব্যবহার করব , নামে কি হবে , পোর্ট কত আর সব শেষে কোথায় ডাটা গুলো থাকবে ।

```yaml
web:
  container_name: php7_apache_oci8
  build: .
  ports:
    - "80:8888"
  volumes:
    - ./src:/var/www/html/
    - ./conf/apache:/etc/apache2/sites-enabled/
    - ./conf/php:/usr/local/etc/php/
  links:
    - oracle

oracle:
  image: sath89/oracle-xe-11g
  hostname: oracle-php
  container_name: oracle-php
  ports:
    - "1521:1521"
  volumes:
    - /home/fahim/oracle_data:/u01/app/oracle
```

সব শেষে শুধুমাত্র একটা কমান্ড( docker-compose build && docker-compose up ) লিখলেই সব কাজ একসাথে হবে ।

অর্থাৎ যারা নতুন করে প্রোজেক্ট সেটআপ করতে চাবে তাঁদেরকে শুধু Docker & Docker Compose ইন্সটল করতে হবে ।
