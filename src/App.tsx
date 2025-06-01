import { useEffect, useState } from 'react'
import './App.css'
import ProviderTable from './components/ProviderTable'
import sampleProviders from './assets/sample-data.json';

export interface ProviderData {
  last_name: string;
  first_name: string;
  email_address: string;
  specialty: string;
  practice_name: string;
}

export default function App() {
  const [providers, setProviders] = useState<ProviderData[]>([]);

  useEffect(() => {
    const storedProviders = localStorage.getItem('providers')
    const data = storedProviders ? JSON.parse(storedProviders) : null;
    console.log('Loaded providers from localStorage:', data); // Debugging log
    setProviders(data && data.length ? data : sampleProviders)
  }, [])

  useEffect(() => {
    if (!providers || providers.length === 0) return;
    console.log('Saving providers to localStorage:', providers); // Debugging log
    localStorage.setItem('providers', JSON.stringify(providers))
  }, [providers])

  return (
    <>
      <h1>Provider Directory</h1>
      <ProviderTable providers={providers} />
    </>
  )
}


