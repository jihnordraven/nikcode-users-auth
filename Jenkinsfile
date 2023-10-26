pipeline {
    agent any

    environment {
        DOCKER_BUILD_NAME = "jihnordraven/nikcode-users-auth:latest"
    }

    stages {
        stage('Unit tests') {
            steps {
                script {
                    sh "npm install -g yarn"
                    sh "yarn test"
                }
            }
        }
        stage('e2e tests') {
            steps {
                script {
                    sh "yarn test:e2e"
                }
            }
        }
        stage('Build docker image') {
            steps {
                echo "Build image started..."
                    script {
                        sh "docker build -t ${env.DOCKER_BUILD_NAME} ."
                    }
                echo "Build image finished..."
            }
        }
        stage('Push docker image') {
             steps {
                 echo "Push image started..."
                     script {
                        docker.withRegistry("https://${env.REGISTRY}", 'godzillagram-com') {
                            sh "docker push ${env.DOCKER_BUILD_NAME}"
                        }
                     }
                 echo "Push image finished..."
             }
       }
       stage('Delete image local') {
             steps {
                 script {
                    sh "docker rmi -f ${env.DOCKER_BUILD_NAME}"
                 }
             }
        }
        stage('Deploy to Kubernetes') {
             steps {
                 withKubeConfig([credentialsId: 'prod-kubernetes']) {
                    sh "kubectl apply -f ./deployment.yaml"
                    sh "kubectl get services -o wide"
                 }
             }
        }
    }
}