# NoSQL ডাটাবেস | পর্ব ১

NoSQL মানে হল Not Only SQL !! অনেকেই NoSQL লিখা দেখে হয়ত মনে করতে পারে যে এই ডাটাবেসে কোন SQL/Query Language নেই অথবা এর সাথে কোন সংযোগ নেই। NoSQL ডাটাবেস সাধারণত ডকুমেন্ট/ডাটা সংরক্ষণ করা যায় কোন নির্দিষ্ট Structure ছাড়াই (Unstructured Document) যেটা প্রয়োজন মত সার্চ করা যাবে , SQL এর মত সিনট্যাক্স ব্যবহার করে যেটা  RDBMS এ ব্যবহার করা হয় ডাটাবেস Query করার জন্য। NoSQL ডাটাবেস অনেক ক্ষেত্রে আমাদের ট্র্যাডিশনাল RDBMS এর থেকেও **পাওয়ারফুল ও কার্যকর ।**

NoSQL ডাটাবেসকে বানিয়েছে ইন্টারনেটের বড় বড় লিডাররা যেমন  Facebook, Google, Amazon ছাড়া আর অনেকে যাদের একটা ডাটাবেস দরকার ছিল যেটা কিনা পুরো পৃথিবী জুড়ে বিভিন্ন ডাটা সেন্টারে থাকবে কিন্তু সময় হলে ইচ্ছামত Scaling  করা যাবে ,  performance বজায় রেখে আর কোটি কোটি মানুষের ডাটা সংরক্ষণ করে রাখতে পারবে কিন্তু তার গতি মন্থর হওয়া যাবে না।

**কি ?**

সাধারণত NoSQL ডাটাবেস এক ধরনের Document Storage অর্থাৎ এখানে আপনার ডাটা পুরোটাই আপনি সংরক্ষণ করা যাবে কোন টেবিল , কলাম এ ভাগ করা ছাড়াই, যেটা কিনা ব্যবহার করা হয় ট্র্যাডিশনাল RDBMS গুলোতে !! Document হতে পারে একটা JSON ফাইল অথবা XML ফাইল অথবা  Text ফাইল ইত্যাদি ।

আধুনিক অ্যাপ্লিকেশোন গুলোতে এখন প্রায়ই API ভিত্তিক হয়ে থাকে এবং বর্তমানে JSON ফরম্যাট হচ্ছে খুব প্রচলিত একটা ফরম্যাট API ENDPOINT এর জন্য । একটা JSON Document সাধারণ KEY : VALUE Pair থেকে শুরু করে অনেক জটিল -> Object , Array , Nested Array হতে পারে ।  নিচে একটা মানুষের ডাটার উধারন দেওয়া হল যেখানে তার সম্বন্ধে কিছু লিখা আছে , তার নাম , ঠিকানা , নাম্বার ইত্যাদি ।

```json
{
  "firstName": "Frank",
  "lastName": "Weigel",
  "age": 25,
  "address": {
    "streetAddress": "21 2nd Street",
    "city": "MV",
    "state": "CA",
    "postalCode": "94040"
  },
  "phoneNumber": [
    {
      "type": "home",
      "number": "212 555-1234"
    },
    {
      "type": "fax",
      "number": "646 555-4567"
    }
  ]
}
```

এই ডাটাটাকে যদি RDBMS এ রাখতে হলে শুধু মাত্র **নাম** আর **ঠিকানা** রাখার জন্য  নিচের ছবির মত দুইটা টেবিল এ ভাগ করতে হত ।  আবার যদি একটা মানুষের অনেকগুলো ঠিকানা থাকে ? তাহলে আর একটা Pivot টেবিল বানাতে হত যেটাতে Primary Key আর  Foreign Key থাকত One To Many Relation এর ভিত্তিতে । উপরের ডাটাটাকে RDMBS এ Normalization সহ রাখতে হয়ত ৫-৬ টা টেবিল লাগতে পারে কমপক্ষে । কিন্তু NoSQL ডাটাবেসে এই পুরোটাই সংরক্ষণ করা যাবে যেভাবে JSON ডাটাটি  যেমন আছে ঠিক সেভাবেই । দরকার পড়লে পুরোটাই GET করা যাবে কোন JOIN ছাড়াই । ভবিষ্যতে দরকার পড়লে CRUD অপারেশন ও Atomic অপারেশন (নির্দিষ্ট এক জায়গায় পরিবর্তন) চালানো যাবে এর উপরে।

