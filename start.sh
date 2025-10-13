#!/bin/bash

# Start backend on port 3333
cd furry-friends-agenda-backend
npm run start:dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

# Start frontend on port 5000
cd ../furry-friends-agenda-app
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
