pipeline {
    agent any

    parameters {
        choice(
            name: 'ENV',
            choices: ['dev', 'test', 'prod'],
            description: 'Target Kubernetes namespace'
        )
    }

    environment {
        REGISTRY = "docker.io/umatanna9"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/shankutanna/ieodp-complete-repo-16thjuly.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
echo "Building React frontend..."
docker build -t $REGISTRY/react-frontend:$TAG IEODP-react-frontend

echo "Building Spring Boot backend..."
docker build -t $REGISTRY/springboot-backend:$TAG ieodp-springboot-backend-14thjan

echo "Building Python backend..."
docker build -t $REGISTRY/python-backend:$TAG python-backend/ENTERPRISE_PROJECT
'''
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
echo "Logging into Docker Hub..."
echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

echo "Pushing images..."
docker push $REGISTRY/react-frontend:$TAG
docker push $REGISTRY/springboot-backend:$TAG
docker push $REGISTRY/python-backend:$TAG
'''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
echo "Deploying to namespace: ${ENV}"

kubectl create namespace ${ENV} --dry-run=client -o yaml | kubectl apply -f -

echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/ -n ${ENV}

echo "Updating images..."
kubectl set image deployment/react-frontend \
react=$REGISTRY/react-frontend:$TAG -n ${ENV}

kubectl set image deployment/springboot-backend \
springboot=$REGISTRY/springboot-backend:$TAG -n ${ENV}

kubectl set image deployment/python-backend \
python=$REGISTRY/python-backend:$TAG -n ${ENV}
'''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD pipeline completed successfully for ${ENV}"
        }
        failure {
            echo "❌ CI/CD pipeline failed for ${ENV}"
        }
    }
}
