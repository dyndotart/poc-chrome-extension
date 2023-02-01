import React from 'React';

const FloatLayout: React.FC<TFloatLayoutProps> = (props) => {
  const { children } = props;

  return (
    <div className="fixed left-0 top-auto right-0 bottom-0 flex height-[132px] justify-center items-start bg-gradient-to-t from-indigo-500 z-50">
      <div className="relative flex overflow-scroll w-[1340px] h-[120px] mr-[5%] ml-[5%] items-center border-2 border-sky-500 bg-white text-black rounded-sm">
        {children}
      </div>
    </div>
  );
};

export default FloatLayout;

type TFloatLayoutProps = {
  children: React.ReactNode;
  innerContainerXSpacing?: boolean;
  excludeNavbarHeightInContent?: boolean;
  className?: string;
  mdx?: boolean;
};
