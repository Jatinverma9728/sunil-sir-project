module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    verbose: true,
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/scripts/**'
    ],
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['./__tests__/setup.js']
};
