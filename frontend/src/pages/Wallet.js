import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { mockTransactions, formatCurrency, formatDate, formatRelativeTime } from '../mock/mockData';
import { 
  Wallet as WalletIcon, 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  XCircle,
  Info
} from 'lucide-react';

const Wallet = () => {
  const { user, updateBalance } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleTopUp = async () => {
    if (!topUpAmount || !paymentMethod) return;
    
    setLoading(true);
    
    try {
      // Mock top-up process
      const amount = parseFloat(topUpAmount);
      const newTransaction = {
        id: Date.now().toString(),
        type: 'topup',
        amount,
        description: `Wallet Top-up via ${paymentMethod}`,
        status: 'completed',
        createdAt: new Date().toISOString()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      updateBalance(user.balance + amount, user.payoutBalance);
      setTopUpAmount('');
      setPaymentMethod('');
    } catch (error) {
      console.error('Top-up failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) > user.payoutBalance) return;
    
    setLoading(true);
    
    try {
      // Mock payout process
      const amount = parseFloat(payoutAmount);
      const newTransaction = {
        id: Date.now().toString(),
        type: 'payout',
        amount,
        description: 'Earnings Payout to Bank Account',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      updateBalance(user.balance, user.payoutBalance - amount);
      setPayoutAmount('');
    } catch (error) {
      console.error('Payout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'payout':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case 'challenge_payment':
        return <Minus className="h-4 w-4 text-red-600" />;
      default:
        return <WalletIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'topup':
        return 'text-green-600';
      case 'payout':
        return 'text-blue-600';
      case 'challenge_payment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'topup' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutgoing = transactions
    .filter(t => t.type === 'payout' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-gray-600">
            Manage your balance, top-up funds, and request payouts
          </p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    {user?.role === 'creator' ? 'Creator Balance' : 'Available Balance'}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(user?.balance || 0)}
                  </p>
                  <p className="text-purple-100 text-xs mt-1">
                    {user?.role === 'creator' ? 'For creating challenges' : 'For withdrawals'}
                  </p>
                </div>
                <WalletIcon className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    {user?.role === 'creator' ? 'Earnings' : 'Payout Balance'}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(user?.payoutBalance || 0)}
                  </p>
                  <p className="text-green-100 text-xs mt-1">
                    {user?.role === 'creator' ? 'From completed challenges' : 'Ready for payout'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transactions.length}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    This month
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Top Up
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Top Up Wallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topUpAmount">Amount</Label>
                  <Input
                    id="topUpAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="e_wallet">E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleTopUp}
                  disabled={!topUpAmount || !paymentMethod || loading}
                  className="w-full"
                >
                  {loading ? 'Processing...' : `Top Up ${formatCurrency(parseFloat(topUpAmount) || 0)}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!user?.payoutBalance || user?.payoutBalance === 0}>
                <Banknote className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Available for payout: {formatCurrency(user?.payoutBalance || 0)}
                  </AlertDescription>
                </Alert>
                <div>
                  <Label htmlFor="payoutAmount">Amount</Label>
                  <Input
                    id="payoutAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    max={user?.payoutBalance || 0}
                  />
                </div>
                <Button
                  onClick={handlePayout}
                  disabled={!payoutAmount || parseFloat(payoutAmount) > (user?.payoutBalance || 0) || loading}
                  className="w-full"
                >
                  {loading ? 'Processing...' : `Request Payout ${formatCurrency(parseFloat(payoutAmount) || 0)}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Income Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Top-ups</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(totalIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Challenge Earnings</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(user?.payoutBalance || 0)}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Income</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(totalIncome + (user?.payoutBalance || 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span>Expense Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Payouts</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(totalOutgoing)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Challenge Costs</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(transactions
                          .filter(t => t.type === 'challenge_payment')
                          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Expenses</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(totalOutgoing + transactions
                            .filter(t => t.type === 'challenge_payment')
                            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {formatRelativeTime(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'challenge_payment' ? '-' : '+'}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(transaction.status)}
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {transactions.length === 0 && (
                    <div className="text-center py-8">
                      <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                      <p className="text-gray-600">Your transaction history will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Wallet;