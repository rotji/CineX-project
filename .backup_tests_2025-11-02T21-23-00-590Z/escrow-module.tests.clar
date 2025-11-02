;; ====================================
;; TESTS FOR ESCROW MODULE
;; ====================================
;; Property-based and invariant tests for secure fund management

;; ====================================
;; PROPERTY-BASED TESTS
;; ====================================

;; TEST 1: Deposits should increase campaign balance
(define-public (test-deposit-increase-balance (campaign-id uint) (amount uint))
  (if (<= amount u0) 
      (ok false)
      (let 
        (
          (balance-before (unwrap! (contract-call? .escrow-module get-campaign-balance campaign-id) (err u100)))
        )
        (match (contract-call? .escrow-module deposit-to-campaign campaign-id amount)
          success 
            (let 
              (
                (balance-after (unwrap! (contract-call? .escrow-module get-campaign-balance campaign-id) (err u101)))
              )
              (asserts! (is-eq balance-after (+ balance-before amount)) (err u102))
              (ok true)
            )
          error (ok false)
        )
      )
  )
)

;; TEST 2: Multiple deposits accumulate correctly
(define-public (test-multiple-deposits-accumulate (campaign-id uint) (amount1 uint) (amount2 uint))
  (if (or 
        (<= amount1 u0) (<= amount2 u0)
      )
      (ok false)
      (let 
        (
          (balance-before (unwrap! (contract-call? .escrow-module get-campaign-balance campaign-id) (err u200)))
        )
        (match (contract-call? .escrow-module deposit-to-campaign campaign-id amount1)
          success1
            (match (contract-call? .escrow-module deposit-to-campaign campaign-id amount2)
              success2
                (let 
                  (
                    (balance-after (unwrap! (contract-call? .escrow-module get-campaign-balance campaign-id) (err u201)))
                  )
                  (asserts! (is-eq balance-after (+ balance-before amount1 amount2)) (err u202))
                  (ok true)
                )
              error2 (ok false)
            )
          error1 (ok false)
        )
      )
  )
)

;; TEST 3: Get balance returns non-negative value
(define-public (test-balance-non-negative (campaign-id uint))
  (let 
    (
      (balance (unwrap! (contract-call? .escrow-module get-campaign-balance campaign-id) (err u300)))
    )
    (asserts! (>= balance u0) (err u301))
    (ok true)
  )
)

;; TEST 4: Withdrawal requires authorization (should fail without it)
(define-public (test-withdrawal-without-authorization (campaign-id uint) (amount uint))
  (if (<= amount u0)
      (ok false)
      (match (contract-call? .escrow-module withdraw-from-campaign campaign-id amount)
        success (err u400)  ;; Should NOT succeed
        error (ok true)
      )
  )
)

;; TEST 5: Cannot withdraw more than balance
(define-public (test-cannot-withdraw-more-than-balance (campaign-id uint) (amount uint))
  (let 
    (
      (balance-before (unwrap! (contract-call? .escrow-module get-campaign-balance campaign-id) (err u500)))
    )
    (if (<= amount balance-before)
        (ok false)
        (match (contract-call? .escrow-module withdraw-from-campaign campaign-id amount)
          success (err u501)
          error (ok true)
        )
    )
  )
)

;; TEST 6: Fee collection requires authorization (should fail without it)
(define-public (test-fee-collection-requires-authorization (campaign-id uint) (fee-amount uint))
  (if (<= fee-amount u0)
      (ok false)
      (match (contract-call? .escrow-module collect-campaign-fee campaign-id fee-amount)
        success (err u600)
        error (ok true)
      )
  )
)

;; TEST 7: Emergency withdrawal requires system pause
(define-public (test-emergency-withdrawal-requires-system-pause (amount uint) (recipient principal))
  (if 
    (or 
      (<= amount u0) (is-eq recipient 'SP000000000000000000002Q6VF78)
    )
      (ok false)
      (let 
        (
          (system-paused (unwrap! (contract-call? .escrow-module is-system-paused) (err u700)))
        )
        (if system-paused
            ;; Can attempt withdrawal (may still fail for auth reasons)
            (match (contract-call? .escrow-module emergency-withdraw amount recipient)
              success (ok true)
              error (ok true)
            )
            ;; System not paused: must fail
            (match (contract-call? .escrow-module emergency-withdraw amount recipient)
              success (err u701)
              error (ok true)
            )
        )
      )
  )
)

;; ====================================
;; INVARIANTS
;; ====================================

;; INVARIANT 1: Campaign balance non-negative
(define-read-only (invariant-balance-non-negative (campaign-id uint))
  (let 
    (
      (balance (unwrap! (contract-call? .escrow-module get-campaign-balance campaign-id) (err u800)))
    )
    (>= balance u0)
  )
)

;; INVARIANT 2: Emergency ops only when paused
(define-read-only (invariant-emergency-ops-require-pause)
  (unwrap! (contract-call? .escrow-module is-system-paused) (err u801))
)

;; INVARIANT 3: Module version valid
(define-read-only (invariant-module-version-valid)
  (let 
    (
      (version (unwrap! (contract-call? .escrow-module get-module-version) (err u802)))
    )
    (>= version u1))
)

;; INVARIANT 4: Module active
(define-read-only (invariant-module-is-active)
  (unwrap! (contract-call? .escrow-module is-module-active) (err u803))
)

;; INVARIANT 5: Module name correct
(define-read-only (invariant-module-name-correct)
  (let 
    (
      (name (unwrap! (contract-call? .escrow-module get-module-name) (err u804)))
    )
    (is-eq name "escrow-module")
  )
)

;; ====================================
;; HELPER FUNCTIONS
;; ====================================

;; Check if campaign has sufficient balance
(define-read-only (has-sufficient-balance (campaign-id uint) (amount uint))
  (let 
    (
      (balance (unwrap! (contract-call? .escrow-module get-campaign-balance campaign-id) (err u900)))
    )
    (>= balance amount)
  )
)

;; Check if amount is valid (positive and reasonable)
(define-read-only (is-valid-amount (amount uint))
  (> amount u0)
)

;; Check if recipient is valid (not burn address)
(define-read-only (is-valid-recipient (recipient principal))
  (not (is-eq recipient 'SP000000000000000000002Q6VF78))
)
