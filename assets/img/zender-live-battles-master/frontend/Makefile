include .env
ENVIRONMENTS?=frontend production staging local
CDN?=cdn.zender.tv
CHANNEL_ROOT=https://api.staging.zender.tv/v1/channels

env-all: $(patsubst %, env-%, $(ENVIRONMENTS))
env-%:
	@rm .env
	@echo "REACT_APP_API_URL=$(API_URL)" >> .env
	@echo "REACT_APP_CHANNEL_ROOT=$(CHANNEL_ROOT)" >> .env
	@cat .env

env-frontend: API_URL=http://35.163.12.16:3000
env-local: API_URL=http://localhost:3000
env-staging: API_URL=https://dr3im9irw9.execute-api.us-west-2.amazonaws.com/dev
env-production: API_URL=https://api.zender.tv/v1
env-production: CHANNEL_ROOT=https://api.zender.tv/v1/channels

export $(shell sed 's/=.*//' .env)
ENV := $(shell cat .env)

sync-staging:
	@npm run build
	@aws s3 sync ./build s3://livebattles.staging.zender.tv/ --region eu-central-1 --metadata-directive REPLACE --acl public-read --exclude "*" --include "*.js" --include "*.css" --cache-control max-age=86400,public
	@aws s3 sync ./build s3://livebattles.staging.zender.tv/ --region eu-central-1 --metadata-directive REPLACE --acl public-read --include "*" --exclude "*.js" --exclude "*.css" --exclude "*.html" --cache-control max-age=86400,public
	@aws s3 sync ./build s3://livebattles.staging.zender.tv/ --region eu-central-1 --metadata-directive REPLACE --acl public-read --exclude "*" --include "*.html" --cache-control max-age=60,public

sync-production:
	@npm run build
	@aws s3 sync ./build s3://$(CDN)/live/player/livebattles/web/ --region eu-west-1 --metadata-directive REPLACE --acl public-read --exclude "*" --include "*.js" --include "*.css" --cache-control max-age=86400,public
	@aws s3 sync ./build s3://$(CDN)/live/player/livebattles/web/ --region eu-west-1 --metadata-directive REPLACE --acl public-read --include "*" --exclude "*.js" --exclude "*.css" --exclude "*.html" --cache-control max-age=86400,public
	@aws s3 sync ./build s3://$(CDN)/live/player/livebattles/web/ --region eu-west-1 --metadata-directive REPLACE --acl public-read --exclude "*" --include "*.html" --cache-control max-age=60,public
