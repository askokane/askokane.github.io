'use client';
import { createContext, useContext } from 'react';

/** True once the boot sequence has finished (or was skipped). */
export const BootContext = createContext(false);
export const useBootReady = () => useContext(BootContext);
