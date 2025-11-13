import React from 'react';

interface StripeCheckoutButtonProps {
  priceId: string;
  customerId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckoutButton: React.FC<StripeCheckoutButtonProps> = ({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
}) => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId,
          successUrl,
          cancelUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session.');
      }

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received.');
      }
    } catch (error) {
      console.error('Error during Stripe checkout:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        padding: '10px 20px',
        backgroundColor: '#6772E5',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      Assinar com Stripe
    </button>
  );
};

export default StripeCheckoutButton;