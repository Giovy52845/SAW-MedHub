#!/bin/bash

# Script per installare le dipendenze
echo "Installo le dipendenze del backend..."
(cd backend && npm install)

echo "Installo le dipendenze del frontend..."
(cd frontend && npm install) &

wait