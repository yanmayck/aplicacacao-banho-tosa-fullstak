import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ServicePackage {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  onlinePrice?: number;
  pickupPrice?: number;
  durationInMonths?: number;
  totalServices: number;
  includesBaths: boolean;
  includesGrooming: boolean;
  includesHydration: boolean;
  isOnlineEnabled: boolean;
}

const ServicePackagesList: React.FC = () => {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServicePackages = async () => {
      try {
        const response = await axios.get('/api/service-packages'); // Ajuste a URL da API conforme necessário
        setServicePackages(response.data);
      } catch (err) {
        setError('Failed to fetch service packages.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServicePackages();
  }, []);

  const handlePurchaseOnline = async (packageId: string) => {
    try {
      // Supondo que você tenha um clientId disponível no frontend (talvez do contexto de usuário logado)
      const clientId = 'YOUR_CLIENT_ID'; // TODO: Substituir pelo ID do cliente real
      const response = await axios.post(`/api/service-packages/${packageId}/purchase-online`, { clientId });
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (err) {
      alert('Failed to initiate online purchase.');
      console.error(err);
    }
  };

  const handleRegisterOffline = async (packageId: string) => {
    try {
      const clientId = 'YOUR_CLIENT_ID'; // TODO: Substituir pelo ID do cliente real
      await axios.post(`/api/service-packages/${packageId}/register-offline`, { clientId });
      alert('Offline payment registered successfully!');
      // Atualizar a lista de pacotes ou o estado do cliente, se necessário
    } catch (err) {
      alert('Failed to register offline payment.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading service packages...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Service Packages</h2>
      {servicePackages.length === 0 ? (
        <p>No service packages available.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {servicePackages.map((pkg) => (
            <div key={pkg.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <p>Base Price: ${pkg.basePrice.toFixed(2)}</p>
              {pkg.onlinePrice && <p>Online Price: ${pkg.onlinePrice.toFixed(2)}</p>}
              {pkg.pickupPrice && <p>Pickup Price: ${pkg.pickupPrice.toFixed(2)}</p>}
              {pkg.includesBaths && <p>Includes Baths: Yes</p>}
              {pkg.includesGrooming && <p>Includes Grooming: Yes</p>}
              {pkg.includesHydration && <p>Includes Hydration: Yes</p>}
              {pkg.durationInMonths && <p>Duration: {pkg.durationInMonths} months</p>}
              <p>Total Services: {pkg.totalServices}</p>
              {pkg.isOnlineEnabled && (
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handlePurchaseOnline(pkg.id)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                    Comprar Online
                  </button>
                </div>
              )}
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleRegisterOffline(pkg.id)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                  Registrar Pagamento Offline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicePackagesList;