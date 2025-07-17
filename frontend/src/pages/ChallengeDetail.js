import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  mockChallenges, 
  mockSubmissions, 
  formatCurrency, 
  formatDate, 
  formatRelativeTime,
  getStatusColor, 
  getStatusText 
} from '../mock/mockData';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Find challenge by ID
    const foundChallenge = mockChallenges.find(c => c.id === id);
    setChallenge(foundChallenge);
    
    // Get submissions for this challenge
    const challengeSubmissions = mockSubmissions.filter(s => s.challengeId === id);
    setSubmissions(challengeSubmissions);
    
    // Check if user has joined
    const userSubmission = challengeSubmissions.find(s => s.userId === user?.id);
    setIsJoined(!!userSubmission);
  }, [id, user?.id]);

  const handleJoinChallenge = async () => {
    if (!user?.instagramConnected && !user?.tiktokConnected) {
      navigate('/profile?tab=accounts');
      return;
    }
    
    setLoading(true);
    // Mock join challenge
    setTimeout(() => {
      setIsJoined(true);
      setLoading(false);
      navigate(`/submit/${id}`);
    }, 1000);
  };

  const handleSubmitVideo = () => {
    navigate(`/submit/${id}`);
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Challenge not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const budgetUsedPercentage = (challenge.budgetUsed / challenge.budget) * 100;
  const daysLeft = Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;
  const isCreator = user?.id === challenge.creatorId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Challenge Image */}
            <div className="lg:w-1/3">
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={challenge.mediaUrl}
                  alt={challenge.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusColor(challenge.status)}>
                    {getStatusText(challenge.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Challenge Info */}
            <div className="lg:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline">{challenge.category}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{challenge.participantCount} participants</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {challenge.description}
              </p>

              {/* Creator Info */}
              <div className="flex items-center space-x-3 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`} />
                  <AvatarFallback>
                    {challenge.creatorName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{challenge.creatorName}</p>
                  <p className="text-sm text-gray-600">Challenge Creator</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!isCreator && (
                  <>
                    {!isJoined ? (
                      <Button 
                        onClick={handleJoinChallenge}
                        disabled={loading || isExpired}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {loading ? 'Joining...' : 'Join Challenge'}
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmitVideo}
                        disabled={isExpired}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        Submit Video
                      </Button>
                    )}
                  </>
                )}
                
                {isCreator && (
                  <Button 
                    onClick={() => navigate(`/challenge/${id}/manage`)}
                    variant="outline"
                  >
                    Manage Challenge
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {!user?.instagramConnected && !user?.tiktokConnected && !isJoined && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your Instagram or TikTok account to participate in challenges.{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-orange-600 hover:text-orange-700"
                onClick={() => navigate('/profile?tab=accounts')}
              >
                Connect now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isExpired && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This challenge has expired. No new submissions are allowed.
            </AlertDescription>
          </Alert>
        )}

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Budget Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {formatCurrency(challenge.budgetUsed)}</span>
                  <span>Total: {formatCurrency(challenge.budget)}</span>
                </div>
                <Progress value={budgetUsedPercentage} className="h-2" />
                <p className="text-xs text-gray-600">
                  {formatCurrency(challenge.budget - challenge.budgetUsed)} remaining
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Started:</span>
                  <span>{formatDate(challenge.startDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ends:</span>
                  <span>{formatDate(challenge.endDate)}</span>
                </div>
                <p className="text-xs text-gray-600">
                  {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Participation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Participants:</span>
                  <span>{challenge.participantCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Submissions:</span>
                  <span>{challenge.submissionCount}</span>
                </div>
                <p className="text-xs text-gray-600">
                  {formatCurrency(challenge.rewardRate)}/1K views
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenge Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">{challenge.rules}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="submissions" className="mt-6">
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://images.unsplash.com/photo-1494790108755-2616b95bd03b?w=100&h=100&fit=crop&crop=face`} />
                        <AvatarFallback>
                          {submission.userName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{submission.userName}</span>
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusText(submission.status)}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatRelativeTime(submission.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{submission.views.toLocaleString()} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{submission.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{submission.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{formatCurrency(submission.earnings)}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(submission.videoUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Video
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {submissions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-600">Be the first to submit a video for this challenge!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 10)
                    .map((submission, index) => (
                      <div key={submission.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://images.unsplash.com/photo-1494790108755-2616b95bd03b?w=100&h=100&fit=crop&crop=face`} />
                          <AvatarFallback>
                            {submission.userName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{submission.userName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{submission.views.toLocaleString()} views</span>
                            <span>{formatCurrency(submission.earnings)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChallengeDetail;