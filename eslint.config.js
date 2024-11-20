import astroEslintParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
	eslintJs.configs.recommended,
	...eslintPluginAstro.configs["flat/recommended"],
	...tseslint.configs.recommended,
	prettierConfig,
	{
		plugins: {
			prettier: prettier,
		},
		files: ["**/*.{js,jsx,ts,tsx,astro}"],
		languageOptions: {
			parser: typescriptParser, // Default parser
			parserOptions: {
				extraFileExtensions: [".astro"],
			},
		},
		rules: {
			"prettier/prettier": "warn",
			"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-non-null-assertion": "off",

			complexity: ["warn", { max: 10 }], // Warn when code complexity exceeds 10

			"no-restricted-syntax": [
				"warn",
				{
					selector: "VariableDeclarator[init.type='Literal'][id.name!=/^[A-Z_]+$/]",
					message: "Constants should be in uppercase with underscores.",
				},
			],

			"no-warning-comments": [
				"warn",
				{ terms: ["todo", "fixme", "xxx"], location: "start" },
			],

			"max-lines-per-function": ["warn", { max: 75, skipComments: true }],

			"id-length": [
				"warn",
				{ min: 3, exceptions: ["i", "j", "x", "y", "z", "_"] },
			],

			"no-magic-numbers": [
				"warn",
				{ ignore: [0, 1, -1], ignoreArrayIndexes: true, enforceConst: true },
			],

			"max-lines": [
				"warn",
				{
					max: 400,
					skipBlankLines: true,
					skipComments: true,
				},
			],

			"max-depth": ["warn", 3],
			indent: ["warn", 2],
			"prefer-const": "warn",
			"no-var": "warn",
			"no-else-return": "warn",
		},
	},
	{
		files: ["**/*.astro"],
		languageOptions: {
			parser: astroEslintParser,
		},
	},
	{
		ignores: [
			"dist",
			"node_modules",
			".github",
			"types.generated.d.ts",
			".astro",
		],
	},
];
