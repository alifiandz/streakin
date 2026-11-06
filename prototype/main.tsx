import './components/landing.css';
import React from 'react';import {createRoot} from 'react-dom/client';import {HashRouter} from 'react-router-dom';import {Providers} from '../components/Providers';import {Pages} from './AppRoutes';import './local-api';import '../app/globals.css';
createRoot(document.getElementById('root')!).render(<HashRouter><Providers><Pages/></Providers></HashRouter>);
