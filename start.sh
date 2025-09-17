#!/bin/bash

# Script per avviare backend e frontend
echo "Avvio backend..."
(cd backend && node index.js) &

echo "Avvio frontend..."
(cd frontend && npm run build && npm run preview) &
# (cd frontend && npm run dev) &

wait