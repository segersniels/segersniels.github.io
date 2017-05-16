ENVIRONMENTS?=frontend backend dynamo
ECS_CLUSTER?=$(shell cat .cluster)
INSTANCES=$(shell cat .instances)
SERVICES=$(shell cat .services)
CLUSTERS=$(shell cat .clusters)
TASKS=$(shell cat .tasks)
BACKENDS?=local staging production
BATTLES=$(shell ls assets/battles/battle*.json)
CREDENTIALS?= staging production serverless

update:
	@touch .instances .services .tasks .clusters .cluster
	@make credentials-staging
	@cd ./frontend && touch .env
	@cd ./backend && touch .env
	@echo "Updating all the cached files with updated data."
	@printf "\nProgress: [" 
	@aws ec2 describe-instances | jq -r .Reservations[].Instances[].InstanceId > .instances
	@printf "======"
	@aws ecs list-services --cluster $(ECS_CLUSTER) | jq -r '.serviceArns[]' | cut -d '/' -f 2| cut -d '"' -f 1  > .services
	@printf "======"
	@aws ecs list-tasks --cluster=$(ECS_CLUSTER) | jq -r '.taskArns[] | split("/")[-1]' > .tasks
	@printf "======"
	@aws ecs list-clusters | jq -r '.clusterArns[]' | cut -d '/' -f 2 > .clusters
	@printf "=======]\n"
	@echo "\nFollowing data has been cached for cluster '$(ECS_CLUSTER)':"
	@echo "\n- Instances"
	@cat .instances
	@echo "\n- Services"
	@cat .services
	@echo "\n- Tasks"
	@cat .tasks
	@echo "\n- Clusters"
	@cat .clusters
	@echo

set-cluster-all: $(patsubst %, set-cluster-%, $(CLUSTERS))
instance-describe-all: $(patsubst %, instance-describe-%, $(INSTANCES))
instance-start-all: $(patsubst %, instance-start-%, $(INSTANCES))
instance-stop-all: $(patsubst %, instance-stop-%, $(INSTANCES))
service-describe-all: $(patsubst %, service-describe-%, $(SERVICES))
service-disable-all: $(patsubst %, service-disable-%, $(SERVICES))
service-enable-all: $(patsubst %, service-enable-%, $(SERVICES))
service-delete-all: $(patsubst %, service-delete-%, $(SERVICES))
task-stop-all: $(patsubst %, task-stop-%, $(SERVICES))
task-describe-all: $(patsubst %, task-describe-%, $(TASKS))
start-all: $(patsubst %, start-%, $(ENVIRONMENTS))
logs-all: $(patsubst %, logs-%, $(SERVICES))
ssh-all: $(patsubst %, ssh-%, $(INSTANCES))
battle-all: $(patsubst %, battle-%, $(BACKENDS))
credentials-all: $(patsubst %, credentials-%, $(CREDENTIALS))

credentials-%:
	@cp ../credentials/.$*-credentials ~/.aws/credentials

set-cluster-%:
	@echo $* > .cluster
	@echo 'Cluster variable was updated to $*.'
	@echo "Updating the cached data to match the corresponding cluster.\n"
	@make update

instance-describe-%:
	@echo 'Instance:' $* 
	@echo 'Name:' $(shell aws ec2 describe-instances --instance $* | jq -r '.Reservations[].Instances[].Tags[].Value') 
	@echo 'State:' $(shell aws ec2 describe-instances --instance $* | jq -r '.Reservations[].Instances[].State.Name')
	@echo 'Type of instance:' $(shell aws ec2 describe-instances --instance $* | jq -r '.Reservations[].Instances[].InstanceType')
	@echo 'Public IP:' $(shell aws ec2 describe-instances --instance $* | jq -r '.Reservations[].Instances[].PublicIpAddress') 

instance-start-%:
	@aws ec2 start-instances --instance-ids $*
	@aws ec2 wait instance-running --instance-ids $*
	@echo 'Instance successfully started.'

instance-stop-%:
	@aws ec2 stop-instances --instance-ids $*
	@aws ec2 wait instance-stopped --instance-ids $*
	@echo 'Instance successfully stopped.'

service-describe-%:
	@echo "Name: " $*
	@echo "Status: " $(shell aws ecs describe-services --cluster $(ECS_CLUSTER) --service $* | jq -r '.services[].status')
	@echo "Running: " $(shell aws ecs describe-services --cluster $(ECS_CLUSTER) --service $* | jq -r '.services[].runningCount')
	@echo "Desired: " $(shell aws ecs describe-services --cluster $(ECS_CLUSTER) --service $* | jq -r '.services[].desiredCount')
	@echo "Task Definition: " $(shell aws ecs describe-services --cluster $(ECS_CLUSTER) --service $* | jq -r '.services[].taskDefinition | split("/")[-1]')	