![](/blog/nosql-database-part-1-image-1.webp)

ট্র্যাডিশনাল RDBMS ডাটাবেস ডিজাইন

**কেন ?**

এখন একটু জটিল  ডাটার দিকে নজর দেই , নিচে একটা রোগীর ডাটার উধাহারন দেওয়া আছে যেটা একটা স্ট্যান্ডার্ড  (FHIR) অনুসারে বসানো হয়েছে , অর্থাৎ এখানে Field যেমন resourceType , identifier , coding এসব ফিক্সড এবং এই কাঠামো পরিবর্তন করা যাবে না, তাহলে এই ডাটা যদি আপনাকে টেবিল অনুসারে ভাগ করে RDBMS এ রাখতে বলা হত তাহলে এটা Normalize করতে অনেক টেবিলের দরকার পড়ত ! তাই এটা চেষ্টা করাটাও বৃথা ।

```json
{
  "resourceType": "Patient",
  "gender": "male",
  "birthDate": "1942-01-14",
  "id": "3abaceca-6fdd-4735-bff3-6b4830c0dab4",
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/identifier-type",
            "code": "SB"
          }
        ]
      },
      "system": "http://hl7.org/fhir/sid/us-ssn",
      "value": "999383955"
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/v2/0203",
            "code": "DL"
          }
        ]
      },
      "system": "urn:oid:2.16.840.1.113883.4.3.25",
      "value": "S99944313"
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/v2/0203",
            "code": "MR"
          }
        ]
      },
      "system": "http://hospital.smarthealthit.org",
      "value": "89e67b18-d167-4eec-bcc4-f2249ee21c95"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "Bauch453",
      "given": ["Stanley527"],
      "prefix": ["Mr."]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "(168) 007-5982",
      "use": "home"
    }
  ],
  "address": [
    {
      "extension": [
        {
          "extension": [
            {
              "url": "latitude",
              "valueDecimal": 42.59437957318591
            },
            {
              "url": "longitude",
              "valueDecimal": -72.09361425668885
            }
          ],
          "url": "http://hl7.org/fhir/StructureDefinition/geolocation"
        }
      ],
      "line": ["75918 Mann Landing", "Suite 587"],
      "city": "Templeton",
      "state": "MA",
      "postalCode": "01468",
      "country": "US"
    }
  ],
  "maritalStatus": {
    "coding": [
      {
        "system": "http://hl7.org/fhir/v3/MaritalStatus",
        "code": "M"
      }
    ],
    "text": "M"
  },
  "multipleBirthBoolean": false,
  "communication": [
    {
      "language": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/ValueSet/languages",
            "code": "en-US",
            "display": "English (United States)"
          }
        ]
      }
    }
  ],
  "generalPractitioner": [
    {
      "reference": "urn:uuid:dbf5b6ef-6951-449b-be3a-0f0abccad36c"
    }
  ]
}
```

এছাড়াও প্রয়োজন অনুসারে নতুন প্রোগ্রামের জন্য ডাটা ডিজাইন আরও জটিল হতে পারে । সে ক্ষেত্রে RDBMS এর থেকে NoSQL ডাটাবেস একটা উপযুক্ত সমাধান ।

**কখন ?**

আপনার ডাটাই বলে দেবে NoSQL কখন ব্যবহার করতে হবে , যদি ডাটাকে সহজ টেবিল , কলাম অাকারে  রাখা যায় অথবা যখন ডাটা  Accounting Spreadsheet এ মত হবে তখন RDBMS ব্যবহার করাই ভাল। কিন্তু ডাটা যখন উপরের উদাহারনের মত হবে অথবা অরও জটিল হবে , জটিল বলতে  ডাটার যখন অনেক স্তর হবে অথবা নেস্টেড হবে ,  যেমন উপরের ডাটার  ১০০ নং লাইনের  **communication** ফিল্ডের ডাটা !

আরেকটা কারণ হল যখন যদি ডাটার Schema যেকোনো সময় বদলাতে পারে এবং যদি ডাটার ৮০ – ৯০ বাগ সময় Read Cycle এ পরে এবং সেই ডাটা Front End এ দেখাতে তিন চার টেবিল এ JOIN করা লাগে  তাহলে সেই ডাটা  JSON  আকারে NoSQL ডাটাবেসে  রাখা ভাল।
