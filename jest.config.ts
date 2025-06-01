import type { Config } from 'jest'
import { createDefaultPreset } from 'ts-jest'

const config: Config = {
  ...createDefaultPreset(),
  testEnvironment: 'jsdom',
  transform: {
    // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/styleMock.js"
  },
  coveragePathIgnorePatterns : [
    "<rootDir>/node_modules/",
    "styleMock.js",
  ]
}

export default config