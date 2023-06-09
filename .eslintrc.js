/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint.
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    overrides: [
        {
            files: ['*.tsx', '*.jsx', '*.ts'],
            parserOptions:  {
                project: 'tsconfig.json',
                sourceType: 'module',
                extraFileExtensions: '.vue'
            },
            parser: '@typescript-eslint/parser',
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:react/recommended'
            ],
        },
        {
            files: ['*.vue'],
            extends: [
                '@vue/typescript',
                'plugin:vue/recommended'
            ],
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 6,
            },
            parser: 'vue-eslint-parser',

        }
    ],
    plugins: [
        '@typescript-eslint',
        'eslint-plugin-tsdoc',
        // 'jsdoc',
        'prefer-arrow',
    ],
    rules: {
        '@typescript-eslint/array-type': [
            'error',
            {
                'default': 'array'
            }
        ],
        '@typescript-eslint/ban-types': [
            'error',
            {
                'types': {
                    'Object': {
                        'message': 'Avoid using the `Object` type. Did you mean `object`?'
                    },
                    'Function': {
                        'message': 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
                    },
                    'Boolean': {
                        'message': 'Avoid using the `Boolean` type. Did you mean `boolean`?'
                    },
                    'Number': {
                        'message': 'Avoid using the `Number` type. Did you mean `number`?'
                    },
                    'String': {
                        'message': 'Avoid using the `String` type. Did you mean `string`?'
                    },
                    'Symbol': {
                        'message': 'Avoid using the `Symbol` type. Did you mean `symbol`?'
                    }
                }
            }
        ],
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/quotes': [
            'error',
            'single'
        ],
        '@typescript-eslint/triple-slash-reference': [
            'error',
            {
                'path': 'always',
                'types': 'prefer-import',
                'lib': 'always'
            }
        ],
        '@typescript-eslint/unified-signatures': 'error',
        'camelcase': 'error',
        'complexity': 'off',
        'constructor-super': 'error',
        'dot-notation': 'error',
        'eqeqeq': [
            'error',
            'smart'
        ],
        'guard-for-in': 'error',
        'id-blacklist': [
            'error',
            'any',
            'Number',
            'number',
            'String',
            'string',
            'Boolean',
            'boolean',
            'Undefined',
            'undefined'
        ],
        'id-match': 'error',
        'import/order': 'off',
        /* 'jsdoc/check-alignment': 1, // Recommended
        'jsdoc/check-examples': 1,
        'jsdoc/check-indentation': 1,
        'jsdoc/check-param-names': 1, // Recommended
        'jsdoc/check-syntax': 1,
        'jsdoc/check-tag-names': 1, // Recommended
        'jsdoc/check-types': 1, // Recommended
        'jsdoc/implements-on-classes': 1, // Recommended
        'jsdoc/match-description': 1,
        'jsdoc/newline-after-description': 1, // Recommended
        'jsdoc/no-types': 0,
        'jsdoc/no-undefined-types': 1, // Recommended
        'jsdoc/require-description': 1,
        'jsdoc/require-description-complete-sentence': 1,
        'jsdoc/require-example': 1,
        'jsdoc/require-hyphen-before-param-description': 1,
        'jsdoc/require-jsdoc': 1, // Recommended
        'jsdoc/require-param': 1, // Recommended
        'jsdoc/require-param-description': 1, // Recommended
        'jsdoc/require-param-name': 1, // Recommended
        'jsdoc/require-param-type': 1, // Recommended
        'jsdoc/require-returns': 1, // Recommended
        'jsdoc/require-returns-check': 1, // Recommended
        'jsdoc/require-returns-description': 1, // Recommended
        'jsdoc/require-returns-type': 1, // Recommended
        'jsdoc/valid-types': 1, // Recommended */
        'max-classes-per-file': [
            'error',
            1
        ],
        'new-parens': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': 'error',
        'no-debugger': 'error',
        'no-empty': 'error',
        'no-eval': 'error',
        'no-fallthrough': 'off',
        'no-invalid-this': 'off',
        'no-new-wrappers': 'error',
        'no-shadow': [
            'error',
            {
                'hoist': 'all'
            }
        ],
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-unsafe-finally': 'error',
        'no-unused-expressions': 'error',
        'no-unused-labels': 'error',
        'object-shorthand': 'error',
        'one-var': [
            'error',
            'never'
        ],
        'prefer-arrow/prefer-arrow-functions': [
            'warn',
            {
                'disallowPrototype': true,
                'singleReturnOnly': false,
                'classPropertiesAllowed': false
            }
        ],
        'radix': 'error',
        'spaced-comment': [
            'error',
            'always',
            {
                'markers': [
                    '/'
                ]
            }
        ],
        'use-isnan': 'error',
        'valid-typeof': 'off'
    }
};
