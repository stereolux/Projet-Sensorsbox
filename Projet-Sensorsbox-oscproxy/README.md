# Sensorsbox-osc-proxy

Chrome Apps currently do not play well with polymerjs.
You need to run vulcanize to enable it: [http://www.polymer-project.org/articles/concatenating-web-components.html]

## Installation

```
npm install -g vulcanize
```

## Usage

```
vulcanize -o dist/build.html src/main.html --csp
```
