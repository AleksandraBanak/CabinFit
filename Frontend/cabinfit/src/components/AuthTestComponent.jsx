import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios";

export default function AuthTestComponent() {
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/test/verify");
        console.log(response.data);
        setVerificationResult(response.data);
      } catch (error) {
        console.error("Verification failed:", error);
        navigate("/login", { state: { from: "/auth-test" }, replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  if (loading) return <div>Verifying authentication...</div>;

  return (
    <div>
      <h3>Authentication Test</h3>
      {verificationResult ? (
        <>
          <p style={{ color: 'green' }}>✓ Backend verification successful</p>
          <pre>{JSON.stringify(verificationResult, null, 2)}</pre>
        </>
      ) : (
        <p style={{ color: 'red' }}>✗ Not authenticated</p>
      )}
    </div>
  );
}