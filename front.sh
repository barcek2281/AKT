#!/bin/bash

mkdir -p frontend/akt/{public,src/{assets/{fonts,images},components/{common/{Button,Header},pages/{HomePage,AboutPage}},config,constants,contexts,hooks,services,styles,utils}}

# Create placeholder files

touch frontend/akt/src/config/env.config.js
touch frontend/akt/src/constants/routes.js
touch frontend/akt/src/contexts/AuthContext.js
touch frontend/akt/src/hooks/useAuth.js
touch frontend/akt/src/services/api.js
touch frontend/akt/src/styles/{global.css,mixins.css}
touch frontend/akt/src/utils/formatDate.js


# Create root-level files

echo "Folder tree created successfully!"
