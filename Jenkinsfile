node {
    def commitHash
    def imageTag
    def dockerImage
    def dockerImageName='devmyungyun/automation-server'
    def dockerCredentialId='dockerhub-devmyungyun'
    def dockerFilePath='./Dockerfile'

    def confirmBuild=true

    stage('build & push') {

        if (imageTag == null) {
            def buildNodeName="build-automation-server"
            podTemplate(
                label: buildNodeName,
                containers: [
                    containerTemplate(name: 'docker', image: 'docker', ttyEnabled: true, command: 'cat'),
                ],
                volumes: [
                    hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
                ]
            ) {
                node(buildNodeName) {
                    /* stage - checkout */
                    stage('SCM: Checkout') {
                        checkout scm
                        commitHash=sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                        // short hash: sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(8)

                        imageTag="${env.BRANCH_NAME}-${commitHash}"
                    }
                    /* /stage - checkout */

                    /* stage - Check exists docker image */
                    stage('Build: Check exists docker image') {
                        def dockerImageExist=true

                        container('docker') {
                            try {
                                docker.withRegistry('https://registry.hub.docker.com', dockerCredentialId) {
                                    dockerImage=docker.image("${dockerImageName}:${imageTag}")
                                    dockerImage.pull()
                                }
                            } catch (exception) {
                                dockerImageExist=false
                            }

                            if (dockerImageExist) {
                                try {
                                    timeout(time: 30, unit: 'SECONDS') {
                                        confirmBuild=input(
                                            id: 'confirmBuild',
                                            message: 'There is already docker image exist.',
                                            parameters: [
                                                [$class: 'BooleanParameterDefinition', defaultValue: false, description: '', name: 'confirm if you want to build']
                                            ]
                                        )
                                    }
                                } catch (exception) {
                                    confirmBuild=false
                                }
                            }
                        }
                    }
                    /* /stage - Check exists docker image */

                    /* stage - build */
                    stage('Build: Process') {
                        container('docker') {
                            if (confirmBuild) {
                                echo '>>>>> build start'

                                stage('Docker: Build image') {
                                    /* This builds the actual image; synonymous to
                                    * docker build on the command line */
                                    dockerImage=docker.build("${dockerImageName}:${imageTag}", "-f ${dockerFilePath} .")
                                }

                                stage('Docker: Test image') {
                                    dockerImage.inside {
                                        sh 'echo "Tests passed"'
                                    }
                                }

                                stage('Docker: Push image') {
                                    docker.withRegistry('https://registry.hub.docker.com', dockerCredentialId) {
                                        dockerImage.push("${imageTag}")
                                        dockerImage.push("${env.BRANCH_NAME}-latest")
                                    }
                                }
                            } else {
                                echo 'use exist image'
                            }
                        }
                    }
                    /* /stage - build */
                }
            }
        }
    }

    stage('Deploy: deploy k8s') {
        def confirmDeploy=true

        if (env.BRANCH_NAME == 'production') {
            timeout(time: 300, unit: 'SECONDS') {
                confirmDeploy=input(
                    id: 'confirmDeploy',
                    message: 'This is production.',
                    parameters: [
                        [$class: 'BooleanParameterDefinition', defaultValue: false, description: '', name: 'Please check if you want to deploy.']
                    ]
                )
            }
        }

        if (!confirmDeploy) {
            currentBuild.result='ABORTED'
            error "Abort to delpoy."
        }

        echo 'deploy process';

        def k8sNamespace='automation'
        def k8sDeployment='automation-server'
        def k8sContainer='automation-server'
        def serverAddress

        switch(env.BRANCH_NAME) {
            case 'dev':
                serverAddress='http://k8s-taint:6443'
                podTemplate(
                    label: 'deploy-automation-server',
                    containers: [
                        containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl:latest', ttyEnabled: true, command: 'cat', resourceLimitMemory: '64Mi')
                    ],
                    volumes: [
                    ]
                ) {
                    node('deploy-automation-server') {
                        stage('Deploy: Update Deployment Image') {
                            container('kubectl') {
                                def k8sCredential=[
                                    credentialsId: 'k8s-dev',
                                    serverUrl: serverAddress
                                ]

                                withKubeConfig(k8sCredential) {
                                    sh "kubectl set image ${k8sNamespace}/${k8sDeployment} ${k8sContainer}=${dockerImageName}:${imageTag} -n automation"
                                }
                            }
                        }
                    }
                }

                break;
            case 'production':
                serverAddress='http://k8s-taint:6443'
                break;
            default:
                echo "this is not the branch registered. (Branch: ${env.BRANCH_NAME})"
                break;
        }
    }
}