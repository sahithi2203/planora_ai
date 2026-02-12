import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { User } from '../types';
import { Check, Download, CreditCard, Zap, Plus, Trash2, Calendar, AlertCircle, Smartphone, Wallet, X, Landmark, CreditCard as CardIcon, FileText, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface BillingProps {
  user: User;
  onUpdateUser?: (updates: Partial<User>) => void;
}

interface PaymentMethod {
    id: string;
    type: 'Visa' | 'Mastercard' | 'RuPay' | 'Google Pay' | 'PhonePe' | 'Paytm';
    detail: string; // Card last4 or UPI ID
    expiry: string; // Expiry date or 'Linked' status
    category: 'card' | 'upi';
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending';
    invoice: string;
}

export const Billing: React.FC<BillingProps> = ({ user, onUpdateUser }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
      { id: '1', type: 'Visa', detail: '•••• 4242', expiry: '12/25', category: 'card' }
  ]);
  
  const [invoices, setInvoices] = useState<Invoice[]>([
      { id: '1', date: 'Sep 24, 2024', amount: '₹499.00', status: 'Paid', invoice: '#INV-2024-001' },
      { id: '2', date: 'Aug 24, 2024', amount: '₹499.00', status: 'Paid', invoice: '#INV-2024-002' },
      { id: '3', date: 'Jul 24, 2024', amount: '₹499.00', status: 'Paid', invoice: '#INV-2024-003' },
  ]);

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [addType, setAddType] = useState<'card' | 'upi'>('card');
  const [formData, setFormData] = useState({
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardNetwork: 'Visa',
      upiId: '',
      upiApp: 'Google Pay'
  });

  const currentPlan = user.plan || 'Pro Plan';
  const isEnterprise = currentPlan === 'Enterprise';
  
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  const formattedNextDate = nextBillingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handlePlanChange = () => {
      setIsUpgrading(true);
      // Simulate API call
      setTimeout(() => {
          const newPlan = isEnterprise ? 'Pro Plan' : 'Enterprise';
          if (onUpdateUser) {
              onUpdateUser({ plan: newPlan });
          }
          
          // Add new invoice if upgrading
          if (!isEnterprise) {
              const newInvoice: Invoice = {
                  id: Date.now().toString(),
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  amount: '₹999.00',
                  status: 'Paid',
                  invoice: `#INV-${Date.now().toString().slice(-6)}`
              };
              setInvoices([newInvoice, ...invoices]);
          }
          
          setIsUpgrading(false);
          setShowManageModal(false);
      }, 1500);
  };

  const handleSaveMethod = () => {
    const id = Date.now().toString();
    let newMethod: PaymentMethod;

    if (addType === 'card') {
        const last4 = formData.cardNumber.length >= 4 ? formData.cardNumber.slice(-4) : '0000';
        newMethod = {
            id,
            type: formData.cardNetwork as any,
            detail: `•••• ${last4}`,
            expiry: formData.expiry || 'MM/YY',
            category: 'card'
        };
    } else {
        newMethod = {
            id,
            type: formData.upiApp as any,
            detail: formData.upiId || 'user@upi',
            expiry: 'Linked',
            category: 'upi'
        };
    }

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddModal(false);
    // Reset Form
    setFormData({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardNetwork: 'Visa',
        upiId: '',
        upiApp: 'Google Pay'
    });
  };

  const removePaymentMethod = (id: string) => {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const generateInvoicePDF = (invoice: Invoice) => {
      const doc = new jsPDF();
      
      // Branding Header
      doc.setFillColor(124, 58, 237); // Violet 600
      doc.rect(0, 0, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Planora", 14, 13);
      
      // Invoice Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.text("INVOICE", 14, 40);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice ID: ${invoice.invoice}`, 14, 50);
      doc.text(`Date: ${invoice.date}`, 14, 55);
      doc.text(`Status: ${invoice.status}`, 14, 60);
      
      // Bill To
      doc.text("Bill To:", 130, 50);
      doc.setFont("helvetica", "bold");
      doc.text(user.name, 130, 55);
      doc.setFont("helvetica", "normal");
      doc.text(user.email, 130, 60);
      
      // Line Items Header
      doc.setFillColor(241, 245, 249); // Slate 100
      doc.rect(14, 70, 182, 10, 'F');
      doc.setFont("helvetica", "bold");
      doc.text("Description", 18, 76);
      doc.text("Amount", 190, 76, { align: "right" });
      
      // Line Item
      doc.setFont("helvetica", "normal");
      const desc = invoice.amount.includes('999') ? 'Enterprise Plan - Monthly Subscription' : 'Pro Plan - Monthly Subscription';
      doc.text(desc, 18, 90);
      doc.text(invoice.amount, 190, 90, { align: "right" });
      
      // Total
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 100, 196, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Total", 150, 110);
      doc.text(invoice.amount, 190, 110, { align: "right" });
      
      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for choosing Planora. For support, contact billing@planora.ai", 14, 280);
      
      doc.save(`Planora_Invoice_${invoice.invoice}.pdf`);
  };

  const getMethodIcon = (method: PaymentMethod) => {
      if (method.category === 'upi') {
          if (method.type === 'Google Pay') return <Smartphone className="w-5 h-5 text-blue-400 relative z-10" />;
          if (method.type === 'PhonePe') return <Zap className="w-5 h-5 text-purple-400 relative z-10" />;
          if (method.type === 'Paytm') return <Wallet className="w-5 h-5 text-cyan-400 relative z-10" />;
          return <Smartphone className="w-5 h-5 text-slate-300 relative z-10" />;
      }
      return <CreditCard className="w-5 h-5 text-slate-300 relative z-10" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <h1 className="text-3xl font-bold text-white">Billing & Plans</h1>

      {/* Current Plan Card */}
      <div className={`glass-card p-8 rounded-2xl relative overflow-hidden transition-all duration-500 border ${isEnterprise ? 'border-amber-500/30' : 'border-violet-500/30'}`}>
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-colors duration-500 ${isEnterprise ? 'bg-amber-600/20' : 'bg-violet-600/20'}`}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{currentPlan}</h2>
                    <Badge color={isEnterprise ? 'yellow' : 'purple'}>Active</Badge>
                </div>
                <p className="text-slate-400 mb-6 max-w-md">
                    You are currently on the {currentPlan}. Your next billing date is <span className="text-white">{formattedNextDate}</span>.
                </p>
                <div className="flex gap-4">
                    <Button 
                        onClick={() => setShowManageModal(true)}
                        className={isEnterprise ? 'bg-slate-700 hover:bg-slate-600' : ''}
                    >
                        Manage Subscription
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
                <span className="text-4xl font-bold text-white">
                    {isEnterprise ? '₹999' : '₹499'}
                    <span className="text-lg text-slate-400 font-normal">/mo</span>
                </span>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Billed monthly
                </span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Payment Methods">
            <div className="space-y-3 mb-4">
                <AnimatePresence>
                    {paymentMethods.map((method) => (
                        <motion.div 
                            key={method.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-10 bg-slate-700 rounded flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                    {getMethodIcon(method)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{method.type} <span className="text-slate-400 text-xs font-normal">({method.detail})</span></p>
                                    <p className="text-xs text-slate-500">
                                        {method.category === 'card' ? `Expires ${method.expiry}` : `Status: ${method.expiry}`}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => removePaymentMethod(method.id)}
                                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {paymentMethods.length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm border border-dashed border-slate-700 rounded-xl">
                        <AlertCircle className="w-5 h-5 mx-auto mb-2 opacity-50" />
                        No payment methods added
                    </div>
                )}
            </div>
            <Button variant="outline" className="w-full text-sm" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Payment Method
            </Button>
        </Card>

        <Card title="Billing History">
            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {invoices.map((item) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group"
                        >
                            <div>
                                <p className="text-sm font-medium text-white">{item.date}</p>
                                <p className="text-xs text-slate-500">{item.invoice}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge color="green" className="text-[10px] px-1.5 py-0">{item.status}</Badge>
                                <span className="text-sm text-slate-300 font-mono w-20 text-right">{item.amount}</span>
                                <Button 
                                    variant="ghost" 
                                    className="p-1 h-8 w-8 rounded-full text-slate-500 hover:text-white"
                                    onClick={() => generateInvoicePDF(item)}
                                >
                                    <Download size={14} />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </Card>
      </div>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
          {showAddModal && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              >
                  <motion.div 
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 20 }}
                      className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                  >
                      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                          <h3 className="font-bold text-white">Add Payment Method</h3>
                          <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                              <X className="w-5 h-5" />
                          </button>
                      </div>
                      
                      <div className="p-6">
                          {/* Method Type Tabs */}
                          <div className="flex p-1 bg-slate-800 rounded-lg mb-6">
                              <button 
                                  onClick={() => setAddType('card')}
                                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${addType === 'card' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                              >
                                  <CardIcon className="w-4 h-4" /> Cards
                              </button>
                              <button 
                                  onClick={() => setAddType('upi')}
                                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${addType === 'upi' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                              >
                                  <Smartphone className="w-4 h-4" /> UPI Apps
                              </button>
                          </div>

                          <div className="space-y-4">
                              {addType === 'card' ? (
                                  <>
                                      <div>
                                          <label className="text-xs font-medium text-slate-400 block mb-1.5">Card Network</label>
                                          <div className="grid grid-cols-3 gap-2">
                                              {['Visa', 'Mastercard', 'RuPay'].map(net => (
                                                  <button 
                                                    key={net}
                                                    onClick={() => setFormData({...formData, cardNetwork: net})}
                                                    className={`py-2 text-xs border rounded-lg transition-all ${formData.cardNetwork === net ? 'bg-violet-500/20 border-violet-500 text-violet-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                                  >
                                                      {net}
                                                  </button>
                                              ))}
                                          </div>
                                      </div>
                                      <div>
                                          <label className="text-xs font-medium text-slate-400 block mb-1.5">Card Number</label>
                                          <input 
                                              type="text" 
                                              placeholder="0000 0000 0000 0000"
                                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
                                              value={formData.cardNumber}
                                              onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                                          />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="text-xs font-medium text-slate-400 block mb-1.5">Expiry Date</label>
                                              <input 
                                                  type="text" 
                                                  placeholder="MM/YY"
                                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
                                                  value={formData.expiry}
                                                  onChange={e => setFormData({...formData, expiry: e.target.value})}
                                              />
                                          </div>
                                          <div>
                                              <label className="text-xs font-medium text-slate-400 block mb-1.5">CVV</label>
                                              <input 
                                                  type="password" 
                                                  placeholder="123"
                                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
                                                  value={formData.cvv}
                                                  onChange={e => setFormData({...formData, cvv: e.target.value})}
                                              />
                                          </div>
                                      </div>
                                      <div>
                                          <label className="text-xs font-medium text-slate-400 block mb-1.5">Cardholder Name</label>
                                          <input 
                                              type="text" 
                                              placeholder="John Doe"
                                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
                                              value={formData.cardName}
                                              onChange={e => setFormData({...formData, cardName: e.target.value})}
                                          />
                                      </div>
                                  </>
                              ) : (
                                  <>
                                      <div>
                                          <label className="text-xs font-medium text-slate-400 block mb-1.5">Select UPI App</label>
                                          <div className="grid grid-cols-3 gap-2">
                                              {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                                                  <button 
                                                    key={app}
                                                    onClick={() => setFormData({...formData, upiApp: app})}
                                                    className={`py-2 text-xs border rounded-lg transition-all flex flex-col items-center gap-1 ${formData.upiApp === app ? 'bg-violet-500/20 border-violet-500 text-violet-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                                  >
                                                      {app === 'Google Pay' && <Smartphone className="w-4 h-4" />}
                                                      {app === 'PhonePe' && <Zap className="w-4 h-4" />}
                                                      {app === 'Paytm' && <Wallet className="w-4 h-4" />}
                                                      {app}
                                                  </button>
                                              ))}
                                          </div>
                                      </div>
                                      <div>
                                          <label className="text-xs font-medium text-slate-400 block mb-1.5">UPI ID / VPA</label>
                                          <input 
                                              type="text" 
                                              placeholder="username@bank"
                                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
                                              value={formData.upiId}
                                              onChange={e => setFormData({...formData, upiId: e.target.value})}
                                          />
                                          <p className="text-[10px] text-slate-500 mt-1">A verification request will be sent to your app.</p>
                                      </div>
                                  </>
                              )}
                          </div>

                          <Button onClick={handleSaveMethod} className="w-full mt-6 shadow-lg shadow-violet-900/20">
                              {addType === 'card' ? 'Save Card Securely' : 'Verify & Add UPI'}
                          </Button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Manage Subscription Modal */}
      <AnimatePresence>
          {showManageModal && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              >
                  <motion.div 
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 20 }}
                      className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                  >
                      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                          <h3 className="font-bold text-white">Manage Subscription</h3>
                          <button onClick={() => setShowManageModal(false)} className="text-slate-400 hover:text-white">
                              <X className="w-5 h-5" />
                          </button>
                      </div>
                      
                      <div className="p-6 space-y-6">
                           {/* Current Plan Summary */}
                           <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5 flex justify-between items-center">
                               <div>
                                   <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Current Plan</div>
                                   <div className="text-xl font-bold text-white">{currentPlan}</div>
                                   <div className="text-sm text-slate-400">{isEnterprise ? '₹999' : '₹499'} / month</div>
                               </div>
                               <Badge color={isEnterprise ? 'yellow' : 'purple'}>Active</Badge>
                           </div>

                           {/* Change Plan Option */}
                           <div className="space-y-3">
                               <h4 className="text-sm font-medium text-slate-300">Available Plans</h4>
                               <div 
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        !isEnterprise 
                                        ? 'bg-violet-600/10 border-violet-500 ring-1 ring-violet-500' 
                                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                    }`}
                                    onClick={() => !isEnterprise && null}
                               >
                                   <div className="flex justify-between items-center mb-1">
                                       <span className="font-bold text-white">Pro Plan</span>
                                       <span className="text-slate-300">₹499/mo</span>
                                   </div>
                                   <ul className="text-xs text-slate-400 space-y-1">
                                       <li>• Unlimited Projects</li>
                                       <li>• Basic Analytics</li>
                                   </ul>
                                   {!isEnterprise && <div className="mt-3 text-xs text-violet-400 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Current Plan</div>}
                               </div>

                               <div 
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        isEnterprise 
                                        ? 'bg-amber-600/10 border-amber-500 ring-1 ring-amber-500' 
                                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                    }`}
                                    onClick={() => !isEnterprise && handlePlanChange()}
                               >
                                   <div className="flex justify-between items-center mb-1">
                                       <span className="font-bold text-white">Enterprise Plan</span>
                                       <span className="text-slate-300">₹999/mo</span>
                                   </div>
                                   <ul className="text-xs text-slate-400 space-y-1">
                                       <li>• Advanced AI Models</li>
                                       <li>• Team Collaboration</li>
                                       <li>• Priority Support</li>
                                   </ul>
                                   {isEnterprise ? (
                                       <div className="mt-3 text-xs text-amber-400 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Current Plan</div>
                                   ) : (
                                       <Button 
                                            className="w-full mt-3 h-8 text-xs bg-white text-slate-900 hover:bg-slate-200" 
                                            isLoading={isUpgrading}
                                            onClick={(e) => { e.stopPropagation(); handlePlanChange(); }}
                                       >
                                           Upgrade Now
                                       </Button>
                                   )}
                               </div>
                           </div>

                           <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                               <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setShowManageModal(false)}>Close</Button>
                               {isEnterprise && (
                                   <Button 
                                        variant="outline" 
                                        className="text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                                        onClick={handlePlanChange}
                                        isLoading={isUpgrading}
                                   >
                                       Downgrade to Pro
                                   </Button>
                               )}
                           </div>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};