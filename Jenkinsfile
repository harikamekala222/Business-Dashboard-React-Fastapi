pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        PROJECT_DIR = '/home/ubuntu/Business-Dashboard-React-Fastapi'
        APP_URL = 'http://13.229.87.119'

        // Replace these placeholders with your actual .env values.
        DB_HOST = 'database'
        DB_PORT = '3306'
        DB_NAME = 'business_db'
        DB_USER = 'admin'
        DB_PASSWORD = 'admin123'
        MYSQL_ROOT_PASSWORD = 'Admin123'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Permissions') {
            steps {
                sh '''
                    set -eu

                    test -d "$PROJECT_DIR"
                    test -r "$PROJECT_DIR/docker-compose.yml" || \
                    test -r "$PROJECT_DIR/compose.yaml"

                    docker ps >/dev/null

                    echo "Project directory and Docker access verified."
                '''
            }
        }

        stage('Configure Environment') {
            steps {
                sh '''
                    set -eu
                    cd "$PROJECT_DIR"

                    umask 077

                    touch .env
                    chmod 600 .env

                    # Write the environment values without printing secrets.
                    cat > .env <<EOF
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
EOF

                    echo ".env configured."
                '''
            }
        }

        stage('Validate Compose') {
            steps {
                sh '''
                    set -eu
                    cd "$PROJECT_DIR"
                    docker compose config -q
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                    set -eu
                    cd "$PROJECT_DIR"
                    docker compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu
                    cd "$PROJECT_DIR"
                    docker compose up -d --remove-orphans
                '''
            }
        }

        stage('Verify Application') {
            steps {
                sh '''
                    set -eu
                    cd "$PROJECT_DIR"

                    docker compose ps

                    curl --fail --silent --show-error \
                        --retry 6 --retry-delay 5 --retry-connrefused \
                        "$APP_URL/health"

                    echo
                    curl --fail --silent --show-error \
                        "$APP_URL/city-wise"

                    echo
                    curl --fail --silent --show-error \
                        "$APP_URL/category-wise"

                    echo
                    curl --fail --silent --show-error \
                        "$APP_URL/source-wise"

                    echo
                    echo "Deployment verified successfully."
                '''
            }
        }
    }

    post {
        success {
            echo 'Business Dashboard deployment succeeded.'
        }

        failure {
            echo 'Deployment failed. Review the failed stage logs.'

            sh '''
                cd "$PROJECT_DIR"
                docker compose ps || true
                docker compose logs --tail=100 || true
            '''
        }

        always {
            echo 'Pipeline completed.'
        }
    }
}
```
