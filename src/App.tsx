import { useEffect, useState } from 'react'
import './App.css'
import ProviderTable from './components/ProviderTable'
import sampleProviders from './assets/sample-data.json';
import ProviderForm from './components/ProviderForm';

export interface ProviderData {
  last_name: string;
  first_name: string;
  email_address: string;
  specialty: string;
  practice_name: string;
}

export default function App() {
  const storedProvidersItem = localStorage.getItem('providers')
  const initialProviders = storedProvidersItem !== null ? JSON.parse(storedProvidersItem) : sampleProviders;
  const [providers, setProviders] = useState<ProviderData[]>(initialProviders);

  useEffect(() => {
    console.log('Saving providers to localStorage:', providers); // Debugging log
    localStorage.setItem('providers', JSON.stringify(providers))
  }, [providers])

  return (
    <>
      <h1>Provider Directory</h1>
      <ProviderForm onSubmit={(provider) => setProviders([...providers, provider])} />
      <ProviderTable providers={providers} removeProviders={providerIndices =>
        setProviders(prev =>
          prev.filter((_, idx) => !providerIndices.includes(idx))
        )
      } />
    </>
  )
}


