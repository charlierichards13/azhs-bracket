# AZ Road to Open Tournament Bracket

AZ Road to Open is a web application I built to help Arizona high school basketball fans follow a live tournament bracket in a cleaner and more interactive way. I created the project as a way to give back to my high school community while also building a real-world full-stack application with live data, authentication, and admin-only controls.

## Overview

The platform allows users to view tournament matchups, track bracket progress in real time, and compete through bracket submissions. It also includes an admin backend for managing teams, games, winners, and tournament updates without exposing those controls to regular users.

This project gave me experience designing a user-facing product while also thinking carefully about backend structure, access control, and data integrity.

## Features

- Live bracket updates as game results are entered
- Responsive design for desktop and mobile users
- Public-facing bracket and leaderboard pages
- User bracket submission flow with bracket locking
- Admin-only dashboard for managing tournament data
- Real-time tournament progress using Firebase-backed data

## Tech Stack

- **Next.js** for the frontend and app routing
- **Firebase Authentication** for user sign-in
- **Cloud Firestore** for tournament, game, and entry data
- **Vercel** for deployment and hosting

## Security / Admin Controls

One of the most important parts of this project was making sure tournament management tools were restricted to authorized admins only.

To support this, I used:
- authenticated sign-in flows for user identity
- admin verification tied to approved user records
- protected write access so only admins could modify tournament data
- separate handling for public reads vs. privileged updates

This helped me think more like a security-minded developer rather than only focusing on frontend features.

## What I Learned

Building this project taught me how much full-stack development depends on more than just making pages look good. I had to think about:

- data modeling for teams, games, and entries
- syncing live updates across the app
- protecting admin functionality from unauthorized use
- designing a smooth experience for both users and organizers
- deploying and maintaining a real project with public traffic

It also reinforced my interest in secure software development, since even a small app benefits from clear authentication and role-based access control.

## Future Improvements

- Expanded player props and prediction features
- Better analytics for leaderboard and pick trends
- Improved admin workflow for tournament updates
- Additional hardening and monitoring for production use

## Project Setup

```bash
npm install
npm run dev