service-delete-%:
	@make service-disable-$*
	@aws ecs delete-service --service $* --cluster $(ECS_CLUSTER) &> /dev/null
	@echo "Service $* was deleted. Updating the cached files.\n"
	@make update

service-disable-%:
	@aws ecs update-service --service $* --cluster $(ECS_CLUSTER) --desired-count 0 &> /dev/null
	@echo "Desired count updated to 0."

service-enable-%:
	@aws ecs update-service --service $* --cluster $(ECS_CLUSTER) --desired-count 1 &> /dev/null
	@echo "Desired count updated to 1."

task-stop-%:
	$(foreach task, $(shell aws ecs list-tasks --cluster $(ECS_CLUSTER) --service $* | jq -r '.taskArns[]'), aws ecs stop-task --cluster $(ECS_CLUSTER) --task $(task))

task-describe-%:
	@echo "Name: " $(shell aws ecs describe-tasks --cluster $(ECS_CLUSTER) --task $* | jq -r '.tasks[].overrides.containerOverrides[].name')
	@echo "Group: " $(shell aws ecs describe-tasks --cluster $(ECS_CLUSTER) --task $* | jq -r '.tasks[].group')
	@echo "Last Status: " $(shell aws ecs describe-tasks --cluster $(ECS_CLUSTER) --task $* | jq -r '.tasks[].lastStatus')
	@echo "Task Definition: " $(shell aws ecs describe-tasks --cluster $(ECS_CLUSTER) --task $* | jq -r '.tasks[].taskDefinitionArn | split("/")[-1]')
	@echo "Port: " $(shell aws ecs describe-tasks --cluster $(ECS_CLUSTER) --task $* | jq -r '.tasks[].containers[].networkBindings[].hostPort')

frontend-update:
	@if [ $(shell aws ecs describe-services --services frontend --cluster frontend | jq -r '.services[0].taskDefinition') = arn:aws:ecs:us-west-2:680668609634:task-definition/frontend1:5 ]; then \
		aws ecs update-service --service frontend --task-definition arn:aws:ecs:us-west-2:680668609634:task-definition/frontend1:6 --cluster frontend; \
	else \
		aws ecs update-service --service frontend --task-definition arn:aws:ecs:us-west-2:680668609634:task-definition/frontend1:5 --cluster frontend; \
	fi
	@if [ $(shell aws ecs describe-services --services frontend2 --cluster frontend | jq -r '.services[0].taskDefinition') = arn:aws:ecs:us-west-2:680668609634:task-definition/frontend2:5 ]; then \
		sleep 60; \
		aws ecs update-service --service frontend2 --task-definition arn:aws:ecs:us-west-2:680668609634:task-definition/frontend2:6 --cluster frontend; \
	else \
		sleep 60; \
		aws ecs update-service --service frontend2 --task-definition arn:aws:ecs:us-west-2:680668609634:task-definition/frontend2:5 --cluster frontend; \
	fi
	@echo 'Service successfully updated.'

logs-%:
	@aws ecs describe-services --cluster $(ECS_CLUSTER) --service $* | jq -r '.services[0].events[].message' | head -40

ssh-%:
	@ssh -i ../coreos-testing.pem core@$(shell aws ec2 describe-instances --instance $* | jq -r '.Reservations[].Instances[].PublicIpAddress')

staging:
	git push origin development:staging

production:
	git checkout staging
	git pull
	git push origin staging:production
	git checkout development

push:
	git add .
	git commit -m "${MESSAGE}"
	git push origin development
	git push origin development:master

pull:
	git pull origin development

docker-rm:
	@docker ps -a | grep Exit | cut -d ' ' -f 1 | xargs docker rm

docker-rmi:
	@docker images -q | xargs docker rmi

deploy-staging:
	@make credentials-staging
	@cd frontend && make env-staging && make sync-staging

deploy-production:
	@make credentials-production
	@cd frontend && make env-production && make sync-production
	@make credentials-staging

deploy-lambda:
	@make credentials-serverless
	@cd ../serverless-backend && sls deploy
	@make credentials-staging

test:
	@cd ./backend && npm test

start-frontend: COMMAND=make env-local && npm i && npm run start
start-backend: COMMAND=make env-local && npm i && node src/server.js
start-dynamo: COMMAND=docker-compose up
start-%:	
	@cd ./$* && touch .env && $(COMMAND)

battle-local: ENV=localhost:3000
battle-local: HTTP=http
battle-staging: ENV=35.163.12.16:3000
battle-staging: HTTP=http
battle-production: ENV=api.zender.tv/v1
battle-production: HTTP=https
battle-%:	
	@for battle in $(BATTLES) ; do \
		curl -H "Content-Type: application/json" -X POST -d @$$battle $(HTTP)://$(ENV)/battles/create &> /dev/null	; \
	done
	@echo "Battles posted to $*. To change the battle data that gets posted, edit the battle of your choice in assets/battle/"

