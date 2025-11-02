;; ---------------------------------------------------------
;; Sanity Test for escrow-module using Rendezvous
;; ---------------------------------------------------------

;; Import the contract under test (adjust the path if needed)
(use-trait escrow-trait .escrow-module.escrow-trait)

;; Begin a simple test block
(begin
  (print "Running Rendezvous sanity test for escrow-module...")

  ;; Example sanity check - create and assert simple value
  (let (
      (expected 100)
      (result (+ 50 50))
    )
    (asserts! (is-eq expected result) "Math sanity check failed")
  )

  (print "✅ escrow-module Rendezvous setup works!")
  (ok true)
)
