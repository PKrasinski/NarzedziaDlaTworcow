find . -name "node_modules" -type d -prune -exec rm -rf {} +
bun install
find . -type d -name \"@arcote.tech\" -exec rm -rf {} +
bun link @arcote.tech/arc 
bun link @arcote.tech/arc-host 
bun link @arcote.tech/arc-react

find . -type d -name "@arcote.tech" -not -path "./node_modules/@arcote.tech" -exec rm -rf {} +