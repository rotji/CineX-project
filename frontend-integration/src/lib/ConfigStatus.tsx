// Environment configuration React component for development and debugging
// Shows current configuration status and allows network switching

import { useState, useEffect } from 'react';
import { networkManager, validateConfiguration, getConfigurationSummary } from './networkUtils';
import { cineXConfig } from './contracts';

interface ConfigStatusProps {
  showDetails?: boolean;
  allowNetworkSwitch?: boolean;
}

/**
 * Development component to show environment configuration status
 * Only renders in development/debug mode
 */
export function ConfigStatus({ showDetails = false, allowNetworkSwitch = false }: ConfigStatusProps) {
  const [currentNetwork, setCurrentNetwork] = useState<'testnet' | 'mainnet'>(
    networkManager.getCurrentNetwork()
  );
  const [configSummary, setConfigSummary] = useState(getConfigurationSummary());
  const [validation, setValidation] = useState(validateConfiguration());
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [isLoading, setIsLoading] = useState(false);
  
  // Only show in debug mode
  const { isDebugMode } = cineXConfig.getDevelopmentUtils();
  if (!isDebugMode) {
    return null;
  }
  
  useEffect(() => {
    // Listen for network changes
    const unsubscribe = networkManager.addNetworkChangeListener((network) => {
      setCurrentNetwork(network);
      setConfigSummary(getConfigurationSummary());
      setValidation(validateConfiguration());
    });
    
    return unsubscribe;
  }, []);
  
  const handleNetworkSwitch = async (network: 'testnet' | 'mainnet') => {
    if (!allowNetworkSwitch) return;
    
    setIsLoading(true);
    try {
      await networkManager.switchNetwork(network);
    } catch (error) {
      console.error('Failed to switch network:', error);
      alert(`Failed to switch to ${network}: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusColor = () => {
    if (!validation.isValid) return '#ef4444'; // red
    if (validation.warnings.length > 0) return '#f59e0b'; // amber
    if (!configSummary.contractsConfigured) return '#f59e0b'; // amber
    return '#10b981'; // green
  };
  
  const getStatusText = () => {
    if (!validation.isValid) return 'Configuration Error';
    if (!configSummary.contractsConfigured) return 'Contracts Not Configured';
    if (validation.warnings.length > 0) return 'Configuration Warning';
    return 'Configuration OK';
  };
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#1f2937',
      color: 'white',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      minWidth: '200px',
      maxWidth: isExpanded ? '400px' : '200px',
      transition: 'all 0.2s ease'
    }}>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: isExpanded ? '12px' : '0'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            marginRight: '8px'
          }} />
          <span style={{ fontWeight: 'bold' }}>CineX Config</span>
        </div>
        <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </div>
      
      {/* Basic Info (Always Visible) */}
      {!isExpanded && (
        <div style={{ fontSize: '11px', opacity: 0.8 }}>
          {currentNetwork.toUpperCase()} • {getStatusText()}
        </div>
      )}
      
      {/* Expanded Details */}
      {isExpanded && (
        <div>
          {/* Network Section */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Network</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['testnet', 'mainnet'] as const).map((network) => (
                <button
                  key={network}
                  onClick={() => handleNetworkSwitch(network)}
                  disabled={!allowNetworkSwitch || isLoading || currentNetwork === network}
                  style={{
                    background: currentNetwork === network ? '#3b82f6' : '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: allowNetworkSwitch && currentNetwork !== network ? 'pointer' : 'default',
                    opacity: isLoading || (!allowNetworkSwitch && currentNetwork !== network) ? 0.5 : 1
                  }}
                >
                  {network.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Status Section */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Status</div>
            <div style={{ color: getStatusColor(), fontSize: '11px' }}>
              {getStatusText()}
            </div>
          </div>
          
          {/* Configuration Summary */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Configuration</div>
            <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
              <div>Contracts: {configSummary.contractsConfigured ? '✅' : '❌'}</div>
              <div>Features: {configSummary.featuresEnabled.length} enabled</div>
              <div>Debug Mode: {configSummary.developmentMode ? '✅' : '❌'}</div>
            </div>
          </div>
          
          {/* Errors and Warnings */}
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Issues</div>
              <div style={{ fontSize: '11px', lineHeight: '1.3', maxHeight: '100px', overflow: 'auto' }}>
                {validation.errors.map((error, index) => (
                  <div key={`error-${index}`} style={{ color: '#ef4444', marginBottom: '2px' }}>
                    ❌ {error}
                  </div>
                ))}
                {validation.warnings.map((warning, index) => (
                  <div key={`warning-${index}`} style={{ color: '#f59e0b', marginBottom: '2px' }}>
                    ⚠️ {warning}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Contract Addresses (if configured) */}
          {configSummary.contractsConfigured && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Contracts</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                Click to view in explorer
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Hook to access configuration and network state
 */
export function useConfigStatus() {
  const [currentNetwork, setCurrentNetwork] = useState(networkManager.getCurrentNetwork());
  const [configSummary, setConfigSummary] = useState(getConfigurationSummary());
  
  useEffect(() => {
    const unsubscribe = networkManager.addNetworkChangeListener((network) => {
      setCurrentNetwork(network);
      setConfigSummary(getConfigurationSummary());
    });
    
    return unsubscribe;
  }, []);
  
  return {
    currentNetwork,
    configSummary,
    validation: validateConfiguration(),
    networkManager,
    cineXConfig
  };
}

/**
 * Environment configuration panel for development
 */
export function DevConfigPanel() {
  const { isDebugMode } = cineXConfig.getDevelopmentUtils();
  
  if (!isDebugMode) {
    return null;
  }
  
  return (
    <ConfigStatus 
      showDetails={true}
      allowNetworkSwitch={true}
    />
  );
}