what is the meaning of MVP : A minimum viable product (MVP) is the simplest version of a product that allows teams to validate ideas and gather feedback with minimal effort
# PawResQ Project Plan

## Final Project Title

PawResQ: AI-Powered Street Animal Injury and Welfare System

## Problem Statement

Street animals often suffer from injuries, diseases, accidents, hunger, and abandonment. Many citizens notice injured animals but do not know how to report them properly. NGOs and volunteers receive rescue requests through scattered channels like phone calls, WhatsApp, and social media, making it difficult to prioritize urgent cases and coordinate rescue work.

PawResQ solves this problem by providing a centralized web platform where users can report injured street animals with images, descriptions, and location details. The system predicts injury severity, matches cases with nearby NGOs, supports emergency volunteer escalation, and promotes adoption of rescued animals.

## Main Users

1. Citizen / Reporter
2. NGO / Rescue Organization
3. Volunteer / Private Rescuer
4. Admin
5. Adopter

## MVP Features

1. User can report an injured animal.
2. User can upload animal image.
3. User can enter injury description.
4. User can provide or select location.
5. System predicts injury severity.
6. System calculates priority score.
7. System finds nearby NGOs.
8. NGO can accept and update case status.
9. If critical case is not accepted, user can see verified nearby volunteer contacts.
10. Admin can manage reports, NGOs, volunteers, and analytics.
11. Rescued animals can be listed for adoption.

## Technology Stack

### Frontend

React, HTML, CSS, JavaScript

### Backend

Node.js, Express.js

### Database

MongoDB with Mongoose

### Maps

Leaflet.js with OpenStreetMap

### Image Upload

Cloudinary or local upload during development

### AI / Severity Prediction

First version: rule-based injury severity prediction using description keywords.

Future version: YOLOv8 or CNN-based image injury classifier.

## Build Strategy

First build a working full-stack product flow.

Then improve AI and advanced features.

A simple working system is better than a complicated incomplete model.

## First Version Injury Prediction

The system will analyze the injury description and assign severity:

- Low
- Medium
- High
- Critical

Example:

"Dog hit by bike and bleeding heavily"

Prediction:

- Severity: Critical
- Reason: accident + bleeding
- Priority: High

## NGO Matching Logic

The system stores NGO latitude and longitude.

When a report is submitted:

1. Get animal location.
2. Calculate distance to each NGO.
3. Filter NGOs within service radius.
4. Sort NGOs by distance and case priority.
5. Show alert in NGO dashboard.

## Emergency Volunteer Escalation

If a case is High or Critical and no NGO accepts within the response time, the system shows verified nearby volunteer/private rescuer contacts to the user who submitted the report.

Volunteer contact visibility rules:

- Only for High/Critical cases
- Only after NGO response timeout
- Only verified volunteers
- Only nearby available volunteers

## Daily Learning Workflow

1. Learn topic.
2. Build small feature.
3. Understand every file.
4. Run and test.
5. Debug.
6. Write notes.
