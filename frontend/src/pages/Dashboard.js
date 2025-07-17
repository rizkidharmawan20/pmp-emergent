import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { mockChallenges, formatCurrency, formatDate, getStatusColor, getStatusText } from '../mock/mockData';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Calendar, 
  Eye,
  Heart,
  MessageCircle,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState(mockChallenges);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // Filter challenges based on search and filters
    let filtered = mockChallenges;

    if (searchTerm) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(challenge => challenge.status === selectedStatus);
    }

    setChallenges(filtered);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const categories = ['all', 'Fashion', 'Technology', 'Fitness', 'Food', 'Travel', 'Lifestyle'];
  const statuses = ['all', 'active', 'completed'];

  const handleChallengeClick = (challengeId) => {
    navigate(`/challenge/${challengeId}`);
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRelevantChallenges = () => {
    if (user?.role === 'creator') {
      return challenges.filter(c => c.creatorId === user.id);
    }
    return challenges.filter(c => c.status === 'active');
  };

  const relevantChallenges = getRelevantChallenges();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getUserGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            {user?.role === 'creator' 
              ? 'Manage your challenges and track performance'
              : 'Discover exciting challenges and start earning'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    {user?.role === 'creator' ? 'Total Budget' : 'Total Earnings'}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(user?.role === 'creator' ? user.balance : user.payoutBalance)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {user?.role === 'creator' ? 'Active Challenges' : 'Joined Challenges'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {challenges.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {user?.role === 'creator' ? 'Total Participants' : 'Success Rate'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === 'creator' ? '72' : '85%'}
                  </p>
                </div>
                <Star className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status === 'all' ? 'All Status' : getStatusText(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relevantChallenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleChallengeClick(challenge.id)}
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={challenge.mediaUrl}
                  alt={challenge.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(challenge.status)}>
                    {getStatusText(challenge.status)}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{challenge.title}</CardTitle>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {challenge.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{challenge.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(challenge.budget - challenge.budgetUsed)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Reward Rate</span>
                    <span className="font-semibold">
                      {formatCurrency(challenge.rewardRate)}/1K views
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Participants</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{challenge.participantCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Ends</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(challenge.endDate)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`} />
                        <AvatarFallback>
                          {challenge.creatorName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">by {challenge.creatorName}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {relevantChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            {user?.role === 'creator' && (
              <Button onClick={() => navigate('/create-challenge')}>
                Create Your First Challenge
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;