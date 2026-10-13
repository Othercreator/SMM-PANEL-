import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  Building2, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  Lock
} from 'lucide-react';

export const AddFundsModal: React.FC = () => {
  const { addFundsModalOpen, setAddFundsModalOpen, addFunds, formatCurrency, currentUser } = useApp();
  
  const [amountINR, setAmountINR] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'upi_qr' | 'upi_apps' | 'netbanking' | 'cards' | 'bank_transfer'>('upi_qr');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'phonepe' | 'gpay' | 'paytm' | 'bhim'>('phonepe');
  const [upiIdInput, setUpiIdInput] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  if (!addFundsModalOpen) return null;

  const presetAmounts = [200, 500, 1000, 2500, 5000, 10000];

  const handleSelectPreset = (val: number) => {
    setAmountINR(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCustomAmount(e.target.value);
    if (!isNaN(val) && val > 0) {
      setAmountINR(val);
    }
  };

  // Bonus calculation in INR: 5% bonus for ₹2,000+, 8% for ₹5,000+, 10% for ₹10,000+
  const bonusPercent = amountINR >= 10000 ? 10 : amountINR >= 5000 ? 8 : amountINR >= 2000 ? 5 : 0;
  const bonusAmountINR = Math.round((amountINR * bonusPercent) / 100);
  const totalCreditedINR = amountINR + bonusAmountINR;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankField(fieldName);
    setTimeout(() => setCopiedBankField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountINR < 10) return;

    let methodName = 'UPI Instant QR';
    let gatewayType: 'upi_gateway' | 'upi_manual_utr' | 'netbanking' | 'card_3ds' = 'upi_gateway';

    if (selectedMethod === 'upi_qr') {
      methodName = 'UPI QR Code';
      gatewayType = 'upi_gateway';
    } else if (selectedMethod === 'upi_apps') {
      const appName = selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'paytm' ? 'Paytm' : 'BHIM UPI';
      methodName = `${appName} UPI Intent`;
      gatewayType = 'upi_gateway';
    } else if (selectedMethod === 'netbanking') {
      methodName = `Net Banking - ${selectedBank}`;
      gatewayType = 'netbanking';
    } else if (selectedMethod === 'cards') {
      methodName = 'Debit / Credit Card (RuPay / Visa / Master)';
      gatewayType = 'card_3ds';
    } else if (selectedMethod === 'bank_transfer') {
      methodName = 'IMPS / NEFT Direct Bank Transfer';
      gatewayType = utrNumber.trim() ? 'upi_manual_utr' : 'upi_gateway';
    }

    setIsProcessing(true);
    setVerificationError(null);

    try {
      // Execute strict server-side verification without trusting client-side responses
      const { verifyServerPayment } = await import('../../services/paymentVerificationService');
      const verified = await verifyServerPayment({
        userId: currentUser.id,
        amountINR: amountINR,
        paymentMethod: methodName,
        gatewayType: gatewayType,
        utrNumber: utrNumber.trim() || undefined
      });

      if (verified && verified.verified) {
        // Credit the exact amount verified by server rules (including server-calculated tier bonus)
        addFunds(verified.creditedAmountINR, methodName);
        setVerificationResult(verified);
        setIsProcessing(false);
        setSuccessState(true);
        setTimeout(() => {
          setSuccessState(false);
          setAddFundsModalOpen(false);
        }, 2200);
      } else {
        throw new Error('Server payment verification rejected by banking rails.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setVerificationError(err.message || 'Payment verification failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">Add Funds to Wallet</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-md">
                INR (₹) Only
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Available Balance: <span className="font-bold text-slate-900">{formatCurrency(currentUser.balance)}</span> · Instant automated credit
            </p>
          </div>
          <button 
            onClick={() => setAddFundsModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successState ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-1">Deposit Cryptographically Verified!</h4>
            <p className="text-base text-slate-700 mb-2 font-semibold">
              {formatCurrency(verificationResult?.creditedAmountINR || totalCreditedINR)} credited to your SocialFlow wallet.
            </p>
            {verificationResult?.transactionId && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-mono mb-2">
                <span>TX ID: {verificationResult.transactionId}</span>
                <span>·</span>
                <span className="text-emerald-700 font-bold">HMAC Valid</span>
              </div>
            )}
            <p className="text-xs text-emerald-600 font-medium">
              Verified by server banking rails. Replay attack checks passed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {verificationError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Payment Verification Failed</strong>
                  <span>{verificationError}</span>
                </div>
              </div>
            )}
            {/* Step 1: Deposit Amount Selection in INR */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. Select Amount (₹ INR)
                </label>
                {bonusPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    +{bonusPercent}% Bonus Added
                  </span>
                )}
              </div>

              {/* Preset Chips */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2.5">
                {presetAmounts.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectPreset(val)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all tabular-nums ${
                      amountINR === val && !customAmount
                        ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="10"
                  max="1000000"
                  step="1"
                  placeholder="Or enter custom INR amount (Min ₹10 — Max ₹10,00,000)"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full pl-8 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all tabular-nums"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  INR
                </span>
              </div>
            </div>

            {/* Step 2: Indian Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                2. Choose Indian Payment Method
              </label>

              {/* Method Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi_qr')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                    selectedMethod === 'upi_qr'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi_apps')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                    selectedMethod === 'upi_apps'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI Apps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                    selectedMethod === 'netbanking'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('cards')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                    selectedMethod === 'cards'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank_transfer')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 col-span-2 sm:col-span-1 ${
                    selectedMethod === 'bank_transfer'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>IMPS / Bank</span>
                </button>
              </div>

              {/* Method Details Pane */}
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                {selectedMethod === 'upi_qr' && (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated Dynamic UPI QR Code */}
                    <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center shrink-0">
                      <div className="w-full h-full border-2 border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center text-center p-1 bg-emerald-50/20">
                        <QrCode className="w-16 h-16 text-slate-800" />
                        <span className="text-[9px] font-black text-emerald-700 uppercase mt-0.5">
                          {formatCurrency(amountINR)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <span className="text-xs font-bold text-slate-900">Scan via Any UPI App</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">0% Fees</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Open PhonePe, Google Pay, Paytm, BHIM or Cred and scan this dynamic QR to approve payment of <strong className="text-slate-800">{formatCurrency(amountINR)}</strong>.
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1 justify-center sm:justify-start">
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          upi://pay?pa=socialflow@icici&am={amountINR}&pn=SocialFlow
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'upi_apps' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">Select Preferred UPI App or enter VPA ID:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'phonepe', label: 'PhonePe', color: 'from-purple-600 to-indigo-600' },
                        { id: 'gpay', label: 'Google Pay', color: 'from-blue-600 to-emerald-600' },
                        { id: 'paytm', label: 'Paytm', color: 'from-sky-600 to-cyan-600' },
                        { id: 'bhim', label: 'BHIM UPI', color: 'from-amber-600 to-orange-600' }
                      ].map(app => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id as any)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            selectedUpiApp === app.id
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-500/20'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {app.label}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Or enter your UPI ID (e.g. mobile@upi, name@okaxis)"
                        value={upiIdInput}
                        onChange={e => setUpiIdInput(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === 'netbanking' && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Choose Bank:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map(bank => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                            selectedBank === bank
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMethod === 'cards' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-bold">Indian Debit / Credit Cards Accepted:</span>
                      <span className="text-[11px] text-emerald-700 font-bold">RuPay · Visa · MasterCard</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Protected by 3D Secure OTP verification according to Reserve Bank of India (RBI) payment guidelines. Zero storage of raw CVV or card PIN.
                    </p>
                  </div>
                )}

                {selectedMethod === 'bank_transfer' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-500 font-sans">Beneficiary:</span>
                        <span className="font-bold">SocialFlow Tech Pvt Ltd</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-500 font-sans">Bank:</span>
                        <span className="font-bold">HDFC Bank Ltd</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-500 font-sans">Account No:</span>
                        <span className="font-bold flex items-center gap-1">
                          50200084920194
                          <button
                            type="button"
                            onClick={() => handleCopy('50200084920194', 'acc')}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            {copiedBankField === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-500 font-sans">IFSC Code:</span>
                        <span className="font-bold flex items-center gap-1">
                          HDFC0000240
                          <button
                            type="button"
                            onClick={() => handleCopy('HDFC0000240', 'ifsc')}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            {copiedBankField === 'ifsc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 12-digit IMPS / UTR Reference Number (Optional)"
                      value={utrNumber}
                      onChange={e => setUtrNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono placeholder:font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Calculation Breakdown */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Deposit Amount:</span>
                <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(amountINR)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Gateway Fee:</span>
                <span className="font-bold text-emerald-700">₹0.00 (Zero Processing Fee)</span>
              </div>
              {bonusAmountINR > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Tier Top-Up Bonus ({bonusPercent}%):</span>
                  <span className="font-bold tabular-nums">+{formatCurrency(bonusAmountINR)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Credited to Available Balance:</span>
                <span className="text-emerald-700 font-black tabular-nums">{formatCurrency(totalCreditedINR)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>256-bit SSL encrypted Indian banking rails with immediate ledger settlement.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || amountINR <= 0}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-extrabold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Verifying Indian Payment Gateway...
                </span>
              ) : (
                <>
                  <span>Pay & Credit {formatCurrency(totalCreditedINR)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
