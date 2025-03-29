#!/bin/bash

mkdir -p frontend/{node_modules,public,src/{assets/{fonts,images},components/{common/{Button,Header},pages/{HomePage,AboutPage}},config,constants,contexts,hooks,services,styles,utils}}

# Create placeholder files
touch frontend/public/index.html
touch frontend/public/favicon.ico

touch frontend/src/config/env.config.js
touch frontend/src/constants/routes.js
touch frontend/src/contexts/AuthContext.js
touch frontend/src/hooks/useAuth.js
touch frontend/src/services/api.js
touch frontend/src/styles/{global.css,mixins.css}
touch frontend/src/utils/formatDate.js
touch frontend/src/App.js
touch frontend/src/index.js

# Create root-level files
touch frontend/.gitignore
touch frontend/package.json
touch frontend/package-lock.json
touch frontend/README.md

echo "Folder tree created successfully!"
