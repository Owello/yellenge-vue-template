// eslint-disable-next-line
module.exports = {
    globals: {
        'ts-jest': {
            diagnostics: false, // Turn off diagnostics, because this leads to a 100% coverage score on Vue components
        },
    },
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'vue',
        'ts',
        'tsx'
    ],
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    snapshotSerializers: [
        'jest-serializer-vue'
    ],
    testMatch: [
        '**/tests/unit/**/*.spec.(ts|tsx)|**/__tests__/*.(ts|tsx)',
    ],
    transformIgnorePatterns: ['/node_modules/(?!jquery)'],
    modulePathIgnorePatterns: ['<rootDir>/coverage/'],
    setupFiles: ['<rootDir>/test-env.js'],
    testURL: 'http://localhost/',
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{ts,vue}',
        '!**/node_modules/**',
        '!**/tests/**',
        '!<rootDir>/shim-*.d.ts',
        '!<rootDir>/test-env.js'
    ],
};
