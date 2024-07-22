import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Business = () => {
  const { auth } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axiosBase.get('/businesses/own', {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        setBusiness(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('No businesses found. Would you like to let us know where you work?');
        } else {
          setError(error.message);
        }
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [auth.access_token]);

  const handleClick = () => {
    window.location.href = `/business?tab=mine`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center">
          <p className="text-sm mb-4">{error}</p>
          <Button onClick={handleClick} className="rounded-full">
            Let us know
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-4 flex flex-col items-start justify-start cursor-pointer hover:bg-lightBlue"
      onClick={handleClick}
    >
      <h1 className="text-center text-2xl font-bold mb-4">Business</h1>
      {business ? (
        <div className="text-sm">
          <p><strong>Name:</strong> {business.name.name}</p>
          <p><strong>Occupation:</strong> {business.occupation}</p>
          <p><strong>Sub-Occupation:</strong> {business.subOccupation}</p>
          <p><strong>Website:</strong> <a href={business.websiteUrl} target="_blank" rel="noopener noreferrer">{business.websiteUrl}</a></p>
        </div>
      ) : (
        <p className="text-sm">No business data available.</p>
      )}
    </Card>
  );
};

export default Business;
