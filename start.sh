#!/bin/bash

# Start both frontend and backend in parallel using Nx
npx nx run-many --target=dev --parallel
