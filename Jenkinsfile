pipeline {
    agent {
        docker {
            image 'node:16' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Prepare') {
            steps {
                sh 'chmod +x ./ci-cd/build.sh'
                sh 'chmod +x ./ci-cd/test.sh'
                sh 'chmod +x ./ci-cd/deploy.sh'
            }
        }
        stage('Build') {
            steps {
                sh './ci-cd/build.sh'
            }
        }
        stage('Test') {
            steps {
                sh './ci-cd/test.sh'
            }
        }
        stage('Deploy') {
            steps {
                sh './ci-cd/deploy.sh'
            }
        }
    }
}