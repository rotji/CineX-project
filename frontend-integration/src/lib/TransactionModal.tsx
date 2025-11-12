// Transaction Confirmation Modal Component
// Reusable modal for displaying transaction details and handling confirmations

import React, { useState, useEffect } from 'react';
import type { 
  Transaction, 
  TransactionType, 
  TransactionError 
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
  onClose: () => void;
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
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={isProcessing ? undefined : onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
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
        <div className="px-6 py-4 max-h-96 overflow-y-auto" onScroll={handleScrollCheck}>
          {/* Transaction Description */}
          <div className="mb-4">
            <p className="text-gray-700">{transactionData.description}</p>
          </div>

          {/* Current Transaction Status */}
          {currentTransaction && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Transaction Status</span>
                <TransactionStatusBadge status={currentTransaction.status} compact />
              </div>
              {currentTransaction.userMessage && (
                <p className="text-sm text-blue-700">{currentTransaction.userMessage}</p>
              )}
              {currentTransaction.txId && (
                <p className="text-xs font-mono text-blue-600 mt-1">
                  ID: {currentTransaction.txId.substring(0, 20)}...
                </p>
              )}
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-3">
            {/* Amount */}
            {transactionData.amount && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-semibold text-gray-900">
                  {formatAmount(transactionData.amount)}
                </span>
              </div>
            )}

            {/* Recipient */}
            {transactionData.recipient && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Recipient</span>
                <div className="text-right">
                  {transactionData.recipientName && (
                    <p className="font-medium text-gray-900">{transactionData.recipientName}</p>
                  )}
                  <p className="font-mono text-xs text-gray-600">
                    {transactionData.recipient.substring(0, 20)}...
                  </p>
                </div>
              </div>
            )}

            {/* Estimated Fees */}
            {transactionData.estimatedFees && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Estimated Fees</span>
                <span className="font-medium text-gray-900">
                  {formatAmount(transactionData.estimatedFees)}
                </span>
              </div>
            )}

            {/* Risk Level */}
            {transactionData.riskLevel && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Risk Level</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskLevelStyle(transactionData.riskLevel)}`}>
                  {transactionData.riskLevel.toUpperCase()}
                </span>
              </div>
            )}

            {/* Metadata */}
            {transactionData.metadata && Object.keys(transactionData.metadata).length > 0 && (
              <div className="py-2">
                <div className="text-sm text-gray-600 mb-2">Additional Details</div>
                <div className="space-y-1">
                  {Object.entries(transactionData.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Warnings */}
          {transactionData.warnings && transactionData.warnings.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">Warnings</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {transactionData.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{warning}</span>
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
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">Contract:</span>
                      <span className="ml-2 font-mono text-gray-900">
                        {transactionData.contractCall.contractAddress}.{transactionData.contractCall.contractName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Function:</span>
                      <span className="ml-2 font-mono text-gray-900">
                        {transactionData.contractCall.functionName}
                      </span>
                    </div>
                    {transactionData.contractCall.functionArgs.length > 0 && (
                      <div>
                        <span className="text-gray-600">Arguments:</span>
                        <div className="mt-1 space-y-1">
                          {transactionData.contractCall.functionArgs.map((arg, index) => (
                            <div key={index} className="ml-2 text-xs">
                              <span className="text-gray-500">{arg.name} ({arg.type}):</span>
                              <span className="ml-1 font-mono">{arg.value}</span>
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
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {isProcessing ? 'Processing transaction...' : 'Review details carefully before confirming'}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
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
      const transactionId = await onConfirm(transactionData);
      
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