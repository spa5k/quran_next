dev:
  node --run dev

dist:
  node --run electron dist

tidy:
  node --run format

build:
  node --run build

bundle:
  just build
  just dist

docker-build:
  docker build -t web:latest ./apps/web