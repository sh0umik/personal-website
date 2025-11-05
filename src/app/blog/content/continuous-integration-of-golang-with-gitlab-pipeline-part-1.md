# Continuous Integration of Golang with Gitlab Pipeline | পর্ব ১

কিছুদিন আগে আমাদের নতুন একটা  প্রোজেক্টের জন্য [মাইক্রোসার্ভিস আর্কিটেকচার](https://shoumik.me2017/06/25/%E0%A6%AE%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A7%8B%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AD%E0%A6%BF%E0%A6%B8-%E0%A6%86%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A6%BF%E0%A6%9F%E0%A7%87%E0%A6%95/) অনুসরণ করে অ্যাপ্লিকেশান বানানো শুরু করি যেখানে Docker আর DevOps একটা বড় অংশ পালন করে, জেহুতু আমরা ল্যাঙ্গুয়েজ হিসাবে Golang ব্যবহার করছিলাম ও পুরো  অ্যাপলিকেশন অনেকগুলো ছোট ছোট অংশে ভাগ করা হয়েছিল । যত সার্ভিস বাড়ছিল ততই পুরো আপ্লিকেশন সামলানো ঝামেলার হয়ে পরছিল তাই পুরো জিনিসটাকে একটা CI Circle মানে Continuous Integration Circle এ নিয়ে আসার বেবস্থা করা হয়। প্রত্যেকটা সার্ভিসের [Static Binary](https://en.wikipedia.org/wiki/Static_build)  Docker দিয়ে Deploy করা হচ্ছিল। সুতরাং প্রত্যেকটা সার্ভিস আমাদেরকে Dockerize করা লাগবে এবং সেই Docker Container কোন জায়গায় রাখতে হবে । তাই অনেক সিধান্তর পরে আমরা ঠিক করি আমাদের Repository , Gitlab এ নিয়ে আশা হোক যাতে আমরা Gitlab এর Container Registry ব্যবহার করতে পারি ।

**আমাদের এই পর্বে  লক্ষ হবে** **,  Golang এর কোড Gitlab এ Push করা মাত্রই Gitlab আমদের Golang এর কোডকে নিয়ে একটা Static Binary তে Compile করবে আর সেখানেই ওই Binary কে নিয়ে আর একটা Micro Docker Container বানাবে এবং Gitlab এর Private Docker Registry তে Push করবে ।**

আগেই বলে নেওয়া উচিত যে এর জন্যও আমাদের একটা VPS লাগতে পারে অথবা আপনার নিজের  ল্যাপটপেও Gitlab Runner চালানো যাবে তবে কিছু সিবাবদ্ধতা আছে, তবে এসব কাজের জন্য একটা নতুন VPS হলে ভাল হয়, Minimum 1 Core 1 GB Ram. অতিরিক্ত একটা VPS কেন লাগবে সেটা একটু পরেই আলোচনা করব ।

**Gitlab Pipeline** **নিয়ে কিছু কথা**

Gitlab কিছু দিন আগে পরীক্ষামূলক ভাবে Gitlab এর Pipeline and Registry Feature চালু করে অর্থাৎ Gitlab এখন আমাদের কোডকে শুধু সংরক্ষণই না Build করে দেখতে পারবে কোন ভুল আছে কি না ([TDD](https://en.wikipedia.org/wiki/Test-driven_development)) ! এবং আমরা আমাদের প্রত্যেকটা Private Repo এর জন্য একটা Private Docker Registry পাই যেটা Github , Docker Hub , Bitbucket বিনামূল্যে দেয় না , যদিও তাঁদের সেবা পরীক্ষামূলক তাও এটা আমাদের চাহিদা অনুযায়ী অনেক।

Gitlab Pipeline Environment চলে Docker দিয়ে । Docker কি এবং কেন আমাদের ব্যবহার করা উচিত এটা অমি আমার [পুরনো আর্টিকেলে তুলে ধরার চেষ্টা করেছি।](https://shoumik.mecategory/docker/)

Gitlab Pipeline এর Build চলে কিছু Shared Runner দিয়ে অর্থাৎ Gitlab নিজেরাই তাঁদের নিজেস কিছু সার্ভার দিয়ে আপনার কোড Build অথবা Test করার সুযোগ দেয়। তবে আমাদের উপরের লক্ষ টা একটু জটিল আর বর্তমানে Gitlab এর এই Shared Runner অতটা Configure করা যায় না । আরও যদি কাজটা নির্ভর করে Docker in Docker এর উপরে তাহলে নিজের একটা Server লাগবেই কারণ Gitlab এ Docker in Docker চালানোর জন্য যে Socket Sharing এর দরকার পরে সেটা Gitlab এর Shared Runner করা আপাতত সম্ভব না ।

জেহুতু Shared Runner আমাদের সমস্যার সমাধান করতে পারবে না তাই একটা আলাদা VPS এ আমরা আমাদের নিজেস Runner বসাব , যেটার মাদ্ধমে আমরা আমাদের সব মাইক্রোসার্ভিস Build করতে পারব ।

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-1.gif)

Stick with It

প্রথমে Gitlab Pipeline চালু করার জন্য Repo তে গিয়ে CI/CD সেকশন থেকে Pipeline চালু করে নেব আগে ।

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-2.png)

Start Gitlab CI Pipeline

এরপর Settings > CI/CD > Runner Settings এ গেলে নিচের ছবির মত একটা জিনিস দেখতে পারব । এখানে নির্দেশনা দেওয়া আছে যে নিজের জন্যও Runner বসাতে কি করা লাগবে । এখান থেকে আমাদের শুধু একটা জিনিস লাগবে যেটা হল Registration Token যেটা আমরা নিজের VPS এ Runner সেটআপ করার সময় ব্যবহার করব ।

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-3.png)

Gitlab without Runner

এখন আমাদের নিজের VPS এ ঢুকে [Gilab Runner](https://docs.gitlab.com/runner/install/)  ইন্সটল করে নেই। এটা একটা CMD Tool এর পরে এই Custom Runner কে আমাদের Gitlab Repo তে নিয়ে আসতে নিচের Conf Snippet টি Copy , Paste করব Terminal Shell এ । অবশ্যই CI_RUNNER_TOKEN এই জায়গায় আপনাদের নিজেস Register Token টকেন দিতে হবে ।

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-4.png)

Adding Custom Gitlab CI Runner

```bash
sudo gitlab-runner register -n \
  --url https://gitlab.com/ \
  --registration-token CI_RUNNER_TOKEN \
  --executor docker \
  --description "Docker Runner Vultr (Rancher)" \
  --docker-image "docker:latest" \
  --docker-volumes /var/run/docker.sock:/var/run/docker.sock
```

এটা হয়ে গেলে আমরা আমাদের Gitlab এর Runner Settings সেকশন এ **Runners activated for this project** গিয়ে নিচের ছবির মত একটা ছবি দেখতে পারব ।

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-5.png)

