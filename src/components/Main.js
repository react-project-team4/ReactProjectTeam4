import React, { useState } from 'react';
import { Stack } from 'react-bootstrap';
const Main = () => {
  return (
    <>
      <Stack gap={2}>
        <div className='p-2' style={{ backgroundColor: "red" }}>First item</div>
        <div className='p-2' style={{ backgroundColor: "blue" }}>Second item</div>
      </Stack>
    </>
  )
}

export default Main;

