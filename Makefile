.PHONY: help clean build run publish

help:
	@echo "install - Install project dependencies."
	@echo "clean - Remove the dist directory."
	@echo "build - Build the project."
	@echo "run   - Run the project locally."
	@echo "publish - Publish the project to GitHub Pages."

install:
	npm install

clean:
	rm -rf dist
	mkdir dist

build: clean
	cp src/index.html dist
	npm run build

run: build
	npm start

publish: build
	gh-pages -d dist
