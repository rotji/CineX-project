// Transaction Confirmation Modal Component
// Reusable modal for displaying transaction details and handling confirmations

import React, { useState, useEffect } from 'react';
import type { 
  Transaction, 
  TransactionType
} from './transactionTracker';
import { TransactionStatusBadge } from './TransactionStatusUI';

/**
 * Transaction confirmation data interface
 */
export interface TransactionConfirmationData {
  type: TransactionType;
  title: string;
  description: string;
  amount?: string;
  recipient?: string;
  recipientName?: string;
  estimatedFees?: string;
  contractCall?: {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: Array<{ name: string; type: string; value: string }>;
  };
  metadata?: { [key: string]: string | number };
  riskLevel?: 'low' | 'medium' | 'high';
  warnings?: string[];
}

/**
 * Transaction modal props
 */
export interface TransactionModalProps {
  isOpen: boolean;
  transactionData: TransactionConfirmationData;
  currentTransaction?: Transaction;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isProcessing?: boolean;
  showAdvancedDetails?: boolean;
  className?: string;
}

/**
 * Hook for managing transaction modals
 */
export interface TransactionModalHook {
  isOpen: boolean;
  transactionData: TransactionConfirmationData | null;
  currentTransaction: Transaction | null;
  openModal: (data: TransactionConfirmationData) => void;
  closeModal: () => void;
  confirmTransaction: () => Promise<void>;
  isProcessing: boolean;
}

/**
 * Main transaction modal component
 */
