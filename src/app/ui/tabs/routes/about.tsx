import React from 'react';

const About: React.FC = () => {
  return (
    <div className={Container}>
      <p className={Text}>About</p>
    </div>
  );
};

export default About;

const Text = 'text-3xl text-green-500';

const Container = 'flex items-center';
