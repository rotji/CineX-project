// Transaction Status UI Components
// User-facing components for displaying transaction progress and feedback

import React, { useState, useEffect } from 'react';
import type { 
  Transaction, 
  TransactionStatus as TxStatus, 
  TransactionStep
} from './transactionTracker';

/**
 * Props for transaction status components
 */
interface TransactionStatusProps {
  transaction: Transaction;
  onRetry?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
  showExplorerLink?: boolean;
  compact?: boolean;
}

interface TransactionStepProps {
  step: TransactionStep;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

interface TransactionProgressProps {
  steps: TransactionStep[];
  currentStep: number;
  compact?: boolean;
}

/**
 * Transaction status badge component
 */
export const TransactionStatusBadge: React.FC<{ status: TxStatus; compact?: boolean }> = ({ 
  status, 
  compact = false 
}) => {
  const getStatusStyle = (status: TxStatus) => {
    const baseClasses = compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
    const roundedClasses = 'rounded-full font-medium';
    
    switch (status) {
      case 'idle':
        return `${baseClasses} ${roundedClasses} bg-gray-100 text-gray-700`;
      case 'pending':
      case 'broadcasting':
      case 'submitted':
        return `${baseClasses} ${roundedClasses} bg-blue-100 text-blue-700 animate-pulse`;
      case 'confirming':
        return `${baseClasses} ${roundedClasses} bg-yellow-100 text-yellow-700`;
      case 'confirmed':
      case 'success':
        return `${baseClasses} ${roundedClasses} bg-green-100 text-green-700`;
      case 'failed':
      case 'timeout':
        return `${baseClasses} ${roundedClasses} bg-red-100 text-red-700`;
      case 'cancelled':
        return `${baseClasses} ${roundedClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} ${roundedClasses} bg-blue-100 text-blue-700`;
    }
  };

  const getStatusText = (status: TxStatus) => {
    switch (status) {
      case 'idle': return 'Ready';
      case 'pending': return 'Pending';
      case 'broadcasting': return 'Broadcasting';
      case 'submitted': return 'Submitted';
      case 'confirming': return 'Confirming';
      case 'confirmed': return 'Confirmed';
      case 'success': return 'Success';
      case 'failed': return 'Failed';
      case 'cancelled': return 'Cancelled';
      case 'timeout': return 'Timeout';
      default: return 'Processing';
    }
  };

  return (
    <span className={getStatusStyle(status)}>
      {getStatusText(status)}
    </span>
  );
};

/**
 * Transaction step indicator component
 */
export const TransactionStepIndicator: React.FC<TransactionStepProps> = ({ 
  step, 
  isActive, 
  isCompleted, 
  index 
}) => {
  const getStepIcon = () => {
    if (step.status === 'success' || isCompleted) {
      return (
        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    
    if (step.status === 'failed') {
      return (
        <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
    
    if (isActive || ['pending', 'broadcasting', 'submitted', 'confirming'].includes(step.status)) {
      return (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      );
    }
    
    return (
      <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium">{index + 1}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-3">
      {getStepIcon()}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
            {step.title}
          </p>
          <TransactionStatusBadge status={step.status} compact />
        </div>
        <p className="text-sm text-gray-500">{step.description}</p>
        {step.error && (
          <p className="text-sm text-red-600 mt-1">{step.error}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Transaction progress indicator component
 */
export const TransactionProgress: React.FC<TransactionProgressProps> = ({ 
  steps, 
  currentStep, 
  compact = false 
}) => {
  const completedSteps = steps.filter(step => step.status === 'success').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{completedSteps}/{steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Transaction Progress</h3>
        <span className="text-sm text-gray-500">{completedSteps}/{steps.length} completed</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <TransactionStepIndicator
            key={step.id}
            step={step}
            isActive={index === currentStep}
            isCompleted={step.status === 'success'}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Main transaction status display component
 */
export const TransactionStatusDisplay: React.FC<TransactionStatusProps> = ({
  transaction,
  onRetry,
  onCancel,
  onDismiss,
  showExplorerLink = true,
  compact = false
}) => {
  const [isExpanded] = useState(!compact);

  const handleExplorerClick = () => {
    if (transaction.explorerUrl) {
      window.open(transaction.explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const canRetry = transaction.canRetry && onRetry;
  const canCancel = ['idle', 'pending'].includes(transaction.status) && onCancel;

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TransactionStatusBadge status={transaction.status} compact />
            <div>
              <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
              <p className="text-xs text-gray-500">{transaction.userMessage}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {transaction.txId && showExplorerLink && (
              <button
                onClick={handleExplorerClick}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                View
              </button>
            )}
            
            {canRetry && (
              <button
                onClick={onRetry}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Retry
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {transaction.steps && isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <TransactionProgress
              steps={transaction.steps}
              currentStep={transaction.currentStep || 0}
              compact
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{transaction.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
          </div>
          <TransactionStatusBadge status={transaction.status} />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {/* User Message */}
        <div className="text-sm text-gray-700">
          {transaction.userMessage}
        </div>

        {/* Error Display */}
        {transaction.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">Error</h4>
                <p className="mt-1 text-sm text-red-700">{transaction.error.userMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Multi-step Progress */}
        {transaction.steps && (
          <TransactionProgress
            steps={transaction.steps}
            currentStep={transaction.currentStep || 0}
          />
        )}

        {/* Transaction Details */}
        {transaction.txId && (
          <div className="bg-gray-50 rounded-md p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-mono text-xs text-gray-900 break-all">
                {transaction.txId.substring(0, 20)}...
              </span>
            </div>
            
            {transaction.amount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">{transaction.amount} μSTX</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Created:</span>
              <span>{new Date(transaction.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex space-x-2">
          {canRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Retry Transaction
            </button>
          )}
          
          {canCancel && (
            <button
              onClick={onCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
        
        <div className="flex space-x-2">
          {transaction.txId && showExplorerLink && (
            <button
              onClick={handleExplorerClick}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
            >
              <span>View in Explorer</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}
          
          {onDismiss && transaction.status === 'success' && (
            <button
              onClick={onDismiss}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Transaction notification toast component
 */
export const TransactionToast: React.FC<{
  transaction: Transaction;
  onDismiss: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}> = ({ transaction, onDismiss, autoHide = true, hideDelay = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && ['success', 'failed', 'cancelled'].includes(transaction.status)) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Allow fade out animation
      }, hideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [transaction.status, autoHide, hideDelay, onDismiss]);

  const getToastStyle = () => {
    const baseClasses = "fixed top-4 right-4 max-w-sm w-full bg-white border rounded-lg shadow-lg transform transition-all duration-300 z-50";
    
    switch (transaction.status) {
      case 'success':
        return `${baseClasses} border-green-200`;
      case 'failed':
      case 'timeout':
        return `${baseClasses} border-red-200`;
      case 'cancelled':
        return `${baseClasses} border-gray-200`;
      default:
        return `${baseClasses} border-blue-200`;
    }
  };

  const getIcon = () => {
    switch (transaction.status) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'failed':
      case 'timeout':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        );
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${getToastStyle()} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
            <p className="text-sm text-gray-600 mt-1">{transaction.userMessage}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing transaction notifications
 */
export function useTransactionNotifications() {
  const [toasts, setToasts] = useState<Transaction[]>([]);

  const showToast = (transaction: Transaction) => {
    setToasts(prev => [...prev.filter(t => t.id !== transaction.id), transaction]);
  };

  const hideToast = (transactionId: string) => {
    setToasts(prev => prev.filter(t => t.id !== transactionId));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts
  };
}

/**
 * Transaction manager component for handling multiple transactions
 */
export const TransactionManager: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { toasts, hideToast } = useTransactionNotifications();

  return (
    <>
      {children}
      
      {/* Render toast notifications */}
      {toasts.map(transaction => (
        <TransactionToast
          key={transaction.id}
          transaction={transaction}
          onDismiss={() => hideToast(transaction.id)}
        />
      ))}
    </>
  );
};