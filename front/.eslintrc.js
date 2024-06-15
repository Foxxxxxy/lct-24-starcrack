module.exports = {
    extends: [
        '@gravity-ui/eslint-config',
        '@gravity-ui/eslint-config/prettier',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:css-modules/recommended',
    ],
    plugins: [
        'react-hooks',
        'css-modules',
        'simple-import-sort',
        'unused-imports',
        'prefer-arrow-functions',
    ],
    globals: {
        NODE_ENV: true,
    },
    env: {
        es6: true,
        browser: true,
        node: true,
        jest: true,
    },
    ignorePatterns: ['!.*'],
    settings: {
        react: {version: 'detect'},
        'import/resolver': {
            typescript: true,
        },
        'import/parsers': {'@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts']},
        'import/ignore': ['node_modules', '\\.(jpg|jpeg|png|svg|css|scss|json)$'],
        'import/extensions': ['.js', '.ts', '.tsx', '.d.ts'],
    },
    root: true,
    parserOptions: {
        project: ['./tsconfig.json'],
    },
    rules: {
        'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: false,
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_',
            },
        ],
        'prettier/prettier': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // Side effect imports
                    ['^\\u0000'],
                    // Nodejs builtins. Modules with "node:" prefix come first
                    // eslint-disable-next-line global-require
                    ['^node:', `^(${require('module').builtinModules.join('|')})(/|$)`],
                    // Packages. "react" related packages come first, "@gwc" and "@yandex" related packages come last
                    ['^react', '^@?\\w', '^@gwc', '^@yandex'],
                    // Absolute project imports
                    ['^(src)(/.*|$)'],
                    // Parent imports. Put `..` last
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    // Other relative imports. Put same folder imports and `.` last
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                    // Style imports
                    ['^.+\\.s?css$'],
                ],
            },
        ],
    },
};