Gitlab CI with Active Custom Runner.

এরপরে আমরা আমাদের প্রোজেক্ট এর জন্য একটা .gitlab-ci.yml ফাইল লিখব। যার মদ্ধে লিখা থাকবে Runner এর জন্য কাজটা কি হবে,

```yaml
image: restra/golang-docker-gitlabci

variables:
  DOCKER_REPO: registry.gitlab.com
  MAIN_IMAGE_NAME: sh0umik/golang-gitlab-ci

services:
  - docker:dind

stages:
  - build
  - upgrade

before_script:
  - mkdir -p /go/src/gitlab.com/sh0umik/golang-gitlab-ci
  - cp -r . /go/src/gitlab.com/sh0umik/golang-gitlab-ci
  - cd /go/src/gitlab.com/sh0umik/golang-gitlab-ci

build:
  stage: build
  script:
    - glide up
    - CGO_ENABLED=0 GOOS=linux go build -ldflags "-s" -a -installsuffix cgo .
    - docker login -u fahim.shoumik -p $ACCESS_TOKEN $DOCKER_REPO
    - docker build -t $DOCKER_REPO/$MAIN_IMAGE_NAME:latest .
    - docker build -t $DOCKER_REPO/$MAIN_IMAGE_NAME:$CI_COMMIT_REF_NAME .
    - docker push $DOCKER_REPO/$MAIN_IMAGE_NAME:latest
    - docker push $DOCKER_REPO/$MAIN_IMAGE_NAME:$CI_COMMIT_REF_NAME

upgrade:
  stage: upgrade
  script:
    - echo "upgrade here"
```

