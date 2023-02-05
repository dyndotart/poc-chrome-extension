// https://www.typescriptlang.org/docs/handbook/modules.html#working-with-other-javascript-libraries

declare module 'tailwindcss/lib/lib/setupContextUtils' {
  export type TTailwindContext = {
    disposables: any[];
    ruleCache: Set<any>;
    candidateRuleCache: Map<any, any>;
    classCache: Map<any, any>;
    applyClassCache: Map<any, any>;
    // Seed the not class cache with the blocklist (which is only strings)
    notClassCache: Set<any>;
    postCssNodeCache: Map<any, any>;
    candidateRuleMap: Map<any, any>;
    tailwindConfig: any;
    changedContent: any[];
    variantMap: Map<any, any>;
    stylesheetCache: null;
    variantOptions: Map<any, any>;
    offsets: any;
    notClassCache: Set<any>;

    getClassList: (classList: string[]) => [string, number][]; // [className, order]
    getClassOrder: () => any;
    getVariants: () => any;
    markInvalidUtilityCandidate: () => any;
    markInvalidUtilityNode: () => any;
  };

  export function createContext(
    tailwindConfig: any,
    changedContent?: any[],
    root?: any
  ): TTailwindContext;
}
