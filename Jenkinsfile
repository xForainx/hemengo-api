pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/hyperdestru/hemengo-api.git'
                echo 'Checkout Completed'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}