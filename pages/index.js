import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'https://msme-credit-backend.onrender.com';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/sample-portfolio`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading MSME portfolio...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-xl text-red-600">Error: {error}</div>;
  if (!data) return null;

  const { portfolio_metrics, data: msmes } = data;

  const chartData = [
    {
      name: 'Traditional (Collateral)',
      Approved: portfolio_metrics.traditional_approved_count,
      Rejected: 10 - portfolio_metrics.traditional_approved_count,
      Credit: portfolio_metrics.traditional_credit_lakh,
    },
    {
      name: 'Cash Flow Model',
      Approved: portfolio_metrics.cashflow_approved_count,
      Rejected: 10 - portfolio_metrics.cashflow_approved_count,
      Credit: portfolio_metrics.cashflow_credit_lakh,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MSME Cash Flow Credit Scoring</h1>
          <p className="text-lg text-gray-600">
            Addressing India's ₹30 lakh crore credit gap through cash-flow based lending
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Traditional Approvals</p>
            <p className="text-3xl font-bold text-red-600">{portfolio_metrics.traditional_approval_rate_pct}%</p>
            <p className="text-sm text-gray-500 mt-1">{portfolio_metrics.traditional_approved_count}/10 MSMEs</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Cash Flow Approvals</p>
            <p className="text-3xl font-bold text-green-600">{portfolio_metrics.cashflow_approval_rate_pct}%</p>
            <p className="text-sm text-gray-500 mt-1">{portfolio_metrics.cashflow_approved_count}/10 MSMEs</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Extra Credit Unlocked</p>
            <p className="text-3xl font-bold text-blue-600">₹{portfolio_metrics.extra_credit_unlocked_lakh}L</p>
            <p className="text-sm text-gray-500 mt-1">Additional financing enabled</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Approval Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Approved" fill="#10b981" />
              <Bar dataKey="Rejected" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-4">
            Traditional banks approve {portfolio_metrics.traditional_approval_rate_pct}% based on collateral.
            Cash flow model approves {portfolio_metrics.cashflow_approval_rate_pct}%—unlocking ₹{portfolio_metrics.extra_credit_unlocked_lakh} lakh in additional credit.
          </p>
        </div>

        {/* MSME Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-bold">MSME Portfolio</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age (yrs)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue (₹L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Traditional</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {msmes.map((msme, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{msme.business_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{msme.business_age_years}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{msme.monthly_revenue_lakhs}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{(msme.gst_compliance_score * 100).toFixed(0)}%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{msme.cashflow_risk_score.toFixed(1)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${msme.traditional_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {msme.traditional_approved ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${msme.cashflow_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {msme.cashflow_approved ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
