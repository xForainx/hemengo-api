pipeline {
    agent {
        docker {
            image 'node:16' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'build.sh'
                echo 'Built'
            }
        }
        stage('Test') {
            steps {
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