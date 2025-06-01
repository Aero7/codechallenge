import { useEffect, useState } from "react";
import ProviderTable from "./components/ProviderTable";
import sampleProviders from "./assets/sample-data.json";
import ProviderForm from "./components/ProviderForm";

export interface ProviderData {
  first_name: string;
  last_name: string;
  email_address: string;
  specialty: string;
  practice_name: string;
}

export default function App() {
  const storedProvidersItem = localStorage.getItem("providers");
  const initialProviders =
    storedProvidersItem !== null
      ? JSON.parse(storedProvidersItem)
      : sampleProviders;
  const [providers, setProviders] = useState<ProviderData[]>(initialProviders);

  useEffect(() => {
    console.log("Saving providers to localStorage:", providers); // Debugging log
    localStorage.setItem("providers", JSON.stringify(providers));
  }, [providers]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Provider Directory
          </a>
        </div>
      </nav>

      <div id="app" className="container-fluid">
        <ProviderForm
          onSubmit={(provider) => setProviders([...providers, provider])}
        />
        <ProviderTable
          providers={providers}
          onRemove={(indices) =>
            setProviders((prev) => prev.filter((_, i) => !indices.includes(i)))
          }
        />
      </div>
    </>
  );
}