লাইন ১ঃ পুরো কাজটা করতে আমদের যা কিছু লাগবে তার জন্যও আমাদের একটা Docker Container বানানো আছে যার নাম restra/golang-docker-gitlabci এই Container এর মদ্ধে Golnag আর Docker ইন্সটল করা আছে । Golang দিয়ে আমরা আমাদের প্রোজেক্টের সোর্স কোড কম্পাইল করে Static Binary তে, আর Docker দিয়ে সেই Static Binary Dockerize করব যাতে আমরা সেটা যেকোনো মেশিনে চালাতে পারি ।

লাইন ৩–২১ঃ Gitlab CI Configuration ফাইল এগুলো সম্বন্ধে Gitlab এর ওয়েবসাইট এ ভাল তথ্য পাওয়া যাবে ।

লাইন ২২ঃ glide আমাদের প্রোজেক্ট ওয়ে Dependency Manager যেটা কিনা আমাদের resta/golang-docker-gitlabci তে ইন্সটল করা আছে তাই এই কমান্ড আমরা ব্যাবহার করতে পারব। glide up আমাদের জন্য সব Dependency ইন্সটল করে নিবে যেটা কম্পিল করার সময় দরকার পরবে।

লাইন ২৩ঃ সবথেকে গুরুত্বপূর্ণ অংশ GO_ENABLED=0 GOOS=linux go build -ldflags “-s” -a -installsuffix cgo . দিয়ে আমরা আমাদের Golang প্রোজেক্টের Static Binary বানাব।

লাইন ২৪–২৮ঃ এই সব গুলো লাইন Docker কমান্ড , মূলত এই জন্যেই আমাদের Build Environment ( restra/golang-docker-gitlabci ) এ Docker ইন্সটল করে নিয়ে হয়েছে । এখন হয়ত কিছুটা বুঝা যাচ্ছে যে Docker in Docker কেন । লাইন ২৪ এ আমরা একটা Env variable ব্যাবহার করেছি যেটা $ACCESS_TOKEN এর মাদ্ধমে আমরা Gitlab থেকে Runner এ Variable পাঠাচ্ছি ।

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-6.png)

Setting ENV Variable for Gitlab CI Runner

এখানে সাধারণ যার Repository তার Access Token লাগবে, এটা নিজের Settings > Access Token এখান থেকে গিয়ে নিয়ে নেওয়া যাবে ।

এখন যদি আমরা কোন Push করি Repo তে তাহলে CI/CD Pipeline এ আমরা দেখবও আমাদের Build শুরু হয়েছে ।

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-7.png)

CI Job Started

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-8.png)

Build এ ক্লিক করলে আমরা Build Log দেখতে পারব। এখানে লক্ষ করলে দেখা যাবে এটা প্রথমে আমাদের Docker Image ( restra/golang-docker-gitlabci ) ডাউনলোড করে তার পরে .gitlab-ci.yml এর দুইটা stage এ লিখা কমান্ড গুলো চালাবে আমাদের Docker Image এর মদ্ধে। সব কিছু ঠিক থাকলে আমরা নিচের ছবির মত একটা Log দেখতে পারব , যদি সেটা শেষ হয় Job succeeded দিয়ে তাহলে সব কিছু ঠিক আছে।

যদি আমরা Registry তে যাই তাহলে দেখতে পারব দুইটা Docker Container এখানে জমা হয়েছে । একটা ব্রাঞ্ছ এর নামে আর একটা latest যেমনটা .gitlab-ci.yml এ লিখা হয়েছিল।

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-9.png)

![](/blog/continuous-integration-of-golang-with-gitlab-pipeline-part-1-image-10.gif)

Success

এই ৪.৭৮ মেগাবাইটের Docker Container , এটাই আমাদের একটা মাইক্রো সার্ভিস।  তবে সব কিছু এখানেই শেষ না, এর পরে হয়ত মাইক্রো সার্ভিস কিভাবে তদারকি করতে হয় এবং এর জন্য আমরা কি টুল ব্যাবহার করলে যাতে আমাদের মাইক্রো সার্ভিস প্রডাকশনে ব্যাবহারের উপযোগী হয় সেগুলো বিষয় নিয়ে আলোচনা করব ।

Links :

Gitlab Repo : https://gitlab.com/sh0umik/golang-gitlab-ci/