export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  transactionData,
  currentTransaction,
  onConfirm,
  onCancel,
  onClose,
  isProcessing = false,
  showAdvancedDetails = false,
  className = ""
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsAdvancedOpen(showAdvancedDetails);
      setUserHasScrolled(false);
    }
  }, [isOpen, showAdvancedDetails]);

  // Handle scroll to detect user engagement
  const handleScrollCheck = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop > 50 && !userHasScrolled) {
      setUserHasScrolled(true);
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isProcessing) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isProcessing, onCancel]);

  // Format amount for display
  const formatAmount = (amount: string) => {
    const num = parseInt(amount);
    return num.toLocaleString() + ' μSTX';
  };

  // Get risk level styling
  const getRiskLevelStyle = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  // Get transaction type display info
  const getTransactionTypeInfo = (type: TransactionType) => {
    const typeInfo = {
      'campaign-create': { 
        icon: '🎬', 
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        description: 'Create a new crowdfunding campaign'
      },
      'campaign-contribute': { 
        icon: '💰', 
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        description: 'Contribute funds to a campaign'
      },
      'campaign-update': { 
        icon: '📝', 
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        description: 'Update campaign details'
      },
      'pool-create': { 
        icon: '🏊‍♂️', 
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        description: 'Create a new Co-EP funding pool'
      },
      'pool-join': { 
        icon: '🤝', 
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        description: 'Join an existing funding pool'
      },
      'pool-contribute': { 
        icon: '💸', 
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
        description: 'Contribute to a funding pool'
      },
      'escrow-deposit': { 
        icon: '🔒', 
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        description: 'Deposit funds into escrow'
      },
      'escrow-withdraw': { 
        icon: '🔓', 
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        description: 'Withdraw funds from escrow'
      },
      'verification-submit': { 
        icon: '✅', 
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        description: 'Submit content for verification'
      },
      'verification-update': { 
        icon: '🔄', 
        color: 'text-lime-600',
        bgColor: 'bg-lime-50',
        description: 'Update verification status'
      },
      'nft-mint': { 
        icon: '🎨', 
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        description: 'Mint NFT rewards'
      },
      'token-transfer': { 
        icon: '↗️', 
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        description: 'Transfer tokens'
      }
    };

    return typeInfo[type] || typeInfo['token-transfer'];
  };

  if (!isOpen) return null;

  const typeInfo = getTransactionTypeInfo(transactionData.type);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={isProcessing ? undefined : onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden border-2 border-gray-300">
        {/* Header */}
        <div className={`px-6 py-4 ${typeInfo.bgColor} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{typeInfo.icon}</span>
              <div>
                <h2 className={`text-lg font-semibold ${typeInfo.color}`}>
                  {transactionData.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {typeInfo.description}
                </p>
              </div>
            </div>
            
            {!isProcessing && (
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto bg-gray-50" onScroll={handleScrollCheck}>
          {/* Transaction Description */}
          <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-gray-900 font-medium">{transactionData.description}</p>
          </div>

          {/* Current Transaction Status */}
          {currentTransaction && (
            <div className="mb-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-blue-900">🔄 Transaction Status</span>
                <TransactionStatusBadge status={currentTransaction.status} compact />
              </div>
              {currentTransaction.userMessage && (
                <p className="text-sm text-blue-900 font-medium bg-white p-2 rounded border border-blue-200">{currentTransaction.userMessage}</p>
              )}
              {currentTransaction.txId && (
                <p className="text-xs font-mono text-blue-800 mt-2 bg-blue-50 p-2 rounded border">
                  <span className="font-bold">TX ID:</span> {currentTransaction.txId.substring(0, 20)}...
                </p>
              )}
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Transaction Details</h3>
            {/* Amount */}
            {transactionData.amount && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200 bg-gray-50 px-3 rounded">
                <span className="text-sm font-medium text-gray-900">Amount</span>
                <span className="font-bold text-blue-600 text-lg">
                  {formatAmount(transactionData.amount)}
                </span>
              </div>
            )}

            {/* Recipient */}
            {transactionData.recipient && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200 bg-gray-50 px-3 rounded">
                <span className="text-sm font-medium text-gray-900">Recipient</span>
                <div className="text-right">
                  {transactionData.recipientName && (
                    <p className="font-semibold text-gray-900">{transactionData.recipientName}</p>
                  )}
                  <p className="font-mono text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded">
                    {transactionData.recipient.substring(0, 20)}...
                  </p>
                </div>
              </div>
            )}

            {/* Estimated Fees */}
            {transactionData.estimatedFees && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200 bg-gray-50 px-3 rounded">
                <span className="text-sm font-medium text-gray-900">Estimated Fees</span>
                <span className="font-semibold text-orange-600">
                  {formatAmount(transactionData.estimatedFees)}
                </span>
              </div>
            )}

            {/* Risk Level */}
            {transactionData.riskLevel && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200 bg-gray-50 px-3 rounded">
                <span className="text-sm font-medium text-gray-900">Risk Level</span>
                <span className={`px-3 py-1 text-sm font-bold rounded-full border-2 ${getRiskLevelStyle(transactionData.riskLevel)}`}>
                  {transactionData.riskLevel.toUpperCase()}
                </span>
              </div>
            )}

            {/* Metadata */}
            {transactionData.metadata && Object.keys(transactionData.metadata).length > 0 && (
              <div className="py-3 bg-blue-50 px-3 rounded border border-blue-200">
                <div className="text-sm font-semibold text-blue-900 mb-2">Additional Details</div>
                <div className="space-y-2">
                  {Object.entries(transactionData.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm bg-white p-2 rounded border">
                      <span className="text-gray-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-gray-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Warnings */}
          {transactionData.warnings && transactionData.warnings.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-base font-bold text-red-900">⚠️ Important Warnings</span>
              </div>
              <ul className="text-sm text-red-800 space-y-2">
                {transactionData.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start bg-white p-2 rounded border border-red-200">
                    <span className="text-red-600 font-bold mr-2">•</span>
                    <span className="font-medium">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advanced Details */}
          {transactionData.contractCall && (
            <div className="mt-4">
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <span>Advanced Details</span>
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isAdvancedOpen && (
                <div className="mt-3 p-4 bg-gray-900 rounded-lg text-sm border-2 border-gray-700">
                  <div className="space-y-3">
                    <div className="bg-gray-800 p-2 rounded">
                      <span className="text-gray-300 font-medium">Contract:</span>
                      <span className="ml-2 font-mono text-green-400 font-bold">
                        {transactionData.contractCall.contractAddress}.{transactionData.contractCall.contractName}
                      </span>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <span className="text-gray-300 font-medium">Function:</span>
                      <span className="ml-2 font-mono text-blue-400 font-bold">
                        {transactionData.contractCall.functionName}
                      </span>
                    </div>
                    {transactionData.contractCall.functionArgs.length > 0 && (
                      <div className="bg-gray-800 p-2 rounded">
                        <span className="text-gray-300 font-medium">Arguments:</span>
                        <div className="mt-2 space-y-2">
                          {transactionData.contractCall.functionArgs.map((arg, index) => (
                            <div key={index} className="bg-gray-700 p-2 rounded text-xs">
                              <span className="text-yellow-400 font-medium">{arg.name} ({arg.type}):</span>
                              <span className="ml-2 font-mono text-white">{arg.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-100 border-t-2 border-gray-300 flex items-center justify-between">
          <div className="text-sm text-gray-800 font-medium">
            {isProcessing ? '⏳ Processing transaction...' : '⚠️ Review details carefully before confirming'}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="px-6 py-3 text-sm font-bold text-gray-800 bg-white border-2 border-gray-400 rounded-lg hover:bg-gray-100 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="px-6 py-3 text-sm font-bold text-white bg-blue-600 border-2 border-blue-700 rounded-lg hover:bg-blue-700 hover:border-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center space-x-2"
            >
              {isProcessing && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              )}
              <span>{isProcessing ? 'Processing...' : 'Confirm Transaction'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing transaction confirmation modals
 */
export function useTransactionModal(
  onConfirm?: (data: TransactionConfirmationData) => Promise<string>
): TransactionModalHook {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionConfirmationData | null>(null);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = (data: TransactionConfirmationData) => {
    setTransactionData(data);
    setIsOpen(true);
    setCurrentTransaction(null);
  };

  const closeModal = () => {
    if (!isProcessing) {
      setIsOpen(false);
      setTransactionData(null);
      setCurrentTransaction(null);
    }
  };

  const confirmTransaction = async () => {
    if (!transactionData || !onConfirm || isProcessing) return;

    setIsProcessing(true);
    try {
      await onConfirm(transactionData);
      
      // You would typically track the transaction here
      // For now, we'll just simulate success
      setTimeout(() => {
        setIsProcessing(false);
        setIsOpen(false);
        setTransactionData(null);
        setCurrentTransaction(null);
      }, 2000);
      
    } catch (error) {
      console.error('Transaction confirmation failed:', error);
      setIsProcessing(false);
      // Handle error (show error state, etc.)
    }
  };

  return {
    isOpen,
    transactionData,
    currentTransaction,
    openModal,
    closeModal,
    confirmTransaction,
    isProcessing
  };
}

/**
 * Predefined transaction confirmation templates
 */
export const TransactionTemplates = {
  campaignContribution: (campaignId: number, amount: number, campaignTitle: string): TransactionConfirmationData => ({
    type: 'campaign-contribute',
    title: 'Contribute to Campaign',
    description: `You are about to contribute to "${campaignTitle}". Your contribution will help fund this creative project.`,
    amount: amount.toString(),
    recipient: `Campaign #${campaignId}`,
    recipientName: campaignTitle,
    estimatedFees: '1000', // Example fee
    riskLevel: 'low',
    metadata: {
      campaignId: campaignId,
      campaignTitle: campaignTitle
    }
  }),

  poolJoin: (poolId: number, bondAmount: number, poolName: string): TransactionConfirmationData => ({
    type: 'pool-join',
    title: 'Join Co-EP Pool',
    description: `You are joining "${poolName}". This will lock your bond amount until the pool cycle completes.`,
    amount: bondAmount.toString(),
    recipient: `Pool #${poolId}`,
    recipientName: poolName,
    estimatedFees: '1500',
    riskLevel: 'medium',
    warnings: [
      'Bond amount will be locked for the duration of the pool cycle',
      'You will be committed to the rotation schedule'
    ],
    metadata: {
      poolId: poolId,
      poolName: poolName,
      bondAmount: bondAmount
    }
  }),

  campaignCreate: (title: string, targetAmount: number): TransactionConfirmationData => ({
    type: 'campaign-create',
    title: 'Create Campaign',
    description: `Create a new crowdfunding campaign "${title}" with a target of ${targetAmount.toLocaleString()} μSTX.`,
    estimatedFees: '2000',
    riskLevel: 'low',
    metadata: {
      campaignTitle: title,
      targetAmount: targetAmount
    }
  }),

  poolCreate: (name: string, bondAmount: number, maxMembers: number): TransactionConfirmationData => ({
    type: 'pool-create',
    title: 'Create Co-EP Pool',
    description: `Create a new Co-EP funding pool "${name}" with ${maxMembers} maximum members and ${bondAmount.toLocaleString()} μSTX bond requirement.`,
    estimatedFees: '2500',
    riskLevel: 'medium',
    warnings: [
      'As pool creator, you are responsible for managing the rotation schedule',
      'Pool settings cannot be changed once created'
    ],
    metadata: {
      poolName: name,
      bondAmount: bondAmount,
      maxMembers: maxMembers
    }
  })
};