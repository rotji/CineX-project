import React, { useState } from 'react';
import { useAuth } from '../auth/StacksAuthContext';
import { createCoEPService } from '../services/coepService';
import { 
  TransactionModal, 
  useTransactionModal, 
  TransactionTemplates,
  type TransactionConfirmationData 
} from '../lib/TransactionModal';
import { useTransactionNotifications, TransactionToast } from '../lib/TransactionStatusUI';
import styles from '../styles/pages/PoolCreate.module.css';
import type { CreatePoolParams, CoEPPool } from '../types';

interface Member {
  id: number;
  name: string;
}

const steps = [
  'Pool Details',
  'Legal Agreement',
  'Invite Members',
  'Review & Create',
];

const PoolCreate: React.FC = () => {
  const { userData, userSession } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    description: '',
    contribution: '',
    maxMembers: '',
    cycleDuration: '',
    category: 'feature' as CoEPPool['category'],
    geographicFocus: 'global' as CoEPPool['geographicFocus'],
    legalAgreement: null as File | null,
    agreementText: '',
    invited: '',
    members: [] as Member[],
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<CoEPPool | null>(null);

  // Transaction notifications
  const { toasts, showToast: showTransactionToast, hideToast } = useTransactionNotifications();

  // Simulated user list for member invite autocomplete
  const userList = [
    { id: 1, name: 'Jane Doe' },
    { id: 2, name: 'John Smith' },
    { id: 3, name: 'Alex Lee' },
    { id: 4, name: 'Sam Green' },
  ];

  // Initialize Co-EP service
  const coepService = createCoEPService(userSession);

  // Transaction modal for confirmation
  const modal = useTransactionModal(async (data: TransactionConfirmationData): Promise<string> => {
    if (data.type === 'pool-create') {
      await handlePoolCreation();
      return 'pool-creation-confirmed'; // Return a transaction ID or confirmation string
    }
    return 'unknown-transaction';
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, legalAgreement: e.target.files ? e.target.files[0] : null });
  };

  const handleInvite = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, invited: e.target.value });
  };

  const addMember = (name: string) => {
    if (!form.members.some(m => m.name === name)) {
      setForm({ ...form, members: [...form.members, { id: Date.now(), name }] });
    }
    setForm({ ...form, invited: '' });
  };

  const removeMember = (id: number) => {
    setForm({ ...form, members: form.members.filter(m => m.id !== id) });
  };

  // Enhanced validation for blockchain requirements
  const validateStep = () => {
    const errs: string[] = [];
    
    // Authentication check
    if (!userData) {
      errs.push('Please connect your wallet to create a pool.');
      setErrors(errs);
      return false;
    }
    
    if (step === 0) {
      if (!form.name.trim() || form.name.trim().length < 3) {
        errs.push('Pool name must be at least 3 characters long.');
      }
      if (!form.description.trim() || form.description.trim().length < 10) {
        errs.push('Pool description must be at least 10 characters long.');
      }
      if (!form.contribution.trim()) {
        errs.push('Contribution per member is required.');
      } else {
        const contributionNum = parseFloat(form.contribution.replace(/[^0-9.]/g, ''));
        if (isNaN(contributionNum) || contributionNum <= 0) {
          errs.push('Contribution amount must be a positive number.');
        }
      }
      if (!form.maxMembers.trim()) {
        errs.push('Max members is required.');
      } else {
        const maxMembersNum = parseInt(form.maxMembers);
        if (isNaN(maxMembersNum) || maxMembersNum < 3 || maxMembersNum > 20) {
          errs.push('Max members must be between 3 and 20.');
        }
      }
      if (!form.cycleDuration.trim()) {
        errs.push('Cycle duration is required.');
      } else {
        const cycleDurationNum = parseInt(form.cycleDuration);
        if (isNaN(cycleDurationNum) || cycleDurationNum < 30 || cycleDurationNum > 365) {
          errs.push('Cycle duration must be between 30 and 365 days.');
        }
      }
    }
    if (step === 1) {
      if (!form.legalAgreement && !form.agreementText.trim()) {
        errs.push('Legal agreement (file or text) is required.');
      }
    }
    if (step === 2) {
      // Note: Members are optional for pool creation, they can join later
    }
    
    setErrors(errs);
    return errs.length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, steps.length - 1));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  // Convert form data to CreatePoolParams
  const preparePoolParams = (): CreatePoolParams => {
    const contributionInMicroSTX = (parseFloat(form.contribution.replace(/[^0-9.]/g, '')) * 1000000).toString();
    const cycleDurationInBlocks = parseInt(form.cycleDuration) * 144; // Assuming ~10 min blocks, 144 blocks per day
    
    return {
      name: form.name.trim(),
      description: form.description.trim(),
      maxMembers: parseInt(form.maxMembers),
      contributionAmount: contributionInMicroSTX,
      cycleDuration: cycleDurationInBlocks,
      category: form.category,
      geographicFocus: form.geographicFocus,
      legalAgreementHash: form.legalAgreement ? `hash-${form.legalAgreement.name}` : undefined
    };
  };

  // Actual pool creation function
  const handlePoolCreation = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const poolParams = preparePoolParams();
      const result = await coepService.createPool(poolParams);

      if (result.success && result.data) {
        setSubmitSuccess(result.data);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
        
        // Show transaction notification
        showTransactionToast({
          id: result.transactionId || `pool-${Date.now()}`,
          title: 'Pool Created Successfully',
          status: 'success',
          userMessage: `Your pool "${result.data.name}" has been created!`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          retryCount: 0,
          canRetry: false,
          maxRetries: 0,
          type: 'pool-create',
          description: `Pool: ${result.data.name}`
        });
      } else {
        throw new Error(result.error || 'Failed to create pool');
      }
    } catch (error) {
      console.error('Pool creation failed:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create pool');
      
      // Show error notification
      showTransactionToast({
        id: `error-${Date.now()}`,
        title: 'Pool Creation Failed',
        status: 'failed',
        userMessage: error instanceof Error ? error.message : 'Pool creation failed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        retryCount: 0,
        canRetry: true,
        maxRetries: 3,
        type: 'pool-create',
        description: `Pool: ${form.name}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    // Show transaction confirmation modal
    const poolParams = preparePoolParams();  
    const contributionInSTX = parseFloat(form.contribution.replace(/[^0-9.]/g, ''));
    
    const confirmationData = TransactionTemplates.poolCreate(
      poolParams.name,
      contributionInSTX,
      poolParams.maxMembers
    );
    
    modal.openModal(confirmationData);
  };

  return (
    <div className={styles.poolCreate}>
      <header className={styles.header}>
        <h1>Create a Funding Pool</h1>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <div className={styles.steps}>
          {steps.map((label, idx) => (
            <span key={label} className={step === idx ? styles.active : ''}>{label}</span>
          ))}
        </div>
      </header>
      <form className={styles.form} onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className={styles.errorBox}>
            {errors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}
        {step === 0 && (
          <section className={styles.section}>
            <label>Pool Name
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="e.g. Hollywood Independent Filmmakers Pool" 
                required 
              />
            </label>
            
            <label>Pool Description
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Describe your pool's purpose, goals, and what kind of projects it will support..." 
                rows={3}
                required 
              />
            </label>
            
            <label>Contribution per Member (STX)
              <input 
                name="contribution" 
                value={form.contribution} 
                onChange={handleChange} 
                placeholder="e.g. 10000" 
                type="number"
                min="1"
                step="0.01"
                required 
              />
              <small>Amount each member contributes per rotation cycle</small>
            </label>
            
            <div className={styles.formRow}>
              <label>Max Members
                <input 
                  name="maxMembers" 
                  value={form.maxMembers} 
                  onChange={handleChange} 
                  placeholder="e.g. 8" 
                  type="number" 
                  min="3" 
                  max="20"
                  required 
                />
                <small>Between 3-20 members</small>
              </label>
              
              <label>Cycle Duration (days)
                <input 
                  name="cycleDuration" 
                  value={form.cycleDuration} 
                  onChange={handleChange} 
                  placeholder="e.g. 90" 
                  type="number" 
                  min="30" 
                  max="365"
                  required 
                />
                <small>30-365 days per rotation</small>
              </label>
            </div>
            
            <div className={styles.formRow}>
              <label>Film Category
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="feature">Feature Film</option>
                  <option value="short-film">Short Film</option>
                  <option value="documentary">Documentary</option>
                  <option value="music-video">Music Video</option>
                  <option value="web-series">Web Series</option>
                </select>
              </label>
              
              <label>Geographic Focus
                <select name="geographicFocus" value={form.geographicFocus} onChange={handleChange} required>
                  <option value="global">Global</option>
                  <option value="hollywood">Hollywood</option>
                  <option value="bollywood">Bollywood</option>
                  <option value="nollywood">Nollywood</option>
                </select>
              </label>
            </div>
          </section>
        )}
        {step === 1 && (
          <section className={styles.section}>
            <label>Legal Agreement (PDF)
              <input type="file" accept=".pdf" onChange={handleFile} />
              {form.legalAgreement && (
                <div className={styles.filePreview}>
                  <span>{form.legalAgreement.name}</span>
                </div>
              )}
            </label>
            <textarea name="agreementText" value={form.agreementText} onChange={handleChange} placeholder="Or paste agreement text here" rows={5} />
            {form.agreementText && (
              <div className={styles.agreementPreview}>
                <strong>Preview:</strong>
                <div>{form.agreementText.slice(0, 120)}{form.agreementText.length > 120 ? '...' : ''}</div>
              </div>
            )}
          </section>
        )}
        {step === 2 && (
          <section className={styles.section}>
            <label>Invite Members</label>
            <input
              name="invited"
              value={form.invited}
              onChange={handleInvite}
              placeholder="Type name and press Enter"
              list="user-list"
              autoComplete="off"
              onKeyDown={e => {
                if (e.key === 'Enter' && form.invited.trim()) {
                  addMember(form.invited.trim());
                  e.preventDefault();
                }
              }}
            />
            <datalist id="user-list">
              {userList.map(u => <option key={u.id} value={u.name} />)}
            </datalist>
            <div className={styles.memberChips}>
              {form.members.map(m => (
                <span key={m.id} className={styles.chip}>
                  {m.name}
                  <button type="button" className={styles.chipRemove} onClick={() => removeMember(m.id)}>&times;</button>
                </span>
              ))}
            </div>
          </section>
        )}
        {step === 3 && (
          <section className={styles.section}>
            <h2>Review Pool Details</h2>
            <div className={styles.reviewContainer}>
              <div className={styles.reviewCard}>
                <h3>Basic Information</h3>
                <ul className={styles.reviewList}>
                  <li><strong>Pool Name:</strong> {form.name}</li>
                  <li><strong>Description:</strong> {form.description.slice(0, 100)}{form.description.length > 100 ? '...' : ''}</li>
                  <li><strong>Category:</strong> {form.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                  <li><strong>Geographic Focus:</strong> {form.geographicFocus.charAt(0).toUpperCase() + form.geographicFocus.slice(1)}</li>
                </ul>
              </div>
              
              <div className={styles.reviewCard}>
                <h3>Pool Structure</h3>
                <ul className={styles.reviewList}>
                  <li><strong>Max Members:</strong> {form.maxMembers}</li>
                  <li><strong>Contribution per Member:</strong> {form.contribution} STX</li>
                  <li><strong>Cycle Duration:</strong> {form.cycleDuration} days</li>
                  <li><strong>Total Pool Value:</strong> {(parseFloat(form.contribution || '0') * parseInt(form.maxMembers || '0')).toLocaleString()} STX</li>
                </ul>
              </div>
              
              <div className={styles.reviewCard}>
                <h3>Legal & Members</h3>
                <ul className={styles.reviewList}>
                  <li><strong>Legal Agreement:</strong> {form.legalAgreement ? form.legalAgreement.name : (form.agreementText ? 'Text provided' : 'None uploaded')}</li>
                  <li><strong>Invited Members:</strong> {form.members.length > 0 ? form.members.map(m => m.name).join(', ') : 'None (members can join later)'}</li>
                </ul>
              </div>
            </div>
            
            {submitError && (
              <div className={styles.errorBox}>
                <strong>Error:</strong> {submitError}
              </div>
            )}
            
            {!userData ? (
              <div className={styles.warningBox}>
                Please connect your wallet to create the pool.
              </div>
            ) : (
              <button 
                type="submit" 
                className={styles.createBtn} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Pool...' : 'Create Pool'}
              </button>
            )}
          </section>
        )}
        <div className={styles.navBtns}>
          {step > 0 && <button type="button" onClick={prevStep} className={styles.navBtn}>Back</button>}
          {step < steps.length - 1 && <button type="button" onClick={nextStep} className={styles.navBtn}>Next</button>}
        </div>
      </form>
      {showToast && (
        <div className={styles.toast}>
          {submitSuccess ? (
            <>
              <strong>🎉 Pool Created Successfully!</strong>
              <p>Your Co-EP pool "{submitSuccess.name}" is now live and ready for members to join.</p>
              <p><strong>Pool ID:</strong> {submitSuccess.id}</p>
            </>
          ) : (
            'Pool created successfully!'
          )}
        </div>
      )}

      {/* Transaction Confirmation Modal */}
      {modal.isOpen && modal.transactionData && (
        <TransactionModal
          isOpen={modal.isOpen}
          transactionData={modal.transactionData}
          currentTransaction={modal.currentTransaction || undefined}
          onConfirm={modal.confirmTransaction}
          onCancel={modal.closeModal}
          isProcessing={modal.isProcessing}
        />
      )}

      {/* Transaction Toast Notifications */}
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

export default PoolCreate;
