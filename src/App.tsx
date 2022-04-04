import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/nav/Navbar';
import useScanStore from './store/scanStore';
import GuestListView from './views/GuestListView';
import CodeView from './views/CodeView';
import VerifyView from './views/VerifyView';

function App() {
  const { init } = useScanStore()

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CodeView />} />
        <Route path="verify" element={<VerifyView />} />
        <Route path="guest-list" element={<GuestListView />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
