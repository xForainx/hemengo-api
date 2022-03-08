pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'apt install nodejs npm'
                sh 'npm install'
                echo 'Built'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run start'
                sh 'npm run test'
                echo 'Tested'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deployed'
            }
        }
    }
}