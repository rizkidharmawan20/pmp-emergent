// Mock data for Challenge Platform App

export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    instagramConnected: true,
    tiktokConnected: false,
    balance: 250000,
    payoutBalance: 0
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'clipper',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b95bd03b?w=100&h=100&fit=crop&crop=face',
    instagramConnected: true,
    tiktokConnected: true,
    balance: 0,
    payoutBalance: 125000
  }
];

export const mockChallenges = [
  {
    id: '1',
    title: 'Summer Fashion Challenge',
    description: 'Show off your best summer outfits and styling tips. Create engaging content that showcases trending summer fashion pieces.',
    rules: 'Must include #SummerFashion hashtag, minimum 30 seconds video, original content only',
    mediaUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    budget: 1000000,
    budgetUsed: 350000,
    rewardRate: 1000,
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    status: 'active',
    creatorId: '1',
    creatorName: 'John Doe',
    participantCount: 25,
    submissionCount: 18,
    category: 'Fashion'
  },
  {
    id: '2',
    title: 'Tech Review Challenge',
    description: 'Review the latest gadgets and tech products. Share honest opinions and detailed reviews.',
    rules: 'Must be unboxing or review video, minimum 1 minute, show product clearly',
    mediaUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
    budget: 750000,
    budgetUsed: 200000,
    rewardRate: 1500,
    startDate: '2024-07-15',
    endDate: '2024-08-15',
    status: 'active',
    creatorId: '1',
    creatorName: 'John Doe',
    participantCount: 12,
    submissionCount: 8,
    category: 'Technology'
  },
  {
    id: '3',
    title: 'Fitness Motivation',
    description: 'Share your workout routines, fitness tips, and motivational content to inspire others.',
    rules: 'Must show actual workout, include motivational message, minimum 45 seconds',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    budget: 500000,
    budgetUsed: 500000,
    rewardRate: 800,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    status: 'completed',
    creatorId: '1',
    creatorName: 'John Doe',
    participantCount: 35,
    submissionCount: 28,
    category: 'Fitness'
  }
];

export const mockSubmissions = [
  {
    id: '1',
    challengeId: '1',
    userId: '2',
    userName: 'Jane Smith',
    videoUrl: 'https://www.instagram.com/p/example1',
    platform: 'instagram',
    status: 'approved',
    views: 15420,
    likes: 892,
    comments: 45,
    earnings: 15420,
    createdAt: '2024-07-10T08:30:00Z',
    lastTracked: '2024-07-20T14:22:00Z'
  },
  {
    id: '2',
    challengeId: '1',
    userId: '2',
    userName: 'Jane Smith',
    videoUrl: 'https://www.tiktok.com/@user/video/example2',
    platform: 'tiktok',
    status: 'pending',
    views: 8340,
    likes: 567,
    comments: 23,
    earnings: 8340,
    createdAt: '2024-07-15T10:15:00Z',
    lastTracked: '2024-07-20T14:22:00Z'
  }
];

export const mockTransactions = [
  {
    id: '1',
    type: 'topup',
    amount: 500000,
    description: 'Wallet Top-up via Bank Transfer',
    status: 'completed',
    createdAt: '2024-07-01T09:00:00Z'
  },
  {
    id: '2',
    type: 'challenge_payment',
    amount: -350000,
    description: 'Summer Fashion Challenge - Rewards Payment',
    status: 'completed',
    createdAt: '2024-07-15T16:30:00Z'
  },
  {
    id: '3',
    type: 'payout',
    amount: 125000,
    description: 'Earnings Payout to Bank Account',
    status: 'pending',
    createdAt: '2024-07-20T11:45:00Z'
  }
];

export const mockMetrics = {
  totalViews: 23760,
  totalEarnings: 23760,
  averageViewsPerDay: 1188,
  viewsGrowth: 12.5,
  earningsGrowth: 8.3,
  dailyViews: [
    { date: '2024-07-15', views: 1200 },
    { date: '2024-07-16', views: 1450 },
    { date: '2024-07-17', views: 1100 },
    { date: '2024-07-18', views: 1680 },
    { date: '2024-07-19', views: 1890 },
    { date: '2024-07-20', views: 2100 }
  ]
};

export const mockNotifications = [
  {
    id: '1',
    title: 'Challenge Ending Soon',
    message: 'Summer Fashion Challenge ends in 3 days. Submit your entries now!',
    type: 'warning',
    read: false,
    createdAt: '2024-07-20T12:00:00Z'
  },
  {
    id: '2',
    title: 'New Views Update',
    message: 'Your submission gained 500 new views in the last hour!',
    type: 'success',
    read: false,
    createdAt: '2024-07-20T11:30:00Z'
  },
  {
    id: '3',
    title: 'Payout Processed',
    message: 'Your earnings of Rp 125,000 have been processed for payout.',
    type: 'info',
    read: true,
    createdAt: '2024-07-20T09:15:00Z'
  }
];

// Helper functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) return 'Baru saja';
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  return formatDate(dateString);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Aktif';
    case 'completed': return 'Selesai';
    case 'pending': return 'Pending';
    case 'approved': return 'Disetujui';
    case 'rejected': return 'Ditolak';
    default: return status;
  }
};