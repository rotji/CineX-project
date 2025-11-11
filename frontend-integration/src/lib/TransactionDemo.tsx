// Transaction Demo Component
// Demonstrates the transaction status tracking system with interactive examples

import React, { useState } from 'react';
import { 
  TransactionStatusBadge,
  useTransactionNotifications,
  TransactionToast
} from './TransactionStatusUI';
import { 
  DemoTransactions, 
  useDemoWallet,
  type CampaignCreateParams,
  type PoolCreateParams
} from './demoTransactions';

/**
 * Demo component showing transaction tracking features
 */
export const TransactionDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('wallet');
  const { toasts, showToast, hideToast, clearAllToasts } = useTransactionNotifications();
  const wallet = useDemoWallet();
  
  // Form states for different transaction types
  const [campaignForm, setCampaignForm] = useState<CampaignCreateParams>({
    title: 'My Independent Film',
    description: 'A compelling story about...',
    targetAmount: 50000,
    duration: 30,
    category: 'Drama'
  });
  
  const [poolForm, setPoolForm] = useState<PoolCreateParams>({
    name: 'Indie Filmmakers Pool',
    description: 'A collaborative pool for independent filmmakers',
    bondAmount: 1000,
    maxMembers: 10,
    duration: 90
  });
  
  const [contributeForm, setContributeForm] = useState({
    campaignId: 1,
    amount: 5000
  });

  const handleCampaignCreate = async () => {
    try {
      const txId = await DemoTransactions.createCampaign(campaignForm);
      const transaction = { 
        id: txId, 
        title: 'Create Campaign',
        status: 'pending' as const,
        userMessage: 'Starting campaign creation...',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        retryCount: 0,
        canRetry: true,
        maxRetries: 3,
        type: 'campaign-create' as const,
        description: `Creating campaign: ${campaignForm.title}`
      };
      showToast(transaction);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleContribute = async () => {
    try {
      const txId = await DemoTransactions.contributeToCampaign(
        contributeForm.campaignId, 
        contributeForm.amount
      );
      const transaction = { 
        id: txId,
        title: 'Contribute to Campaign',
        status: 'pending' as const,
        userMessage: 'Processing contribution...',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        retryCount: 0,
        canRetry: true,
        maxRetries: 3,
        type: 'campaign-contribute' as const,
        description: `Contributing ${contributeForm.amount} μSTX`,
        amount: contributeForm.amount.toString()
      };
      showToast(transaction);
    } catch (error) {
      console.error('Failed to contribute:', error);
    }
  };

  const handlePoolCreate = async () => {
    try {
      const txId = await DemoTransactions.createPool(poolForm);
      const transaction = { 
        id: txId,
        title: 'Create Pool',
        status: 'pending' as const,
        userMessage: 'Creating Co-EP pool...',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        retryCount: 0,
        canRetry: true,
        maxRetries: 3,
        type: 'pool-create' as const,
        description: `Creating pool: ${poolForm.name}`
      };
      showToast(transaction);
    } catch (error) {
      console.error('Failed to create pool:', error);
    }
  };

  const renderWalletDemo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Connection</h3>
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connection Status:</p>
              <TransactionStatusBadge 
                status={wallet.isConnected ? 'success' : 'idle'} 
              />
            </div>
            {wallet.address && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Address:</p>
                <p className="font-mono text-xs text-gray-900">
                  {wallet.address.substring(0, 20)}...
                </p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            {!wallet.isConnected ? (
              <button
                onClick={wallet.connect}
                disabled={wallet.isConnecting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <button
                onClick={wallet.disconnect}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaignDemo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Creation</h3>
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount (μSTX)
              </label>
              <input
                type="number"
                value={campaignForm.targetAmount}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, targetAmount: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={campaignForm.category}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="Drama">Drama</option>
                <option value="Comedy">Comedy</option>
                <option value="Documentary">Documentary</option>
                <option value="Horror">Horror</option>
                <option value="Sci-Fi">Sci-Fi</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={campaignForm.duration}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={campaignForm.description}
              onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <button
            onClick={handleCampaignCreate}
            disabled={!wallet.isConnected}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Campaign (Demo)
          </button>
          
          {!wallet.isConnected && (
            <p className="text-sm text-gray-500">Connect wallet to create campaign</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContributeDemo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Contribution</h3>
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign ID
              </label>
              <input
                type="number"
                value={contributeForm.campaignId}
                onChange={(e) => setContributeForm(prev => ({ ...prev, campaignId: parseInt(e.target.value) || 1 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (μSTX)
              </label>
              <input
                type="number"
                value={contributeForm.amount}
                onChange={(e) => setContributeForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <button
            onClick={handleContribute}
            disabled={!wallet.isConnected}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Contribute (Demo)
          </button>
          
          {!wallet.isConnected && (
            <p className="text-sm text-gray-500">Connect wallet to contribute</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPoolDemo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Co-EP Pool Creation</h3>
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pool Name
              </label>
              <input
                type="text"
                value={poolForm.name}
                onChange={(e) => setPoolForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bond Amount (μSTX)
              </label>
              <input
                type="number"
                value={poolForm.bondAmount}
                onChange={(e) => setPoolForm(prev => ({ ...prev, bondAmount: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Members
              </label>
              <input
                type="number"
                value={poolForm.maxMembers}
                onChange={(e) => setPoolForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={poolForm.duration}
                onChange={(e) => setPoolForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={poolForm.description}
              onChange={(e) => setPoolForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <button
            onClick={handlePoolCreate}
            disabled={!wallet.isConnected}
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Pool (Demo)
          </button>
          
          {!wallet.isConnected && (
            <p className="text-sm text-gray-500">Connect wallet to create pool</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          CineX Transaction Demo
        </h1>
        <p className="text-gray-600 mb-6">
          Interactive demonstration of the transaction status tracking system
        </p>
        
        {toasts.length > 0 && (
          <button
            onClick={clearAllToasts}
            className="text-sm text-blue-600 hover:text-blue-800 underline mb-4"
          >
            Clear All Notifications ({toasts.length})
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'wallet', label: 'Wallet' },
          { id: 'campaign', label: 'Campaign' },
          { id: 'contribute', label: 'Contribute' },
          { id: 'pool', label: 'Co-EP Pool' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveDemo(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeDemo === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeDemo === 'wallet' && renderWalletDemo()}
        {activeDemo === 'campaign' && renderCampaignDemo()}
        {activeDemo === 'contribute' && renderContributeDemo()}
        {activeDemo === 'pool' && renderPoolDemo()}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          How to Use This Demo
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>1. Wallet:</strong> Connect the demo wallet to enable transactions
          </p>
          <p>
            <strong>2. Campaign:</strong> Create a funding campaign and watch the multi-step progress
          </p>
          <p>
            <strong>3. Contribute:</strong> Contribute to a campaign with simple progress tracking
          </p>
          <p>
            <strong>4. Co-EP Pool:</strong> Create a collaborative funding pool with step-by-step progress
          </p>
          <p className="mt-4 font-medium">
            Watch for toast notifications in the top-right corner showing transaction status updates!
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
      {toasts.map(transaction => (
        <TransactionToast
          key={transaction.id}
          transaction={transaction}
          onDismiss={() => hideToast(transaction.id)}
        />
      ))}
    </div>
  );
};