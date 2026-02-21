import React from 'react';

export default function AmbientOrbs() {
  return (
    <>
      <div className="fixed top-[-10vh] left-[-10vw] w-[700px] h-[700px] bg-[#00d4b6] rounded-full blur-[200px] opacity-[0.07] float-element pointer-events-none z-[5]"></div>
      <div className="fixed bottom-[-10vh] right-[-10vw] w-[900px] h-[900px] bg-[#0044ff] rounded-full blur-[250px] opacity-[0.05] float-element pointer-events-none z-[5]"></div>
    </>
  );
}