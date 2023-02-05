import { RuleTester } from 'eslint';
import rule, { RULE_NAME } from '../src/rules/extract-tailwind-classes';

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run(RULE_NAME, rule as any, {
  valid: [
    // {
    //   code: `
    //      import React from 'react';
    //
    //      const About: React.FC = () => {
    //        return (
    //          <div>
    //            <p id="text1" className="text-3xl text-green-500">About</p>
    //          </div>
    //        );
    //      };
    //
    //      export default About;
    //   `,
    // },
  ],
  invalid: [
    {
      code: `<div className={"first:flex animate-spin custom container"}>Using official sorting</div>`,
      output: `<div className={"custom container animate-spin first:flex"}>Using official sorting</div>`,
      errors: [{ messageId: 'invalidOrder' }],
    },
    // {
    //   code: `
    //      import React from 'react';
    //
    //      const About: React.FC = () => {
    //        return (
    //          <div className="flex items-center extract-[Container]">
    //            <p id="text1" className="text-gray-700 shadow-md p-3 border-gray-300 ml-4 h-24 flex border-2 extract-[Text1]">About</p>
    //          </div>
    //        );
    //      };
    //
    //      export default About;
    //   `,
    //   output: `
    //      import React from 'react';
    //
    //      const About: React.FC = () => {
    //        return (
    //          <div className={Container}>
    //            <p id="text1" className={Text1}>About</p>
    //          </div>
    //        );
    //      };
    //
    //      export default About;

    //      const Container = "flex items-center";

    //      const Text1 = "ml-4 flex h-24 border-2 border-gray-300 p-3 text-gray-700 shadow-md";
    //   `,
    //   errors: [
    //     { messageId: 'invalidInline' },
    //     { messageId: 'invalidInline' },
    //     { messageId: 'invalidInline' },
    //   ],
    // },
  ],
});
