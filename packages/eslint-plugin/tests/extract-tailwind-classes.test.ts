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
    {
      code: `
         import React from 'react';
         
         const About: React.FC = () => {
           return (
             <div>
               <p id="text1" className="text-3xl text-green-500">About</p>
             </div>
           );
         };
         
         export default About;
      `,
    },
  ],
  invalid: [
    {
      code: `
         import React from 'react';
         
         const About: React.FC = () => {
           return (
             <div>
               <p id="text1" className="text-3xl text-green-500 extract-[Text1]">About</p>
             </div>
           );
         };
         
         export default About;
      `,
      output: `
         import React from 'react';
         
         const About: React.FC = () => {
           return (
             <div>
               <p id="text1" className={Text1}>About</p>
             </div>
           );
         };
         
         export default About;
      `,
      errors: [{ messageId: 'extracted' }],
    },
  ],
});
