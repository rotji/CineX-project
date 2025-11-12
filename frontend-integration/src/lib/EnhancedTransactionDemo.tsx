// Enhanced Transaction Demo with Modal Integration
// Demonstrates the transaction confirmation modal with the existing transaction tracking system

import React, { useState } from 'react';
import { 
  TransactionStatusBadge,
  useTransactionNotifications,
  TransactionToast
} from './TransactionStatusUI';
import { transactionTracker } from './transactionTracker';
import { 
  DemoTransactions, 
  useDemoWallet,
  type CampaignCreateParams,
  type PoolCreateParams
} from './demoTransactions';
import { 
  TransactionModal,
  useTransactionModal,
  TransactionTemplates,
  type TransactionConfirmationData
} from './TransactionModal';

/**
 * Enhanced demo component with modal integration
 */
export const EnhancedTransactionDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('wallet');
  const { toasts, showToast, hideToast, clearAllToasts } = useTransactionNotifications();
  const wallet = useDemoWallet();
  
  // Transaction modal hook
  const modal = useTransactionModal(async (data: TransactionConfirmationData) => {
    // Handle different transaction types
    switch (data.type) {
      case 'campaign-contribute':
        const campaignId = data.metadata?.campaignId as number || 1;
        const amount = parseInt(data.amount || '0');
        return await DemoTransactions.contributeToCampaign(campaignId, amount);
        
      case 'pool-join':
        const poolId = data.metadata?.poolId as number || 1;
        const bondAmount = data.metadata?.bondAmount as number || 1000;
        return await DemoTransactions.joinPool(poolId, bondAmount);
        
      case 'campaign-create':
        const campaignParams: CampaignCreateParams = {
          title: data.metadata?.campaignTitle as string || 'New Campaign',
          description: 'Campaign created via modal',
          targetAmount: data.metadata?.targetAmount as number || 50000,
          duration: 30,
          category: 'Drama'
        };
        return await DemoTransactions.createCampaign(campaignParams);
        
      case 'pool-create':
        const poolParams: PoolCreateParams = {
          name: data.metadata?.poolName as string || 'New Pool',
          description: 'Pool created via modal',
          bondAmount: data.metadata?.bondAmount as number || 1000,
          maxMembers: data.metadata?.maxMembers as number || 10,
          duration: 90
        };
        return await DemoTransactions.createPool(poolParams);
        
      default:
        throw new Error('Unsupported transaction type');
    }
  });

  // Form states
  const [contributeForm, setContributeForm] = useState({
    campaignId: 1,
    campaignTitle: 'Independent Film Project',
    amount: 5000
  });
  
  const [poolJoinForm, setPoolJoinForm] = useState({
    poolId: 1,
    poolName: 'Indie Filmmakers Collective',
    bondAmount: 2500
  });

  const [campaignCreateForm, setCampaignCreateForm] = useState({
    title: 'My Documentary Film',
    targetAmount: 75000
  });

  const [poolCreateForm, setPoolCreateForm] = useState({
    name: 'Documentary Pool',
    bondAmount: 1500,
    maxMembers: 8
  });

  // Modal handlers
  const handleContributeModal = () => {
    const confirmationData = TransactionTemplates.campaignContribution(
      contributeForm.campaignId,
      contributeForm.amount,
      contributeForm.campaignTitle
    );
    modal.openModal(confirmationData);
  };

  const handlePoolJoinModal = () => {
    const confirmationData = TransactionTemplates.poolJoin(
      poolJoinForm.poolId,
      poolJoinForm.bondAmount,
      poolJoinForm.poolName
    );
    modal.openModal(confirmationData);
  };

  const handleCampaignCreateModal = () => {
    const confirmationData = TransactionTemplates.campaignCreate(
      campaignCreateForm.title,
      campaignCreateForm.targetAmount
    );
    modal.openModal(confirmationData);
  };

  const handlePoolCreateModal = () => {
    const confirmationData = TransactionTemplates.poolCreate(
      poolCreateForm.name,
      poolCreateForm.bondAmount,
      poolCreateForm.maxMembers
    );
    modal.openModal(confirmationData);
  };

  // Direct transaction handlers (without modal)
  const handleDirectContribute = async () => {
    try {
      const txId = await DemoTransactions.contributeToCampaign(
        contributeForm.campaignId,
        contributeForm.amount
      );
      showNotification(txId);
    } catch (error) {
      console.error('Failed to contribute:', error);
    }
  };

  const showNotification = (txId: string) => {
    const transaction = transactionTracker.getTransaction(txId);
    if (transaction) {
      showToast(transaction);
    }
  };

  const renderWalletDemo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Connection Status</h3>
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status:</p>
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
                {wallet.isConnecting ? 'Connecting...' : 'Connect Demo Wallet'}
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

  const renderContributeDemo = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">💰 Campaign Contribution</h3>
        <div className="bg-gray-100 rounded-lg p-8 space-y-6 border-2 border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">
                🎬 Campaign Title
              </label>
              <input
                type="text"
                value={contributeForm.campaignTitle}
                onChange={(e) => setContributeForm(prev => ({ ...prev, campaignTitle: e.target.value }))}
                className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-medium bg-white"
              />
            </div>
            
            <div>
              <label className="block text-base font-bold text-gray-900 mb-2">
                🔢 Campaign ID
              </label>
              <input
                type="number"
                value={contributeForm.campaignId}
                onChange={(e) => setContributeForm(prev => ({ ...prev, campaignId: parseInt(e.target.value) || 1 }))}
                className="w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-base font-medium bg-white"
              />
            </div>
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
          
          <div className="flex space-x-3">
            <button
              onClick={handleContributeModal}
              disabled={!wallet.isConnected}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Contribute (With Modal)
            </button>
            
            <button
              onClick={handleDirectContribute}
              disabled={!wallet.isConnected}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Direct Contribute
            </button>
          </div>
          
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Co-EP Pool Operations</h3>
        
        {/* Pool Join */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
          <h4 className="font-medium text-gray-900">Join Existing Pool</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pool Name
              </label>
              <input
                type="text"
                value={poolJoinForm.poolName}
                onChange={(e) => setPoolJoinForm(prev => ({ ...prev, poolName: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pool ID
              </label>
              <input
                type="number"
                value={poolJoinForm.poolId}
                onChange={(e) => setPoolJoinForm(prev => ({ ...prev, poolId: parseInt(e.target.value) || 1 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bond Amount (μSTX)
            </label>
            <input
              type="number"
              value={poolJoinForm.bondAmount}
              onChange={(e) => setPoolJoinForm(prev => ({ ...prev, bondAmount: parseInt(e.target.value) || 0 }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <button
            onClick={handlePoolJoinModal}
            disabled={!wallet.isConnected}
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Pool (With Modal)
          </button>
        </div>

        {/* Pool Create */}
        <div className="bg-blue-50 rounded-lg p-6 space-y-4">
          <h4 className="font-medium text-gray-900">Create New Pool</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pool Name
              </label>
              <input
                type="text"
                value={poolCreateForm.name}
                onChange={(e) => setPoolCreateForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bond Amount (μSTX)
              </label>
              <input
                type="number"
                value={poolCreateForm.bondAmount}
                onChange={(e) => setPoolCreateForm(prev => ({ ...prev, bondAmount: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Members
            </label>
            <input
              type="number"
              value={poolCreateForm.maxMembers}
              onChange={(e) => setPoolCreateForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 0 }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <button
            onClick={handlePoolCreateModal}
            disabled={!wallet.isConnected}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Pool (With Modal)
          </button>
        </div>
        
        {!wallet.isConnected && (
          <p className="text-sm text-gray-500">Connect wallet to perform pool operations</p>
        )}
      </div>
    </div>
  );

  const renderCampaignDemo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Creation</h3>
        <div className="bg-green-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                value={campaignCreateForm.title}
                onChange={(e) => setCampaignCreateForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount (μSTX)
              </label>
              <input
                type="number"
                value={campaignCreateForm.targetAmount}
                onChange={(e) => setCampaignCreateForm(prev => ({ ...prev, targetAmount: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <button
            onClick={handleCampaignCreateModal}
            disabled={!wallet.isConnected}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Campaign (With Modal)
          </button>
          
          {!wallet.isConnected && (
            <p className="text-sm text-gray-500">Connect wallet to create campaign</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CineX Transaction Modal Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Experience the enhanced transaction confirmation system with detailed modals
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
      <div className="flex space-x-2 bg-gray-200 p-2 rounded-lg border-2 border-gray-300">
        {[
          { id: 'wallet', label: 'Wallet', icon: '🔗' },
          { id: 'contribute', label: 'Contribute', icon: '💰' },
          { id: 'pools', label: 'Pools', icon: '🏊‍♂️' },
          { id: 'campaign', label: 'Create Campaign', icon: '🎬' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveDemo(tab.id)}
            className={`flex-1 px-4 py-3 text-base font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 border-2 ${
              activeDemo === tab.id
                ? 'bg-white text-gray-900 shadow-lg border-blue-400'
                : 'text-gray-700 hover:text-gray-900 bg-gray-100 border-transparent hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div className="bg-white border-4 border-gray-300 rounded-lg p-8 shadow-lg">
        {activeDemo === 'wallet' && renderWalletDemo()}
        {activeDemo === 'contribute' && renderContributeDemo()}
        {activeDemo === 'pools' && renderPoolDemo()}
        {activeDemo === 'campaign' && renderCampaignDemo()}
      </div>

      {/* Instructions */}
      <div className="bg-blue-100 border-4 border-blue-300 rounded-lg p-8 shadow-lg">
        <h3 className="text-xl font-bold text-blue-900 mb-5 border-b-2 border-blue-400 pb-2">
          🚀 Transaction Modal Features
        </h3>
        <div className="text-base text-blue-900 space-y-4">
          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
            <strong className="text-lg">📋 Detailed Information:</strong> Each modal shows transaction type, amount, recipient, fees, and risk level
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
            <strong className="text-lg">⚠️ Safety Features:</strong> Warnings for high-risk transactions and detailed confirmations
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
            <strong className="text-lg">🔍 Advanced Details:</strong> Expandable contract call information for developers
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
            <strong className="text-lg">🎮 Interactive Demo:</strong> Compare modal vs direct transaction flows
          </div>
          <div className="mt-6 font-bold text-lg bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
            💡 Try both "With Modal" and "Direct" buttons to see the difference!
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modal.isOpen}
        transactionData={modal.transactionData!}
        currentTransaction={modal.currentTransaction || undefined}
        onConfirm={modal.confirmTransaction}
        onCancel={modal.closeModal}
        onClose={modal.closeModal}
        isProcessing={modal.isProcessing}
      />

      {/* Toast Notifications */}
        {toasts.map(transaction => (
          <TransactionToast
            key={transaction.id}
            transaction={transaction}
            onDismiss={() => hideToast(transaction.id)}
          />
        ))}
      </div>
    </div>
  );
};